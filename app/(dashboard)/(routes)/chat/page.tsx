import Sidebar from "@/components/shared/sidebar";
import { Input } from "@/components/ui/input";
import React from "react";

const Page = () => {
  const sidebarItems = [
    { name: "Chatbot", href: "/chat" },
    { name: "Stats", href: "/stats" },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar title="ResQ Health" sidebarItems={sidebarItems} />
      <div className="w-full flex flex-col justify-between">
        <div className="flex justify-start">Home page after user sign in</div>
        <div className="flex justify-center items-center px-6 py-3">
          <div>Chat</div>
          <Input />
        </div>
      </div>
    </div>
  );
};

export default Page;
