import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — RACTIVE",
  description: "Your AI Command Center. Manage trends, scripts, content, and analytics in one place.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
