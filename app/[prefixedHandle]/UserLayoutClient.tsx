// app/[handle]/layout.tsx
"use client";

import { useState } from "react";
import { TabMenu } from "primereact/tabmenu";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { MenuItem } from "primereact/menuitem";
import { usePathname, useRouter } from "next/navigation";
import { Category } from "@prisma/client";

// Types for the component props
interface UserLayoutProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    categories: Category[];
  };
  isOwner: boolean;
  handle: string;
}

export default function UserLayoutClient({
  children,
  user,
  isOwner,
  handle,
}: UserLayoutProps) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Convert categories to menu items
  const menuItems: (MenuItem & { id: string })[] = user.categories.map(
    (category) => ({
      id: category.id, // Store category id
      label: category.name,
      icon: "pi pi-folder",
      command: () => {
        router.push(`/${handle}/${category.slug}`);
      },
      className: pathname.includes(`/${category.slug}`) ? "p-highlight" : "",
    }),
  );

  return (
    <div className="flex flex-col">
      {/* Desktop Navigation */}
      <div className="hidden md:block border-bottom-1 surface-border">
        <TabMenu model={menuItems} className="surface-ground" />
      </div>

      {/* Mobile Navigation */}
      <div className="block md:hidden p-3 flex justify-between align-items-center surface-ground">
        <Button
          icon="pi pi-bars"
          onClick={() => setSidebarVisible(true)}
          className="p-button-text"
        />
        <span className="text-xl font-bold">{user.name}&apos;s Categories</span>
      </div>

      {/* Mobile Sidebar */}
      <Sidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        className="w-80"
      >
        <h2 className="text-xl font-bold mb-4">
          {user.name}&apos;s Categories
        </h2>
        <div className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              label={item.label}
              icon={item.icon}
              className="p-button-text justify-content-start"
              onClick={() => {
                // @ts-ignore
                item.command?.();
                setSidebarVisible(false);
              }}
            />
          ))}
        </div>
      </Sidebar>

      {/* Main Content */}
      <main className="p-4">{children}</main>
    </div>
  );
}
