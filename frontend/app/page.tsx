import { ClinicalHistoryForm } from "@/components/ClinicalHistoryForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-black dark:text-zinc-50 mb-2">
            BioChain
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Completa tu historial clínico de forma segura
          </p>
        </div>
        <ClinicalHistoryForm />
      </main>
    </div>
  );
}
