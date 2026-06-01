"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

interface DashboardShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function DashboardShell({ children, title, subtitle }: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 64 : 240;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <div
        className="flex-1 flex flex-col min-w-0 transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
