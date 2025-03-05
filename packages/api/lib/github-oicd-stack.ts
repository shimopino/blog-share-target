import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import type { Construct } from "constructs";

interface GitHubOidcRoleStackProps extends cdk.StackProps {
	repoName: string;
}

export class GitHubOidcRoleStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props: GitHubOidcRoleStackProps) {
		super(scope, id, props);

		// 既存のGitHub ActionsのOIDCプロバイダーを参照
		const providerArn = `arn:aws:iam::${this.account}:oidc-provider/token.actions.githubusercontent.com`;

		// プルリクエストエージェントのIAMロール
		const prAgentRole = new iam.Role(this, "PrAgentRole", {
			assumedBy: new iam.FederatedPrincipal(
				providerArn,
				{
					StringEquals: {
						"token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
					},
					StringLike: {
						"token.actions.githubusercontent.com:sub": `repo:${props.repoName}:*`,
					},
				},
				"sts:AssumeRoleWithWebIdentity",
			),
			description: "IAM Role for Pull Request Agent",
			roleName: "GitHubActionsPrAgentRole",
			maxSessionDuration: cdk.Duration.hours(1),
		});

		// 必要な権限を付与する
		prAgentRole.addToPolicy(
			new iam.PolicyStatement({
				effect: iam.Effect.ALLOW,
				actions: [
					"logs:CreateLogGroup",
					"logs:CreateLogStream",
					"logs:PutLogEvents",
				],
				resources: ["*"],
			}),
		);

		// IAMロールの詳細情報として必要な情報を出力
		new cdk.CfnOutput(this, "PrAgentRoleArn", {
			value: prAgentRole.roleArn,
			description: "ARN of the IAM Role for GitHub Actions PR-Agent",
			exportName: "GitHubActionsPrAgentRoleArn",
		});
	}
}
