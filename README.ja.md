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
% mkdir genkit-gemma2-sample
% cd genkit-gemma2-sample
% genkit init

? Select a runtime to initialize a Genkit project: (Use arrow keys)
❯ Node.js
? Select a runtime to initialize a Genkit project: Node.js
? Select a deployment platform:
  Firebase
? Select a deployment platform: Other platforms
? Select a model provider:
  Google AI
? Select a model provider: Ollama (e.g. Gemma)
✔ Successfully initialized NPM project
✔ Successfully installed NPM packages
✔ Successfully updated tsconfig.json
✔ Successfully updated package.json
? Would you like to generate a sample flow? (Y/n) Y

? Would you like to generate a sample flow? Yes
✔ Successfully generated sample file (src/index.ts)
If you don't have Ollama already installed and configured, refer to https://developers.google.com/genkit/plugins/ollama

Genkit successfully initialized.
```

Genkit のインストールが成功すると `src/index.ts` に以下のようなサンプルコードが生成されます。

```typescript:src/index.ts
import * as z from 'zod'

import { generate } from '@genkit-ai/ai'
import { configureGenkit } from '@genkit-ai/core'
import { defineFlow, startFlowsServer } from '@genkit-ai/flow'
import { ollama } from 'genkitx-ollama'

configureGenkit({
  plugins: [
    ollama({
      models: [{ name: 'gemma' }],
      serverAddress: 'http://127.0.0.1:11434',
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
})

export const menuSuggestionFlow = defineFlow(
  {
    name: 'menuSuggestionFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async subject => {
    const llmResponse = await generate({
      prompt: `Suggest an item for the menu of a ${subject} themed restaurant`,
      model: 'ollama/gemma',
      config: {
        temperature: 1,
      },
    })
    return llmResponse.text()
  }
)

startFlowsServer()
```

## Step 3. Genkit と Ollama Gemma2 の接続

`gemma` と記載されていた部分を `gemma2` に置き換えたら完成です。

```typescript:src/index.ts
configureGenkit({
  plugins: [
    ollama({
      models: [{ name: 'gemma2' }],
      serverAddress: 'http://127.0.0.1:11434',
    }),
  ],
})

export const menuSuggestionFlow = defineFlow(
  async subject => {
    const llmResponse = await generate({
      prompt: `Suggest an item for the menu of a ${subject} themed restaurant`,
      model: 'ollama/gemma2',
    })
    return llmResponse.text()
  }
)
```

## ローカル起動

Genkit を起動させます。以下のコマンドを叩くとブラウザが起ち上がります。

```sh
% genkit start -o
```

## 終わりに

Genkit と Gemma2 を使ってローカル LLM を用いた開発基盤を作ることができました。Genkit を使うと 30 行程度で実現できることはすごいことだと思います。みなさんも是非試してみてください。

ソースコードは以下の GitHub からアクセスできます。
https://github.com/tanabee/genkit-gemma2-sample
