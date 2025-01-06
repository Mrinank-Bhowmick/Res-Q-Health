"use client";

import Sidebar from "@/components/shared/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { sidebarItems } from "@/lib/items/sidebarItems";
import { useRouter } from "next/navigation";

interface SerializableUser {
  username: string | null;
}

interface ChatClientProps {
  user: SerializableUser | null;
}

const ChatClient = ({ user }: ChatClientProps) => {
  const context = useContext(ChatContext);
  const [initialPrompt, setInitialPrompt] = useState<string>("");
  const router = useRouter();

  if (!context) {
    throw new Error("Chat Context must be used within ChatProvider");
  }

  const { setPrompt } = context;

  const handleSubmit = (text: string) => {
    const chatID = uuidv4();
    setPrompt(text);
    router.push(`/chat/c/${chatID}`);
  };

  return (
    <div className="flex h-screen">
      <Sidebar title="ResQ Health" sidebarItems={sidebarItems} />
      <div className="w-full flex flex-col">
        <div className="flex justify-start p-2 h-[85vh]">
          <div className="bg-teal-50 h-full w-full rounded-md">
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <h1 className="text-3xl font-bold">{user?.username}</h1>
                <p className="text-lg">Welcome to ResQ Health Chatbot</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center px-6 py-3 bg-teal-50 h-[15vh] gap-4">
          <div className="">Chat</div>
          <Input
            className="border-2 border-teal-600 rounded-lg shadow-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
            placeholder="Type your message..."
            value={initialPrompt}
            onChange={(e) => setInitialPrompt(e.target.value)}
          />
          <Button
            className=""
            onClick={() => {
              console.log(initialPrompt);
              handleSubmit(initialPrompt);
            }}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatClient;
