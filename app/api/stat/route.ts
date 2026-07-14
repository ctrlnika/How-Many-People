import { generateObject } from "ai"
import { z } from "zod"

export const maxDuration = 30

const statSchema = z.object({
  percentage: z
    .number()
    .min(0)
    .max(100)
    .describe("The estimated percentage of people (0-100) that matches the query"),
  description: z
    .string()
    .describe(
      "A short third-person phrase completing the sentence 'X out of 100 people ___', e.g. 'experience anxiety disorders'",
    ),
  answerable: z
    .boolean()
    .describe("Whether the query is a valid 'how many people' style question that can be answered with a percentage"),
})

export async function POST(req: Request) {
  try {
    const { query } = await req.json()

    if (!query || typeof query !== "string" || !query.trim()) {
      return Response.json({ error: "A query is required." }, { status: 400 })
    }

    const { object } = await generateObject({
      model: "openai/gpt-5-mini",
      schema: statSchema,
      prompt: `You are a statistics estimator for an app called "How Many People".
The user asks a question about what fraction of people share some trait, condition, habit, or behavior.
Give your best evidence-informed estimate of the global (or general population) percentage.

Rules:
- Return a whole or one-decimal number between 0 and 100 for "percentage".
- "description" must be a concise third-person phrase that finishes the sentence "N out of 100 people ___".
  Examples: "experience anxiety disorders", "are left-handed", "drink coffee regularly".
- Do not include the number or the word "percent" in the description.
- If the question cannot reasonably be answered with a population percentage (e.g. gibberish or off-topic), set answerable to false, percentage to 0, and description to a brief explanation.

User question: "${query}"`,
    })

    return Response.json(object)
  } catch (error) {
    console.log("[v0] /api/stat error:", error instanceof Error ? error.message : error)
    return Response.json({ error: "Failed to generate a statistic. Please try again." }, { status: 500 })
  }
}
