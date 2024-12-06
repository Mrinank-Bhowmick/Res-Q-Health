"use server";

import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { ReactNode } from "react";
import { z } from "zod";
import { nanoid } from "nanoid";
import { geminiModel } from "@/server/ai";
import { SystemMessage } from "@/components/chat/SystemMessage";

export interface ServerMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
}

export async function continueConversation(
  input: string,
): Promise<ClientMessage> {
  "use server";
  const history = getMutableAIState<typeof AI>();
  const result = await streamUI({
    model: geminiModel,
    messages: [...history.get(), { role: "user", content: input }],
    text: ({ content, done }) => {
      if (done) {
        const nMeesages: {
          role: "user" | "assistant";
          content: string;
        }[] = [...history.get(), { role: "assistant", content }];
        history.done(nMeesages);
      }
      return <SystemMessage message={content} />;
    },
  });
  return {
    id: nanoid(),
    role: "assistant",
    display: result.value,
  };
}

export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation,
  },
  initialAIState: [],
  initialUIState: [],
});
