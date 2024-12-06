import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { env } from "@/env";

const google = createGoogleGenerativeAI({
  apiKey: env.GEMINI_API,
});

export const geminiModel = google("gemini-1.5-pro");
