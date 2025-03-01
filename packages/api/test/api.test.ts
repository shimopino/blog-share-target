import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as Api from "../lib/api-stack";

// example test. To run these tests, uncomment this file along with the
// example resource in lib/api-stack.ts
test.skip("API Gateway and Lambda Function are created", () => {
	const app = new cdk.App();
	const stack = new Api.ApiStack(app, "TestStack");
	const template = Template.fromStack(stack);

	// API Gatewayリソースの検証
	template.resourceCountIs("AWS::ApiGateway::RestApi", 1);
	template.resourceCountIs("AWS::ApiGateway::Method", 1);

	// Lambda関数リソースの検証
	template.resourceCountIs("AWS::Lambda::Function", 1);

	// DynamoDBテーブルの検証
	template.resourceCountIs("AWS::DynamoDB::Table", 1);
	template.hasResourceProperties("AWS::DynamoDB::Table", {
		KeySchema: [
			{
				AttributeName: "userId",
				KeyType: "HASH",
			},
			{
				AttributeName: "timestamp",
				KeyType: "RANGE",
			},
		],
	});
});
