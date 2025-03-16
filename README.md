# Web記事要約アプリ 実装計画

Web記事要約アプリを機能フェーズごとに分解した実装計画です。各機能に焦点を当て、それぞれに必要な画面とインフラを一貫性を持って構築していく流れになっています。

## フェーズ1: 基本的な記事共有と保存
### 機能概要
- ブラウザで共有した記事を保存し、一覧表示する機能

### 必要な画面/UI
- ログイン画面
- 記事一覧画面
- 共有受信画面

### バックエンド要素
- Google認証
- URL受信API
- メタデータ抽出処理
- 記事情報のDB保存

### フロントエンド要素
- PWA基本設定
- 共有APIハンドリング
- 記事カードコンポーネント
- 認証状態管理

## フェーズ2: AI要約生成
### 機能概要
- 保存した記事の内容を取得し、Bedrockで要約を生成

### 必要な画面/UI
- 要約表示画面
- 要約設定画面

### バックエンド要素
- 記事本文抽出処理
- Bedrock API連携
- 要約結果の保存

### フロントエンド要素
- 要約表示コンポーネント
- ローディング状態UI
- エラー処理UI

## フェーズ3: Obsidian連携基本機能
### 機能概要
- 要約済み記事をObsidianに送信する機能

### 必要な画面/UI
- Obsidian送信UI
- 連携成功表示

### バックエンド要素
- マークダウン変換
- Obsidian URI生成

### フロントエンド要素
- 送信ボタン
- URI起動処理
- 連携状態表示

## フェーズ4: 記事管理機能
### 機能概要
- 記事の整理、検索、フィルタリング機能

### 必要な画面/UI
- 検索UI
- フィルター/ソートUI
- タグ管理画面

### バックエンド要素
- 検索API
- フィルターロジック
- タグ管理

### フロントエンド要素
- 検索コンポーネント
- フィルターUI
- タグ表示

## フェーズ5: カスタムプロンプト設定
### 機能概要
- 要約のためのプロンプトカスタマイズ機能

### 必要な画面/UI
- プロンプト編集画面
- プリセット管理UI

### バックエンド要素
- カスタムプロンプト保存
- プリセット管理API

### フロントエンド要素
- プロンプトエディタ
- プリセット選択UI

## フェーズ6: LLMモデル選択機能
### 機能概要
- 複数のBedrockモデルから選択可能な機能

### 必要な画面/UI
- モデル選択UI
- パラメータ設定画面

### バックエンド要素
- 複数モデル対応
- パラメータ管理
- モデル別設定

### フロントエンド要素
- モデル選択コンポーネント
- パラメータ調整UI

## フェーズ7: オフライン対応強化
### 機能概要
- オフライン時の機能確保

### 必要な画面/UI
- オフライン表示UI
- 同期状態表示

### バックエンド要素
- オフラインキャッシュ
- 同期ロジック

### フロントエンド要素
- オフライン検出
- キャッシュ表示
- 同期UI

## フェーズ8: 外部サービス連携
### 機能概要
- X、Slack、Notionなどとの連携機能

### 必要な画面/UI
- 連携設定画面
- 連携サービス選択UI

### バックエンド要素
- 外部APIとの連携
- Webhook処理
- OAuth認証

### フロントエンド要素
- サービス連携設定UI
- 共有状態表示

## フェーズ9: 高度なObsidian連携
### 機能概要
- Obsidianプラグインによる双方向連携

### 必要な画面/UI
- プラグイン設定UI
- 同期設定画面

### バックエンド要素
- プラグインAPI
- 双方向同期ロジック

### フロントエンド要素
- 同期状態表示
- 連携設定UI

## フェーズ10: パーソナライズ推薦
### 機能概要
- ユーザーの興味に基づく記事推薦

### 必要な画面/UI
- 推薦記事UI
- 興味設定画面

### バックエンド要素
- 推薦アルゴリズム
- ユーザープロファイル
- 類似性分析

### フロントエンド要素
- 推薦カード表示
- 興味設定UI

## AI Agentへの総合的な指示例

「Web記事要約アプリを開発しています。上記のフェーズに従って、フェーズ1から順に実装を進めてください。各フェーズは前のフェーズの成果物を基に構築し、一貫性のある機能拡張を行います。実装はReact, TypeScript, AWS (Bedrock, Lambda, DynamoDB)をベースとし、PWAとして動作するよう設計してください。各フェーズで動作するMVPを作成し、次のフェーズに進む前にユーザーフィードバックを得られるようにします。」

## Obsidianとの連携方法に関する詳細

### 1. Obsidianプラグインを開発する

Obsidianは独自のプラグインAPIを提供しており、これを利用して専用プラグインを開発できます。

#### 具体的な実装方法:
- **Obsidian Plugin API**: TypeScriptを使って開発し、公式のプラグインマーケットプレイスに公開できます
- **同期の方法**: 
  - プラグインがバックグラウンドでWebアプリのAPIをポーリング
  - Webhookを使ってプラグインがリクエストを受信
  - ローカルデータベース(IndexedDBなど)を共有

#### 技術的な具体例:
```typescript
// Obsidianプラグイン内での要約データ取得と保存の例
export default class WebArticleSummaryPlugin extends Plugin {
  async onload() {
    // APIエンドポイントの定義
    this.registerInterval(
      window.setInterval(() => this.fetchNewSummaries(), 60000)
    );

    // コマンドパレットに要約取得コマンドを追加
    this.addCommand({
      id: 'fetch-summaries',
      name: 'Fetch New Article Summaries',
      callback: () => this.fetchNewSummaries(),
    });
  }

  async fetchNewSummaries() {
    try {
      // APIからデータ取得
      const response = await fetch('https://your-api.com/summaries/new', {
        headers: {
          'Authorization': `Bearer ${this.settings.apiKey}`
        }
      });
      
      const articles = await response.json();
      
      // 新しい要約ごとにノートを作成
      for (const article of articles) {
        await this.createNoteFromSummary(article);
      }
    } catch (error) {
      console.error('Failed to fetch summaries:', error);
    }
  }

  async createNoteFromSummary(article) {
    const folderPath = this.settings.summaryFolder;
    const fileName = `${folderPath}/${this.sanitizeFileName(article.title)}.md`;
    
    // フロントマターとコンテンツの準備
    const content = `---
title: ${article.title}
source: ${article.url}
summary: true
date: ${new Date().toISOString().split('T')[0]}
tags: ${article.tags.join(', ')}
---

# ${article.title}

## 要約
${article.summary}

## ハイライト
${article.highlights.map(h => `> ${h.text}`).join('\n\n')}

## 原文リンク
[${article.title}](${article.url})
`;

    // Obsidianに保存
    await this.app.vault.create(fileName, content);
  }
}
```

#### 利点:
- Obsidianの内部APIに直接アクセスできる
- シームレスなユーザー体験を提供できる
- Obsidianの機能（グラフビュー、バックリンク等）をフル活用できる

#### 欠点:
- プラグイン開発・メンテナンスが必要
- Obsidianのバージョンアップに対応する必要がある

### 2. Obsidianのローカルフォルダへの直接書き込み

Obsidianは基本的にローカルのMarkdownファイルを扱うため、単にファイルシステム上に直接ファイルを書き込む方法もあります。

#### 具体的な実装方法:
- **デスクトップアプリの作成**: Electron等を使用してローカルファイルシステムにアクセス
- **ローカルAPI**: ローカルで動作するAPIサーバーを構築（例: Express.jsなど）
- **ファイル保存場所の設定**: ユーザーがObsidianのvaultパスを指定

#### 技術的な具体例:
```javascript
// Electronアプリでの実装例
const fs = require('fs');
const path = require('path');

// ユーザー設定からObsidianのvaultパスを取得
const obsidianVaultPath = app.getPath('userData'); // または設定から取得

function saveArticleSummaryToObsidian(article) {
  const folderPath = path.join(obsidianVaultPath, 'Web記事要約');
  
  // フォルダが存在しない場合は作成
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  
  const fileName = `${article.title.replace(/[/\\?%*:|"<>]/g, '-')}.md`;
  const filePath = path.join(folderPath, fileName);
  
  // Markdownコンテンツの作成
  const content = `---
title: ${article.title}
url: ${article.url}
date: ${new Date().toISOString().split('T')[0]}
tags: ${article.tags.join(', ')}
---

# ${article.title}

## 要約
${article.summary}

## キーポイント
${article.keyPoints.map(point => `- ${point}`).join('\n')}

## 原文
[記事を読む](${article.url})
`;

  // ファイルに書き込み
  fs.writeFileSync(filePath, content, 'utf8');
  return filePath;
}
```

#### 利点:
- シンプルな実装
- Obsidian側での特別な設定が不要

#### 欠点:
- ローカルアプリケーションが必要（ウェブのみでは不可）
- セキュリティの考慮が必要
- クロスプラットフォーム対応の課題

### 3. ObsidianのURI機能を活用

Obsidianは`obsidian://`プロトコルを使ったURIスキームを提供しており、外部アプリからObsidianを操作できます。

#### 具体的な実装方法:
- **URI呼び出し**: `obsidian://new?vault=VaultName&file=FileName&content=Content`のような形式でリンクを生成
- **ブラウザ連携**: ウェブアプリからObsidianのURI呼び出しを行う

#### 技術的な具体例:
```javascript
// WebアプリでのObsidian URI呼び出し例
function createObsidianURI(article) {
  // Obsidianのvault名（URLエンコードする）
  const vaultName = encodeURIComponent("MyVault");
  
  // ファイル名（URLエンコードする）
  const fileName = encodeURIComponent(`Web記事要約/${article.title.replace(/[/\\?%*:|"<>]/g, '-')}.md`);
  
  // ファイル内容（URLエンコードする）
  const content = encodeURIComponent(`---
title: ${article.title}
url: ${article.url}
date: ${new Date().toISOString().split('T')[0]}
tags: ${article.tags.join(', ')}
---

# ${article.title}

## 要約
${article.summary}

## ハイライト
${article.highlights.map(h => `> ${h.text}`).join('\n\n')}

## 原文リンク
[${article.title}](${article.url})
`);

  // Obsidian URIを生成
  const obsidianURI = `obsidian://new?vault=${vaultName}&file=${fileName}&content=${content}`;
  
  // URIを開く
  window.open(obsidianURI, '_blank');
}
```

#### 利点:
- ウェブアプリからでも連携可能
- インストールが簡単

#### 欠点:
- ユーザーの手動操作が必要
- 大量のデータを一度に送るのには向いていない
- URIの長さ制限に注意が必要

### 4. Obsidian Sync APIを活用する（非公式）

Obsidianの公式同期サービスであるObsidian Syncには公開APIがありませんが、サードパーティ製のライブラリやツールを使って非公式に連携することも可能です。

#### 具体的な実装方法:
- **既存のObsidian同期プラグイン**: Remotely SaveなどのプラグインのデータストアとWebアプリのデータストアを共有
- **共有クラウドストレージ**: Dropbox、iCloudなど、ObsidianとWebアプリの両方がアクセスできる共有ストレージを使用

#### 技術的な具体例:
```javascript
// 共有クラウドストレージ（例：S3）を使った同期の例
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

async function saveArticleSummaryToSharedStorage(article) {
  const bucketName = 'your-shared-bucket';
  const fileName = `web-summaries/${article.title.replace(/[/\\?%*:|"<>]/g, '-')}.md`;
  
  // Markdownコンテンツの作成
  const content = `---
title: ${article.title}
url: ${article.url}
date: ${new Date().toISOString().split('T')[0]}
tags: ${article.tags.join(', ')}
---

# ${article.title}

## 要約
${article.summary}

## キーポイント
${article.keyPoints.map(point => `- ${point}`).join('\n')}
`;

  // S3にアップロード
  await s3.putObject({
    Bucket: bucketName,
    Key: fileName,
    Body: content,
    ContentType: 'text/markdown'
  }).promise();
  
  return {
    bucketName,
    fileName
  };
}
```

#### 利点:
- 複数デバイス間での同期が容易
- ウェブアプリとしての実装が可能

#### 欠点:
- サードパーティストレージへの依存
- セットアップが複雑になる可能性
- 追加のインフラコストが発生

### 5. ハイブリッドアプローチ

上記の方法を組み合わせることも可能です。例えば、基本機能としてURI機能による連携を提供しつつ、高度な機能のためにObsidianプラグインも開発するアプローチです。

#### 具体的な実装例:
- **基本連携**: URI機能による一方向の連携
- **高度連携**: プラグインによる双方向の同期
- **選択可能**: ユーザーがニーズに合わせて連携方法を選べる

#### 実装の優先順位:
1. URI連携（最も実装が容易で、すぐに提供可能）
2. 共有クラウドストレージを活用した連携
3. 専用Obsidianプラグインの開発（長期的なビジョン）

## 推奨アプローチ

Web記事要約アプリの現状と目標を考慮すると、**段階的な実装**が最適と考えられます：

1. **初期段階（MVP）**: 
   - Obsidian URI機能を使った基本的な連携
   - 要約記事の手動送信機能

2. **中期段階**:
   - シンプルなObsidianプラグインの開発
   - 要約済み記事の自動同期
   - 基本的なメタデータ管理

3. **長期段階**:
   - 双方向同期機能
   - 高度なタグ付けと関連付け
   - Obsidian内でのAI要約機能の提供

特に技術記事の要約と知識管理に特化するという点では、単なるファイル連携ではなく、タグや関連性などのメタデータを活用した知識グラフの構築を目指すのが理想的でしょう。

いずれの方法を選ぶにしても、明確なドキュメントを提供し、ユーザーが簡単にセットアップできるようにすることが重要です。
