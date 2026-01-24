import uuid

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class CSFFunction(Base):
    """NIST CSF 2.0 Function (e.g., GOVERN, IDENTIFY, PROTECT, DETECT, RESPOND, RECOVER)"""

    __tablename__ = "csf_functions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    code: Mapped[str] = mapped_column(String(10), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)

    categories: Mapped[list["CSFCategory"]] = relationship(back_populates="function")


class CSFCategory(Base):
    """NIST CSF 2.0 Category (e.g., GV.OC, GV.RM, ID.AM)"""

    __tablename__ = "csf_categories"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    function_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("csf_functions.id"), nullable=False
    )
    code: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)

    function: Mapped["CSFFunction"] = relationship(back_populates="categories")
    subcategories: Mapped[list["CSFSubcategory"]] = relationship(
        back_populates="category"
    )


class CSFSubcategory(Base):
    """NIST CSF 2.0 Subcategory (e.g., GV.OC-01, ID.AM-01)"""

    __tablename__ = "csf_subcategories"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    category_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("csf_categories.id"), nullable=False
    )
    code: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)

    category: Mapped["CSFCategory"] = relationship(back_populates="subcategories")
    questions: Mapped[list["InterviewQuestion"]] = relationship(back_populates="subcategory")


from app.models.interview import InterviewQuestion
