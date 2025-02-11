import * as cdk from "aws-cdk-lib";
import * as lightsail from "aws-cdk-lib/aws-lightsail";
import type { Construct } from "constructs";

export interface BoltDiyStackProps {
	serviceName: string;
	awsRegion: string;
	cognitoUserPoolId: string;
	cognitoLoginSubdomain: string;
	cognitoClientId: string;
	cognitoClientSecret: string;
}

export class BoltDiyStack extends cdk.Stack {
	constructor(
		scope: Construct,
		id: string,
		props: BoltDiyStackProps,
		stackProps?: cdk.StackProps,
	) {
		super(scope, id, stackProps);

		const { serviceName, ...env } = props;

		new lightsail.CfnContainer(this, `${serviceName}-container`, {
			power: "nano",
			scale: 1,
			serviceName,
			containerServiceDeployment: {
				containers: [
					{
						containerName: "bolt-diy",
						image: "ghcr.io/stackblitz-labs/bolt.diy:6a8449e",
						ports: [
							{
								port: "5173",
								protocol: "HTTP",
							},
						],
						environment: [
							{
								variable: "NODE_ENV",
								value: "production",
							},
							{
								// No strictly needed but serving as hints for Coolify
								variable: "PORT",
								value: "5173",
							},
							{
								variable: "RUNNING_IN_DOCKER",
								value: "true",
							},
						],
					},
					{
						containerName: "auth-proxy",
						image: "quay.io/oauth2-proxy/oauth2-proxy:v7.8.1",
						ports: [
							{
								port: "4180",
								protocol: "HTTP",
							},
						],
						environment: [
							{
								variable: "OAUTH2_PROXY_HTTP_ADDRESS",
								value: "0.0.0.0:4180",
							},
							{
								variable: "OAUTH2_PROXY_UPSTREAMS",
								value: "http://bolt-diy.service.local:5173",
							},
							{
								variable: "OAUTH2_PROXY_PROVIDER",
								value: "oidc",
							},
							{
								variable: "OAUTH2_PROXY_SCOPE",
								value: "openid",
							},
							{
								variable: "OAUTH2_PROXY_EMAIL_DOMAINS",
								value: "*",
							},
							{
								variable: "OAUTH2_PROXY_PROVIDER_DISPLAY_NAME",
								value: "AWS Cognito",
							},
							{
								variable: "OAUTH2_PROXY_CLIENT_ID",
								value: env.cognitoClientId,
							},
							{
								variable: "OAUTH2_PROXY_CLIENT_SECRET",
								value: env.cognitoClientSecret,
							},
							{
								variable: "OAUTH2_PROXY_COOKIE_SECURE",
								value: "false",
							},
							{
								variable: "OAUTH2_PROXY_COOKIE_SECRET",
								value: "3RLUho8lKWNSeuvl-RfUtUZRPRuPRA1tZZiLM76IWbs",
							},
							{
								variable: "OAUTH2_PROXY_SESSION_COOKIE_MINIMAL",
								value: "true",
							},
							{
								variable: "OAUTH2_PROXY_REDIRECT_URL",
								value: "http://localhost:4180/oauth2/callback",
							},
							{
								variable: "OAUTH2_PROXY_OIDC_ISSUER_URL",
								value: `https://cognito-idp.${env.awsRegion}.amazonaws.com/${env.cognitoUserPoolId}`,
							},
							{
								variable: "OAUTH2_PROXY_LOGIN_URL",
								value: `https://${env.cognitoLoginSubdomain}.auth.${env.awsRegion}.amazoncognito.com/oauth2/authorize`,
							},
							{
								variable: "OAUTH2_PROXY_PROFILE_URL",
								value: `https://${env.cognitoLoginSubdomain}.auth.${env.awsRegion}.amazoncognito.com/oauth2/userInfo`,
							},
							{
								variable: "OAUTH2_PROXY_REDEEM_URL",
								value: `https://${env.cognitoLoginSubdomain}.auth.${env.awsRegion}.amazoncognito.com/oauth2/token`,
							},
						],
					},
				],
				publicEndpoint: {
					containerName: "bolt-diy",
					containerPort: 5173,
					healthCheckConfig: {
						path: "/",
						successCodes: "200-499",
						timeoutSeconds: 2,
						intervalSeconds: 5,
						healthyThreshold: 2,
						unhealthyThreshold: 2,
					},
				},
			},
		});
	}
}
