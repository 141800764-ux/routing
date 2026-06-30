interface APIErrorResponse {
  success: false;
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface PaginatedSearchParams {
  page?: number;
  pageSize?: number;
  query?: string;
  filter?: string;
  sort?: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  username: string;
  bio?: string;
  image?: string;
  location?: string;
  portfolio?: string;
  reputation: number;
}

interface Collection {
  _id: string;
  author: string | Author;
  question: Question;
}