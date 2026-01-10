import createClient from "openapi-fetch";
import type { paths } from "./schema";

export const createApiClient = (baseUrl: string) =>
  createClient<paths>({ baseUrl });

export type { paths, components } from "./schema";
