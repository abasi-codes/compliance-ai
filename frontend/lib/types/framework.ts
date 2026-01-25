import { UUID } from './common';

export interface CSFSubcategory {
  id: UUID;
  category_id: UUID;
  code: string;
  description: string;
}

export interface CSFCategory {
  id: UUID;
  function_id: UUID;
  code: string;
  name: string;
  description: string | null;
  subcategories: CSFSubcategory[] | null;
}

export interface CSFFunction {
  id: UUID;
  code: string;
  name: string;
  description: string | null;
  categories: CSFCategory[] | null;
}

export interface FrameworkSummary {
  functions_count: number;
  categories_count: number;
  subcategories_count: number;
}
