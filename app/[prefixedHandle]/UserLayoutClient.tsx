// app/[handle]/layout.tsx
"use client";

import React, { useState } from "react";
import { TabMenu } from "primereact/tabmenu";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { MenuItem } from "primereact/menuitem";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Category } from "@prisma/client";
import { extractHandleFromParam, formatHandleForUrl } from "@/lib/utils/handle";

interface UserLayoutProps {
  children: React.ReactNode;
  isOwner: boolean;
  categories?: Category[];
}

export default function UserLayoutClient({
  children,
  isOwner,
  categories = [], // Default empty array for optional prop
}: UserLayoutProps) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { prefixedHandle } = useParams<{ prefixedHandle: string }>();
  const handle = extractHandleFromParam(prefixedHandle);

  // Improved type definition for menu items
  const menuItems: MenuItem[] = categories.map((category) => ({
    id: category.id, // Using id directly in MenuItem
    key: category.id,
    label: category.name,
    icon: "pi pi-folder",
    command: () => {
      router.push(`/${formatHandleForUrl(handle)}/${category.slug}`);
    },
    className: pathname.includes(`/${category.slug}`) ? "p-highlight" : "",
  }));

  const pageTitle = `Categories${isOwner ? " (Owner View)" : ""}`;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Desktop Navigation */}
      <div className="hidden md:block border-b surface-border">
        <TabMenu
          model={menuItems}
          className="surface-ground"
          aria-label="Category navigation"
        />
      </div>

      {/* Mobile Navigation */}
      <div className="block md:hidden p-3 flex justify-between items-center surface-ground">
        <Button
          icon="pi pi-bars"
          onClick={() => setSidebarVisible(true)}
          className="p-button-text"
          aria-label="Open navigation menu"
        />
        <span className="text-xl font-medium">{pageTitle}</span>
      </div>

      {/* Mobile Sidebar */}
      <Sidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        className="w-80"
        aria-label="Category navigation sidebar"
      >
        <h2 className="text-xl font-medium mb-4">{pageTitle}</h2>
        <div className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              label={item.label?.toString()}
              icon={item.icon}
              className="p-button-text justify-start w-full"
              onClick={() => {
                item.command?.();
                setSidebarVisible(false);
              }}
            />
          ))}
        </div>
      </Sidebar>

      {/* Main Content */}
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
