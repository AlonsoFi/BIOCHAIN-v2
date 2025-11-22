import { ContributorDashboard } from "@/components/ContributorDashboard";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="container mx-auto px-4 py-8">
        <ContributorDashboard />
      </main>
    </div>
  );
}

