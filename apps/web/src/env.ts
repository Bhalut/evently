import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url(),
  CI: z.coerce.boolean().optional(),
});

const _env = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  CI: process.env.CI,
});

if (!_env.success) {
  const errors = z.flattenError(_env.error).fieldErrors;

  // Log specific missing variables for better debugging
  console.error("Invalid environment variables:");
  Object.entries(errors).forEach(([key, value]) => {
    const actualValue = process.env[key];
    console.error(`- ${key}: ${value?.join(", ")}`);
    console.error(
      `  Actual value in process.env: ${actualValue === undefined ? "undefined (missing)" : JSON.stringify(actualValue)}`
    );
  });

  if (!process.env.NEXT_PUBLIC_API_URL) {
    console.error(
      "Hint: NEXT_PUBLIC_API_URL is missing. Create a .env file in apps/web or check your environment configuration. If you recently created the .env file, try restarting the development server."
    );
  }

  throw new Error(`Invalid environment variables: ${JSON.stringify(errors)}`);
}

export const env = _env.data;
