import { geminiModel } from "@/server/ai";
import { generateText } from "ai";
import { z } from "zod";

export default async function Page() {
  const res = await generateText({
    model: geminiModel,
    prompt: "what is the current day ?",
    tools: {
      get_day: {
        description: "Get the current day",
        parameters: z.object({}),
        execute: async () => {
          const today = new Date();
          const day = today.toLocaleDateString();
          return day;
        },
      },
    },
  });

  console.log(res);
  return (
    <div>
      <h1>AI Generated Text</h1>
    </div>
  );
}
