import * as path from "node:path";
import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import type { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export class ApiStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// DynamoDB テーブルの作成
		const sharedArticlesTable = new dynamodb.Table(
			this,
			"SharedArticlesTable",
			{
				partitionKey: { name: "userId", type: dynamodb.AttributeType.STRING },
				sortKey: { name: "timestamp", type: dynamodb.AttributeType.STRING },
				billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
				removalPolicy: cdk.RemovalPolicy.RETAIN,
			},
		);

		// Lambda関数の作成
		const shareArticleFunction = new NodejsFunction(
			this,
			"ShareArticleFunction",
			{
				runtime: lambda.Runtime.NODEJS_22_X,
				handler: "handler",
				entry: path.resolve(__dirname, "../lambda/share-article/index.ts"),
				architecture: lambda.Architecture.ARM_64,
				environment: {
					TABLE_NAME: sharedArticlesTable.tableName,
				},
				bundling: {
					minify: true,
					sourceMap: true,
					// nodeModules: ["neverthrow"],
					externalModules: [
						"@aws-sdk/client-dynamodb",
						"@aws-sdk/lib-dynamodb",
					],
				},
			},
		);

		// Lambda関数にDynamoDBへの書き込み権限を付与
		sharedArticlesTable.grantWriteData(shareArticleFunction);

		// API Gatewayの作成
		const api = new apigateway.RestApi(this, "WebShareApi", {
			restApiName: "Web Share API",
			description: "API for receiving shared web articles",
			defaultCorsPreflightOptions: {
				allowOrigins: apigateway.Cors.ALL_ORIGINS,
				allowMethods: apigateway.Cors.ALL_METHODS,
			},
		});

		// エンドポイントの作成
		const shareResource = api.root.addResource("share");
		shareResource.addMethod(
			"POST",
			new apigateway.LambdaIntegration(shareArticleFunction),
		);

		// CDK出力の定義
		new cdk.CfnOutput(this, "ApiEndpoint", {
			value: api.url,
			description: "API Gateway endpoint URL",
		});
	}
}
