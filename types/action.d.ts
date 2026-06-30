interface SigninWithOAuthParams {
  provider: string;
}

interface CreateQuestionParams {
  title: string;
  content: string;
  tags: string[];
}

interface EditQuestionParams {
  questionId: string;
  title: string;
  content: string;
  tags: string[];
}

interface DeleteQuestionParams {
  questionId: string;
}

interface CollectionBaseParams {
  questionId: string;
}

interface GetUserParams {
  userId: string;
}

interface GetUserQuestionsParams 
extends Omit<PaginatedSearchParams, "query" | "filter" | "sort"> {
  userId: string;
}