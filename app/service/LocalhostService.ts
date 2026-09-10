const API_URL_BACKEND =
  process.env.API_URL_BACKEND || "http://localhost:9000/api/v1/";

/**
 * Fetch data from the given endpoint.
 * Handles errors and JSON parsing automatically.
 * @param {string} endpoint - The API endpoint to fetch data from.
 * @param {RequestInit} [options] - Optional fetch options (e.g., headers, method, body).
 * @returns {Promise<any>} - The JSON response data.
 * @throws Will throw an error if the request fails.
 */
export const FETCH_API = async (
  endpoint: string,
  options: RequestInit = {},
): Promise<any> => {
  const url = `${API_URL_BACKEND}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} - ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : `Unknown error occurred`;
    throw new Error(`Failed to fetch data from ${url}: ${errorMessage}`);
  }
};
