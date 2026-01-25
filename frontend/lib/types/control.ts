import { UUID } from './common';

export interface Control {
  id: UUID;
  assessment_id: UUID;
  identifier: string;
  name: string;
  description: string | null;
  owner: string | null;
  control_type: string | null;
  implementation_status: string | null;
  created_at: string;
  updated_at: string;
}

export interface ControlUploadError {
  row: number;
  field: string | null;
  message: string;
}

export interface ControlUploadResponse {
  total_rows: number;
  successful: number;
  failed: number;
  errors: ControlUploadError[] | null;
  controls: Control[];
}

export interface ControlMapping {
  id: UUID;
  control_id: UUID;
  subcategory_id: UUID;
  confidence_score: number | null;
  is_approved: boolean;
  approved_by_id: UUID | null;
  approved_at: string | null;
  created_at: string;
  subcategory_code: string | null;
  control_name: string | null;
}
