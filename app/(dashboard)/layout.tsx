import Sidebar from "@/components/shared/sidebar";
import ChatProvider from "@/context/ChatContext";
import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
import { Analytics } from "@vercel/analytics/react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const navItems = [
    { name: "Home", href: "#" },
    { name: "Profile", href: "#" },
    { name: "Settings", href: "#" },
  ];

  return (
    <ClerkProvider>
      <ChatProvider>
        <div className="h-full relative">
          <div className="">{children}</div>
        </div>
        <Analytics />
      </ChatProvider>
    </ClerkProvider>
  );
};

export default DashboardLayout;
