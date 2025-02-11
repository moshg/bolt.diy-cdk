import { z } from "zod";

export const envSchema = z.object({
	AWS_ACCOUNT_ID: z.string(),
	AWS_REGION: z.string(),
	COGNITO_USER_POOL_ID: z.string(),
	COGNITO_LOGIN_SUBDOMAIN: z.string(),
	COGNITO_CLIENT_ID: z.string(),
	COGNITO_CLIENT_SECRET: z.string(),
});

export type Env = z.infer<typeof envSchema>;
