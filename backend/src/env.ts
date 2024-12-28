import { z } from 'zod'

export const envSchema = z.object({
  BACKEND_PORT: z.coerce.number(),
  JWT_SECRET: z.string().min(6),
  DATABASE_URL: z.string().url(),
  POSTGRES_USERNAME: z.string(),
  POSTGRES_PASSWORD: z.string().min(6),
  POSTGRES_DATABASE: z.string(),
})

export type Env = z.infer<typeof envSchema>
