export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d2157] to-[#0a1628]">
      {children}
    </div>
  );
}
