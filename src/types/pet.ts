export interface PetApiResponse {
  title: string;
  description: string;
  url: string;
  created: string;
}

export interface Pet extends PetApiResponse {
  id: string;
  createdAt: Date;
}

export type SortKey = "az" | "za" | "newest" | "oldest";
