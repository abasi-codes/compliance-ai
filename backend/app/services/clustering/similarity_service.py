"""Service for computing similarity between requirements."""

import uuid
from typing import Optional
import math

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.unified_framework import FrameworkRequirement
from app.services.clustering.embedding_service import EmbeddingService


class SimilarityService:
    """Service for computing semantic similarity between requirements.

    Uses cosine similarity on embedding vectors to find related requirements
    across different frameworks.
    """

    def __init__(self, db: Session):
        self.db = db
        self.embedding_service = EmbeddingService(db)

    @staticmethod
    def cosine_similarity(vec1: list[float], vec2: list[float]) -> float:
        """Compute cosine similarity between two vectors.

        Args:
            vec1: First embedding vector
            vec2: Second embedding vector

        Returns:
            Cosine similarity score (0.0 to 1.0)
        """
        if not vec1 or not vec2 or len(vec1) != len(vec2):
            return 0.0

        dot_product = sum(a * b for a, b in zip(vec1, vec2))
        norm1 = math.sqrt(sum(a * a for a in vec1))
        norm2 = math.sqrt(sum(b * b for b in vec2))

        if norm1 == 0 or norm2 == 0:
            return 0.0

        return dot_product / (norm1 * norm2)

    @staticmethod
    def euclidean_distance(vec1: list[float], vec2: list[float]) -> float:
        """Compute Euclidean distance between two vectors.

        Args:
            vec1: First embedding vector
            vec2: Second embedding vector

        Returns:
            Euclidean distance (lower = more similar)
        """
        if not vec1 or not vec2 or len(vec1) != len(vec2):
            return float('inf')

        return math.sqrt(sum((a - b) ** 2 for a, b in zip(vec1, vec2)))

    def find_similar_requirements(
        self,
        requirement_id: uuid.UUID,
        top_k: int = 20,
        threshold: float = 0.75,
        exclude_same_framework: bool = True,
        only_assessable: bool = True,
    ) -> list[tuple[FrameworkRequirement, float]]:
        """Find requirements most similar to the given requirement.

        Args:
            requirement_id: The source requirement's UUID
            top_k: Maximum number of results to return
            threshold: Minimum similarity score (0.0 to 1.0)
            exclude_same_framework: If True, only return from different frameworks
            only_assessable: If True, only return assessable requirements

        Returns:
            List of (requirement, similarity_score) tuples, sorted by similarity
        """
        # Get source requirement embedding
        source = (
            self.db.query(FrameworkRequirement)
            .filter(FrameworkRequirement.id == requirement_id)
            .first()
        )

        if not source or not source.embedding:
            return []

        source_embedding = source.embedding

        # Query all requirements with embeddings
        query = self.db.query(FrameworkRequirement).filter(
            FrameworkRequirement.id != requirement_id,
            FrameworkRequirement.embedding.isnot(None),
        )

        if exclude_same_framework:
            query = query.filter(
                FrameworkRequirement.framework_id != source.framework_id
            )

        if only_assessable:
            query = query.filter(FrameworkRequirement.is_assessable == True)

        candidates = query.all()

        # Compute similarities
        results = []
        for candidate in candidates:
            similarity = self.cosine_similarity(source_embedding, candidate.embedding)
            if similarity >= threshold:
                results.append((candidate, similarity))

        # Sort by similarity (descending) and take top_k
        results.sort(key=lambda x: x[1], reverse=True)
        return results[:top_k]

    def find_similar_to_text(
        self,
        text: str,
        top_k: int = 20,
        threshold: float = 0.75,
        framework_id: Optional[uuid.UUID] = None,
        only_assessable: bool = True,
    ) -> list[tuple[FrameworkRequirement, float]]:
        """Find requirements similar to arbitrary text.

        Useful for finding requirements that match a control or policy description.

        Args:
            text: The text to find similar requirements for
            top_k: Maximum number of results to return
            threshold: Minimum similarity score
            framework_id: Optional filter to specific framework
            only_assessable: If True, only return assessable requirements

        Returns:
            List of (requirement, similarity_score) tuples
        """
        # Generate embedding for the text
        text_embedding = self.embedding_service.generate_embedding(text)

        # Query all requirements with embeddings
        query = self.db.query(FrameworkRequirement).filter(
            FrameworkRequirement.embedding.isnot(None)
        )

        if framework_id:
            query = query.filter(FrameworkRequirement.framework_id == framework_id)

        if only_assessable:
            query = query.filter(FrameworkRequirement.is_assessable == True)

        candidates = query.all()

        # Compute similarities
        results = []
        for candidate in candidates:
            similarity = self.cosine_similarity(text_embedding, candidate.embedding)
            if similarity >= threshold:
                results.append((candidate, similarity))

        # Sort by similarity (descending) and take top_k
        results.sort(key=lambda x: x[1], reverse=True)
        return results[:top_k]

    def compute_pairwise_similarities(
        self,
        requirement_ids: list[uuid.UUID],
    ) -> dict[tuple[uuid.UUID, uuid.UUID], float]:
        """Compute pairwise similarities for a set of requirements.

        Args:
            requirement_ids: List of requirement UUIDs

        Returns:
            Dictionary mapping (id1, id2) pairs to similarity scores
        """
        # Fetch all requirements
        requirements = (
            self.db.query(FrameworkRequirement)
            .filter(
                FrameworkRequirement.id.in_(requirement_ids),
                FrameworkRequirement.embedding.isnot(None),
            )
            .all()
        )

        req_map = {req.id: req for req in requirements}

        # Compute pairwise similarities
        similarities = {}
        for i, id1 in enumerate(requirement_ids):
            for id2 in requirement_ids[i + 1:]:
                if id1 in req_map and id2 in req_map:
                    similarity = self.cosine_similarity(
                        req_map[id1].embedding,
                        req_map[id2].embedding,
                    )
                    similarities[(id1, id2)] = similarity
                    similarities[(id2, id1)] = similarity

        return similarities

    def build_similarity_matrix(
        self,
        framework_ids: Optional[list[uuid.UUID]] = None,
        only_assessable: bool = True,
        threshold: float = 0.0,
    ) -> tuple[list[FrameworkRequirement], list[list[float]]]:
        """Build a similarity matrix for requirements.

        Args:
            framework_ids: Optional list of frameworks to include
            only_assessable: If True, only include assessable requirements
            threshold: Minimum similarity to include (others set to 0)

        Returns:
            Tuple of (list of requirements, similarity matrix)
        """
        query = self.db.query(FrameworkRequirement).filter(
            FrameworkRequirement.embedding.isnot(None)
        )

        if framework_ids:
            query = query.filter(FrameworkRequirement.framework_id.in_(framework_ids))

        if only_assessable:
            query = query.filter(FrameworkRequirement.is_assessable == True)

        requirements = query.all()
        n = len(requirements)

        # Build similarity matrix
        matrix = [[0.0] * n for _ in range(n)]

        for i in range(n):
            matrix[i][i] = 1.0  # Self-similarity
            for j in range(i + 1, n):
                similarity = self.cosine_similarity(
                    requirements[i].embedding,
                    requirements[j].embedding,
                )
                if similarity >= threshold:
                    matrix[i][j] = similarity
                    matrix[j][i] = similarity

        return requirements, matrix

    def find_cross_framework_candidates(
        self,
        source_framework_id: uuid.UUID,
        target_framework_id: uuid.UUID,
        top_k_per_requirement: int = 5,
        threshold: float = 0.75,
    ) -> list[tuple[FrameworkRequirement, FrameworkRequirement, float]]:
        """Find candidate mappings between two frameworks.

        Args:
            source_framework_id: Source framework UUID
            target_framework_id: Target framework UUID
            top_k_per_requirement: Max candidates per source requirement
            threshold: Minimum similarity threshold

        Returns:
            List of (source, target, similarity) tuples
        """
        # Get source requirements
        source_reqs = (
            self.db.query(FrameworkRequirement)
            .filter(
                FrameworkRequirement.framework_id == source_framework_id,
                FrameworkRequirement.is_assessable == True,
                FrameworkRequirement.embedding.isnot(None),
            )
            .all()
        )

        # Get target requirements
        target_reqs = (
            self.db.query(FrameworkRequirement)
            .filter(
                FrameworkRequirement.framework_id == target_framework_id,
                FrameworkRequirement.is_assessable == True,
                FrameworkRequirement.embedding.isnot(None),
            )
            .all()
        )

        candidates = []

        for source in source_reqs:
            # Find top similar targets
            similarities = []
            for target in target_reqs:
                sim = self.cosine_similarity(source.embedding, target.embedding)
                if sim >= threshold:
                    similarities.append((target, sim))

            # Sort and take top-k
            similarities.sort(key=lambda x: x[1], reverse=True)
            for target, sim in similarities[:top_k_per_requirement]:
                candidates.append((source, target, sim))

        return candidates
