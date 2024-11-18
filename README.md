## How to develop using the Gemma2 model in Genkit

Google introduced Gemma2, an open-source LLM, in June 2024. This article introduces how to make requests to Gemma2 using Firebase Genkit.

## Step 1. Installing Ollama Gemma2

Using Ollama allows you to run Gemma2 as a local LLM.

First, install Ollama by following the [official guide](https://github.com/ollama/ollama).

Next, install Gemma2 using Ollama.

```sh
ollama run gemma2
```

Currently, Gemma2 is available in three different sizes. However, the 16GB version of Gemma2 was very slow on my Mac, so I used the 5.5GB version. Please install the version that suits your environment when you try it.

- Gemma2 (1.6GB): ollama run gemma2:2b
- Gemma2 (5.5GB): ollama run gemma2
- Gemma2 (16GB): ollama run gemma2:27b

Once the installation is successful, you can prompt Gemma2 from the command line.

## Step 2. Creating a Genkit Project

Run the following commands to create a Genkit project. Choose `Ollama` when asked for the `model provider`.

```sh
% npm init -y
% npm i -D genkit-cli
% npm i genkit @genkit-ai/googleai genkitx-ollama
% mkdir src && touch src/index.ts
```

Once Genkit is installed, a sample code like the following will be generated in `src/index.ts`.

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

## Step 3. Run locally

Start Genkit. The browser will launch when you run the following command.

```sh
% npx genkit start -- npx tsx --watch src/index.ts
```

## Conclusion

With Genkit and Gemma2, we were able to create a development platform using a local LLM. It's impressive that this can be achieved in about 30 lines of code with Genkit. I encourage everyone to give it a try.

The source code is available on GitHub at the following link:
https://github.com/tanabee/genkit-gemma2-sample
