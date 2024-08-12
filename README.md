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

Once Genkit is installed, a sample code like the following will be generated in `src/index.ts`.

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

## Step 3. Connecting Genkit with Ollama Gemma2

Simply replace `gemma` with `gemma2`, and you're done.

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

## Run locally

Start Genkit. The browser will launch when you run the following command.

```sh
% genkit start -o
```

## Conclusion

With Genkit and Gemma2, we were able to create a development platform using a local LLM. It's impressive that this can be achieved in about 30 lines of code with Genkit. I encourage everyone to give it a try.

The source code is available on GitHub at the following link:
https://github.com/tanabee/genkit-gemma2-sample
