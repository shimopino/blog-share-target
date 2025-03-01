# Web Share Target API

このプロジェクトは、Web Share Target APIを使用してブラウザの共有機能からURLを受け取り、DynamoDBに保存するバックエンドAPIを提供します。

## アーキテクチャ

- AWS API Gateway: Web Share Targetからのリクエストを受け付けるエンドポイント
- AWS Lambda: 共有データを処理し、DynamoDBに保存する関数
- Amazon DynamoDB: 共有されたURLとメタデータを保存するデータベース

## 開発環境のセットアップ

### 前提条件

- Node.js 18.x以上
- AWS CLI（設定済み）
- AWS CDK CLI

### インストール

```bash
npm install
```

### デプロイ

```bash
npm run build
npx cdk deploy
```

デプロイが完了すると、API GatewayのエンドポイントURLが出力されます。

## APIエンドポイント

### POST /share

ブラウザの共有機能から送信されたデータを受け取り、DynamoDBに保存します。

#### リクエスト

```json
{
  "url": "https://example.com/article",
  "title": "記事のタイトル",
  "text": "記事の説明"
}
```

#### レスポンス

成功時:

```json
{
  "message": "Article shared successfully",
  "url": "https://example.com/article"
}
```

エラー時:

```json
{
  "error": {
    "type": "invalidInput",
    "message": "URL is required"
  }
}
```

## Web Share Target

Web Share Targetを設定するには、PWAのマニフェストファイルに以下の設定を追加します。

```json
"share_target": {
  "action": "/api/share",
  "method": "POST",
  "enctype": "multipart/form-data",
  "params": {
    "title": "title",
    "text": "text",
    "url": "url"
  }
}
```

## 今後の拡張

1. Google認証によるユーザー管理
2. 共有記事のメタデータ（OGP画像など）の取得
3. LLMを使用した記事要約の生成
4. CloudFrontとの連携による静的サイトホスティング
