import { genkit, z } from 'genkit'
import { ollama } from 'genkitx-ollama'

const ai = genkit({
  plugins: [ollama({ models: [{ name: 'gemma2' }], serverAddress: 'http://127.0.0.1:11434' })],
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
