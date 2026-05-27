export interface PetApiResponse {
  title: string;
  description: string;
  url: string;
  created: string;
}

export interface Pet extends PetApiResponse {
  id: string;
  createdAt: Date;
  /** Original index in the API response; used as the basis for newest/oldest
   * since the endpoint returns an identical `created` timestamp for every pet. */
  order: number;
}

export type SortKey = "az" | "za" | "newest" | "oldest";
