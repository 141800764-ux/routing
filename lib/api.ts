import { fetchHandler } from "./handlers/fetch";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// =====================
// USERS API
// =====================
export const usersAPI = {
  getAll: () =>
    fetchHandler(`${API_BASE_URL}/users`),

  getById: (id: string) =>
    fetchHandler(`${API_BASE_URL}/users/${id}`),

  create: (data: any) =>
    fetchHandler(`${API_BASE_URL}/users`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    fetchHandler(`${API_BASE_URL}/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchHandler(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
    }),
};

// =====================
// ACCOUNTS API
// =====================
export const accountsAPI = {
  getAll: () =>
    fetchHandler(`${API_BASE_URL}/accounts`),

  getById: (id: string) =>
    fetchHandler(`${API_BASE_URL}/accounts/${id}`),

  getByProvider: (provider: string) =>
    fetchHandler(
      `${API_BASE_URL}/accounts/provider/${provider}`
    ),

  create: (data: any) =>
    fetchHandler(`${API_BASE_URL}/accounts`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    fetchHandler(`${API_BASE_URL}/accounts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchHandler(`${API_BASE_URL}/accounts/${id}`, {
      method: "DELETE",
    }),
};

// =====================
// AUTH API
// =====================
export const authAPI = {
  oAuthSignIn: (
    provider: string,
    providerAccountId: string,
    user: any
  ) =>
    fetchHandler(`${API_BASE_URL}/auth/signin-with-oauth`, {
      method: "POST",
      body: JSON.stringify({
        provider,
        providerAccountId,
        user,
      }),
    }),

  signIn: (data: any) =>
    fetchHandler(`${API_BASE_URL}/auth/signin`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  signUp: (data: any) =>
    fetchHandler(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// =====================
// MAIN API EXPORT
// =====================
export const api = {
  users: usersAPI,
  accounts: accountsAPI,
  auth: authAPI,
};