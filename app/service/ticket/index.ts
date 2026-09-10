import { FETCH_API } from "../LocalhostService";

const EndPoints = {
  football: "football/ticket",
};

export const GET_TICKET = async (params?: {
  limit?: number;
  offset?: number;
}): Promise<any> => {
  const query = params
    ? `?${new URLSearchParams(
        Object.entries(params)
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => [key, String(value)]),
      ).toString()}`
    : "";

  return FETCH_API(`${EndPoints.football}${query}`);
};

export const GET_DETAIL_NEWS = async (id: string): Promise<any> => {
  return FETCH_API(`${EndPoints.football}/${id}`);
};
