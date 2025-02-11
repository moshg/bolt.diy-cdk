#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { BoltDiyStack } from "../lib/bolt-diy-stack";
import { envSchema } from "../lib/env";

const env = envSchema.parse(process.env);

const app = new cdk.App();
new BoltDiyStack(
	app,
	"BoltDiyStack",
	{
		awsRegion: env.AWS_REGION,
		cognitoUserPoolId: env.COGNITO_USER_POOL_ID,
		cognitoLoginSubdomain: env.COGNITO_LOGIN_SUBDOMAIN,
		cognitoClientId: env.COGNITO_CLIENT_ID,
		cognitoClientSecret: env.COGNITO_CLIENT_SECRET,
		serviceName: "bolt-diy-cdk",
	},
	{
		env: { account: env.AWS_ACCOUNT_ID, region: env.AWS_REGION },
	},
);
