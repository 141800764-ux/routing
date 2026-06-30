// lib/handlers/fetch.ts

import handleError from "./error";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

export async function fetchHandler<T>(
  url: string,
  options: FetchOptions = {}
): Promise<ActionResponse<T>> {
  const { params, headers, ...restOptions } = options;

  try {
    let queryString = "";

    if (params) {
      queryString = new URLSearchParams(
        Object.entries(params).reduce(
          (acc, [key, value]) => {
            acc[key] = String(value);
            return acc;
          },
          {} as Record<string, string>
        )
      ).toString();
    }

    const fullUrl = queryString
      ? `${url}?${queryString}`
      : url;

    const response = await fetch(fullUrl, {
      ...restOptions,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result?.error?.message ||
          result?.message ||
          "Something went wrong"
      );
    }

    return result;
  } catch (error) {
    return handleError(error) as ActionResponse<T>;
  }
}