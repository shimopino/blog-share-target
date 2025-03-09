#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { ApiStack } from "../lib/api-stack";
import { GitHubOidcRoleStack } from "../lib/github-oicd-stack";
import { AuthStack } from "../lib/auth-stack";
import * as dotenv from "dotenv";

dotenv.config();

const app = new cdk.App();

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!googleClientId || !googleClientSecret) {
	throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set");
}

const authStack = new AuthStack(app, "WebShareTargetAuthStack", {
	stage: "dev",
	frontendUrls: [
		"http://localhost:5173",
		"https://d10hk2x3dbh227.cloudfront.net",
	],
	googleClientId,
	googleClientSecret,
	env: {
		account: process.env.CDK_DEFAULT_ACCOUNT,
		region: process.env.CDK_DEFAULT_REGION,
	},
	tags: {
		Project: "WebShareTarget",
		Environment: "Development",
		Service: "Auth",
	},
});

new ApiStack(app, "WebShareTargetApiStack", {
	/* If you don't specify 'env', this stack will be environment-agnostic.
	 * Account/Region-dependent features and context lookups will not work,
	 * but a single synthesized template can be deployed anywhere. */

	/* Uncomment the next line to specialize this stack for the AWS Account
	 * and Region that are implied by the current CLI configuration. */
	env: {
		account: process.env.CDK_DEFAULT_ACCOUNT,
		region: process.env.CDK_DEFAULT_REGION,
	},

	/* Uncomment the next line if you know exactly what Account and Region you
	 * want to deploy the stack to. */
	// env: { account: '123456789012', region: 'us-east-1' },

	/* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */

	// タグを追加
	tags: {
		Project: "WebShareTarget",
		Environment: "Development",
		Service: "API",
	},

	userPoolId: authStack.userPool.userPoolId,
	userPoolClientId: authStack.userPoolClient.userPoolClientId,
});

new GitHubOidcRoleStack(app, "GitHubOidcRoleStack", {
	repoName: "shimopino/blog-share-target",
	env: {
		account: process.env.CDK_DEFAULT_ACCOUNT,
		region: process.env.CDK_DEFAULT_REGION,
	},
	tags: {
		Project: "WebShareTarget",
		Environment: "Development",
		Service: "GitHubActions",
	},
});
