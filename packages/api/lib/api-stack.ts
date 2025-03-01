import * as path from "node:path";
import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import type { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { NodejsBuild } from "deploy-time-build";

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
			// deployOptions
			// デフォルトで prod というステージが作成される
			// レート制限もデフォルトの設定値が適用される
		});

		// エンドポイントの作成
		const shareResource = api.root.addResource("share");
		shareResource.addMethod(
			"POST",
			new apigateway.LambdaIntegration(shareArticleFunction, {
				proxy: true,
			}),
		);

		// S3バケットの作成
		const websiteBucket = new s3.Bucket(this, "WebsiteBucket", {
			removalPolicy: cdk.RemovalPolicy.DESTROY, // 開発環境用
			autoDeleteObjects: true, // 開発環境用
			blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
		});

		// CloudFront ディストリビューションの作成
		const distribution = new cloudfront.Distribution(this, "Distribution", {
			defaultBehavior: {
				origin: new origins.S3StaticWebsiteOrigin(websiteBucket),
				viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
				allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
				cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
			},
			additionalBehaviors: {
				"/api/*": {
					origin: new origins.RestApiOrigin(api),
					viewerProtocolPolicy:
						cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
					allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
					cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
					cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED, // APIレスポンスはキャッシュしない
					originRequestPolicy:
						cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
				},
			},
			defaultRootObject: "index.html",
			errorResponses: [
				{
					httpStatus: 404,
					responseHttpStatus: 200,
					responsePagePath: "/index.html", // SPAルーティング用
				},
			],
		});

		// deploy-time-buildを使ったウェブアプリのビルド
		new NodejsBuild(this, "WebBuilder", {
			assets: [
				{
					path: path.join(__dirname, "../../../packages/web"),
				},
			],
			buildCommands: ["npm install && npm run build"],
			workingDirectory: ".",
			outputSourceDirectory: "build/client",
			destinationBucket: websiteBucket,
			distribution: distribution,
		});

		// CDK出力の定義
		new cdk.CfnOutput(this, "ApiEndpoint", {
			value: api.url,
			description: "API Gateway endpoint URL",
		});

		// CloudFront URL出力の定義
		new cdk.CfnOutput(this, "WebsiteUrl", {
			value: `https://${distribution.distributionDomainName}`,
			description: "Website URL",
		});
	}
}
