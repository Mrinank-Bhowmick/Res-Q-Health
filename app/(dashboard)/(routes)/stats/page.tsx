import Sidebar from "@/components/sidebar";
import React from "react";

const Page = () => {
  const sidebarItems = [
    { name: "Chatbot", href: "/chat" },
    { name: "Stats", href: "/stats" },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar title="ResQ Health" sidebarItems={sidebarItems} />
      <div className="w-full flex justify-center items-center">
        Write your stats code here
      </div>
    </div>
  );
};

export default Page;
