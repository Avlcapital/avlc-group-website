import AdminSessionGuard from "@/components/admin-session-guard";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminSessionGuard>{children}</AdminSessionGuard>;
}
