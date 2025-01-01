import Sidebar from "@/components/shared/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import React from "react";

const Page = async () => {
  const sidebarItems = [
    { name: "Chatbot", href: "/chat" },
    { name: "Stats", href: "/stats" },
  ];
  const user = await currentUser();

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
          />
          <Button className="">Send</Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
