import { Sign } from "crypto";

const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  ASK_QUESTION: "/ask-question",
  profile: (userId: string) => `/profile/${userId}`,
  QUESTION: (questionId: string) => `/question/${questionId}`,
  TAG: (tagName: string) => `/tag/${tagName}`,
  SignInWithOAuth: "/api/auth/signin-with-oauth",
};
export default ROUTES;
