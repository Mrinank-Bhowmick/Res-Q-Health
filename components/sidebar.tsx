"use client";
import React, { useEffect } from "react";
import { PanelRightOpen, PanelLeftOpen } from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  title: string;
  sidebarItems: { name: string; href: string }[];
}

const Sidebar: React.FC<SidebarProps> = ({ title, sidebarItems }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    const handleResize = () => {
      const windowSize = window.innerWidth;
      setIsOpen(windowSize >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-gray-800 text-white">
        {isOpen ? (
          <div></div>
        ) : (
          <PanelLeftOpen size={24} onClick={() => setIsOpen(!isOpen)} />
        )}
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:relative top-0 left-0 h-full bg-gray-800 text-white w-64 p-6 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{title}</h2>
            {window.innerWidth <= 768 && isOpen && (
              <PanelRightOpen onClick={() => setIsOpen(!isOpen)} size={24} />
            )}
          </div>

          <nav className="space-y-4">
            {sidebarItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="block py-2.5 px-4 rounded hover:bg-gray-700 transition"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
