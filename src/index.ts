import * as z from 'zod'
import { generate } from '@genkit-ai/ai'
import { configureGenkit } from '@genkit-ai/core'
import { defineFlow, startFlowsServer } from '@genkit-ai/flow'
import { ollama } from 'genkitx-ollama'

configureGenkit({
  plugins: [
    ollama({
      models: [{ name: 'gemma2' }],
      serverAddress: 'http://127.0.0.1:11434',
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
})

export const mainFlow = defineFlow(
  {
    name: 'mainFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async prompt => {
    const llmResponse = await generate({
      prompt,
      model: 'ollama/gemma2',
    })
    return llmResponse.text()
  }
)

startFlowsServer()
