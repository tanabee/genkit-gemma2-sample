## Genkit を使って Gemma2 をローカル LLM として呼び出す

2024/6/27 に Google のオープンソース LLM の Gemma2 が発表されました。この記事では Firebase Genkit を用いて Gemma2 にリクエストする方法を紹介します。

## Step 1. Ollama Gemma2 のインストール

Ollama を用いると Gemma2 をローカル LLM として動作させることができます。

まず Ollama を[公式ガイド](https://github.com/ollama/ollama)に従ってインストールします。

次に Ollama を使って Gemma2 をインストールします。

```sh
ollama run gemma2
```

現在 Gemma2 はサイズの異なる 3 種類が提供されていますが、私の Mac では Gemma2 の 16GB は動作がすごく重かったので 5.5GB を利用しています。皆さんが試す際は環境にあったバージョンをインストールしてください。

- Gemma2 (1.6GB): ollama run gemma2:2b
- Gemma2 (5.5GB): ollama run gemma2
- Gemma2 (16GB) : ollama run gemma2:27b

インストールが成功すると Gemma2 にコマンドラインからプロンプトを投げることができます。

## Step 2. Genkit プロジェクトの作成

以下のコマンドを叩いて Genkit プロジェクトを作成します。 `model provider` を問われた時に `Ollama` を選択しましょう。

```sh
% npm init -y
% npm i -D genkit-cli
% npm i genkit @genkit-ai/googleai genkitx-ollama
% mkdir src && touch src/index.ts
```

`src/index.ts` に以下のコードを貼り付けます。

```typescript:src/index.ts
import { genkit, z } from 'genkit'
import { ollama } from 'genkitx-ollama'

const ai = genkit({
  plugins: [
    ollama({
      models: [{ name: 'gemma2' }],
      serverAddress: 'http://127.0.0.1:11434',
    }),
  ],
  model: 'ollama/gemma2',
})

const mainFlow = ai.defineFlow(
  {
    name: 'mainFlow',
    inputSchema: z.string(),
  },
  async input => {
    const { text } = await ai.generate(input)
    return text
  }
)

ai.startFlowServer({ flows: [mainFlow] })
```

## Step 3. ローカル起動

Genkit を起動させます。以下のコマンドを叩くとブラウザが起ち上がります。

```sh
% npx genkit start -- npx tsx --watch src/index.ts
```

## 終わりに

Genkit と Gemma2 を使ってローカル LLM を用いた開発基盤を作ることができました。Genkit を使うと 30 行程度で実現できることはすごいことだと思います。みなさんも是非試してみてください。

ソースコードは以下の GitHub からアクセスできます。
https://github.com/tanabee/genkit-gemma2-sample
