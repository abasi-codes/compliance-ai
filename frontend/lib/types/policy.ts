import { UUID } from './common';

export interface Policy {
  id: UUID;
  assessment_id: UUID;
  name: string;
  description: string | null;
  version: string | null;
  owner: string | null;
  file_path: string | null;
  content_text: string | null;
  created_at: string;
  updated_at: string;
}

export interface PolicyUploadResponse {
  policy: Policy;
  text_extracted: boolean;
  text_length: number | null;
  extraction_error: string | null;
}

export interface PolicyMapping {
  id: UUID;
  policy_id: UUID;
  subcategory_id: UUID;
  confidence_score: number | null;
  is_approved: boolean;
  approved_by_id: UUID | null;
  approved_at: string | null;
  created_at: string;
  subcategory_code: string | null;
  policy_name: string | null;
}
