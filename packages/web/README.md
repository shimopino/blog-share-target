# ブログ記事要約アプリ - フロントエンド

## 概要

このプロジェクトは、Web Share Target APIを利用して、ブラウザからコンテンツを共有できるウェブアプリケーションです。

## 機能

- Web Share Target APIによるコンテンツ共有
- PWA（Progressive Web App）対応
- 共有された記事のURL、タイトル、テキストの表示

## 開発環境

- React 19.0.0
- React Router 7.1.1
- TypeScript 5.7.2
- Tailwind CSS 4.0.0
- Vite 5.4.11

## 使用方法

### 開発

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

### ビルド

```bash
# 通常ビルド
npm run build

# 静的ビルド（S3/CloudFront用）
npm run build:static
```

## AWS S3 + CloudFrontへのデプロイ方法

### 1. S3バケットの作成

1. AWSコンソールでS3サービスに移動
2. 「バケットを作成」をクリック
3. バケット名を入力（例: blog-share-target-app）
4. リージョンを選択
5. 「ブロックパブリックアクセス」設定を適切に設定（CloudFrontアクセス用に全てブロックでOK）
6. 他の設定はデフォルトのまま「バケットを作成」をクリック

### 2. S3バケットの設定

1. 作成したバケットの「プロパティ」タブを開く
2. 「静的ウェブサイトホスティング」セクションで「編集」をクリック
3. 「静的ウェブサイトホスティング」を有効にする
4. インデックスドキュメントに「index.html」と入力
5. エラードキュメントに「index.html」と入力（SPAのルーティング用）
6. 変更を保存

### 3. CloudFrontディストリビューションの作成

1. AWSコンソールでCloudFrontサービスに移動
2. 「ディストリビューションを作成」をクリック
3. オリジンドメインで先ほど作成したS3バケットを選択
4. 「オリジンアクセス」で「レガシーアクセスアイデンティティ」または「オリジンアクセスコントロール」を選択し設定
5. 「ビューワープロトコルポリシー」で「リダイレクトHTTPをHTTPSに」を選択
6. 「デフォルトルートオブジェクト」に「index.html」と入力
7. 「カスタムエラーレスポンス」セクションで：
   - HTTPエラーコード: 403
   - レスポンスページパス: /index.html
   - HTTPレスポンスコード: 200
   - キャッシュエラーTTL: 0
8. 同様に404エラーについても設定
9. 他の設定はデフォルトのまま「ディストリビューションを作成」をクリック

### 4. S3バケットポリシーの設定

CloudFrontがS3バケットにアクセスできるように、バケットポリシーを設定します。

1. S3バケットの「アクセス許可」タブを開く
2. 「バケットポリシー」セクションで「編集」をクリック
3. 以下のようなポリシーを入力（CloudFrontのディストリビューションIDを適宜置き換え）:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipal",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::YOUR-ACCOUNT-ID:distribution/YOUR-DISTRIBUTION-ID"
        }
      }
    }
  ]
}
```

### 5. デプロイスクリプトの設定

package.jsonのデプロイスクリプトを編集して、適切なS3バケット名とCloudFrontディストリビューションIDを設定します：

```json
"scripts": {
  "deploy:s3": "aws s3 sync build/ s3://YOUR-BUCKET-NAME/ --delete",
  "invalidate:cloudfront": "aws cloudfront create-invalidation --distribution-id YOUR-CLOUDFRONT-DISTRIBUTION-ID --paths \"/*\""
}
```

### 6. アプリケーションのデプロイ

```bash
# 静的ビルドの生成
npm run build:static

# S3へのデプロイ
npm run deploy:s3

# CloudFrontキャッシュの無効化
npm run invalidate:cloudfront
```

### 注意点

- Web Share Target APIはHTTPS環境でのみ動作します（CloudFront経由のアクセスで問題ありません）
- PWAとして機能させるには、マニフェストファイルとService Workerが正しく設定されている必要があります
- SPAルーティングのために、404/403エラーを全てindex.htmlにリダイレクトする設定が必要です

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
