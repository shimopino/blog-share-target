import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { type Result, err, ok } from "neverthrow";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

type ApiError =
	| { type: "invalidInput"; message: string }
	| { type: "databaseError"; message: string };

type ShareEvent = {
	url: string;
	title?: string;
	text?: string;
};

interface APIGatewayEvent {
	body: string | null;
	headers: Record<string, string>;
	// 他のAPIGatewayイベントのプロパティも必要に応じて追加
}

// 入力検証関数
const validateInput = (
	event: APIGatewayProxyEvent,
): Result<ShareEvent, ApiError> => {
	if (!event.body) {
		return err({ type: "invalidInput", message: "Request body is missing" });
	}

	let body: Record<string, unknown>;
	try {
		body = JSON.parse(event.body);
	} catch (error) {
		return err({
			type: "invalidInput",
			message: "Invalid JSON in request body",
		});
	}

	if (!body.url || typeof body.url !== "string") {
		return err({ type: "invalidInput", message: "URL is required" });
	}

	return ok({
		url: body.url,
		title: typeof body.title === "string" ? body.title : undefined,
		text: typeof body.text === "string" ? body.text : undefined,
	});
};

// DynamoDBに保存する関数
const saveToDatabase = async (
	item: ShareEvent,
): Promise<Result<void, ApiError>> => {
	const timestamp = new Date().toISOString();

	try {
		await docClient.send(
			new PutCommand({
				TableName: process.env.TABLE_NAME,
				Item: {
					userId: "anonymous", // 認証実装後に実際のユーザーIDに置き換え
					timestamp,
					url: item.url,
					title: item.title || "",
					text: item.text || "",
					createdAt: timestamp,
					status: "pending", // 将来的な要約処理のためのステータス
				},
			}),
		);
		return ok(undefined);
	} catch (error) {
		console.error("Database error:", error);
		return err({
			type: "databaseError",
			message:
				error instanceof Error ? error.message : "Unknown database error",
		});
	}
};

export const handler = async (
	event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
	console.log("Received event:", JSON.stringify(event, null, 2));

	// CORS ヘッダー
	const headers = {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Credentials": true,
	};

	// 入力検証
	const validationResult = validateInput(event);
	if (validationResult.isErr()) {
		return {
			statusCode: 400,
			headers,
			body: JSON.stringify({ error: validationResult.error }),
		};
	}

	// DynamoDBに保存
	const shareData = validationResult.value;
	const saveResult = await saveToDatabase(shareData);

	if (saveResult.isErr()) {
		return {
			statusCode: 500,
			headers,
			body: JSON.stringify({ error: saveResult.error }),
		};
	}

	return {
		statusCode: 200,
		headers,
		body: JSON.stringify({
			message: "Article shared successfully",
			url: shareData.url,
		}),
	};
};
