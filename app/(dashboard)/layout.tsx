import Sidebar from "@/components/sidebar";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const navItems = [
    { name: "Home", href: "#" },
    { name: "Profile", href: "#" },
    { name: "Settings", href: "#" },
  ];

  return (
    <div className="h-full relative">
      <div className="">{children}</div>
    </div>
  );
};

export default DashboardLayout;
