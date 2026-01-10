import { createApiClient, components } from "@repo/client";
import { logger } from "./logger";
import { env } from "../env";

const API_URL = env.NEXT_PUBLIC_API_URL;

export const client = createApiClient(API_URL);

/**
 * Authentication middleware that attaches JWT token to outgoing requests.
 *
 * - Reads token from `localStorage` (client-side only)
 * - Sets `Authorization: Bearer <token>` header when token exists
 * - SSR-safe: skips token injection when `window` is undefined
 */
client.use({
  onRequest: ({ request }) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }
    return request;
  },
});

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

/**
 * Standard response envelope applied by NestJS {@link TransformInterceptor}.
 * All API responses are wrapped in this structure at runtime.
 *
 * @template T - The actual response payload type
 */
interface WrappedResponse<T> {
  /** The response payload */
  data: T;
  /** Optional metadata (pagination, timestamps, etc.) */
  meta?: Record<string, unknown>;
}

export type Event = components["schemas"]["Event"];

/**
 * Type-safe API client wrapper with automatic response unwrapping.
 *
 * - Unwraps {@link WrappedResponse} envelope from all responses
 * - Throws on API errors for consistent error handling
 * - Logs errors via structured logger
 *
 * @example
 * ```ts
 * const events = await api.get<Event[]>('/events');
 * const created = await api.post<Event>('/events', { title: 'New Event' });
 * ```
 */
export const api = {
  get: async <T>(path: string, options?: Record<string, unknown>) => {
    try {
      const { data, error } = await client.GET(path as never, options as never);
      if (error) throw error;
      return (data as unknown as WrappedResponse<T> | undefined)?.data;
    } catch (e: unknown) {
      logger.error({ path, error: e }, "API GET Error");
      throw e;
    }
  },
  post: async <T>(path: string, body: unknown) => {
    try {
      const { data, error } = await client.POST(
        path as never,
        { body } as never
      );
      if (error) throw error;
      return (data as WrappedResponse<T> | undefined)?.data;
    } catch (e: unknown) {
      logger.error({ path, error: e }, "API POST Error");
      throw e;
    }
  },
  put: async <T>(path: string, body: unknown) => {
    try {
      const { data, error } = await client.PUT(
        path as never,
        { body } as never
      );
      if (error) throw error;
      return (data as WrappedResponse<T> | undefined)?.data;
    } catch (e: unknown) {
      logger.error({ path, error: e }, "API PUT Error");
      throw e;
    }
  },
  delete: async <T>(path: string) => {
    try {
      const { data, error } = await client.DELETE(path as never, {} as never);
      if (error) throw error;
      return (data as unknown as WrappedResponse<T> | undefined)?.data;
    } catch (e: unknown) {
      logger.error({ path, error: e }, "API DELETE Error");
      throw e;
    }
  },
};
