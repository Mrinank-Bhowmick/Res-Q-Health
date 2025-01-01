import Sidebar from "@/components/shared/sidebar";
import { ClerkProvider } from "@clerk/nextjs";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const navItems = [
    { name: "Home", href: "#" },
    { name: "Profile", href: "#" },
    { name: "Settings", href: "#" },
  ];

  return (
    <ClerkProvider>
      <div className="h-full relative">
        <div className="">{children}</div>
      </div>
    </ClerkProvider>
  );
};

export default DashboardLayout;
