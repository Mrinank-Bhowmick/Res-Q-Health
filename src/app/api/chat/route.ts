import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { tools } from "@/ai/tools";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(request: Request) {
  const { messages } = await request.json();

  const result = streamText({
    model: google("gemini-1.5-pro-latest"),
    system: "You are a friendly assistant!",
    messages,
    maxSteps: 5,
    tools,
  });

  return result.toDataStreamResponse();
}
