import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-black dark:text-zinc-50 mb-4">
            BioChain
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            Plataforma segura para gestión de datos clínicos
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Card Contribuyente */}
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Soy Contribuyente</CardTitle>
              <CardDescription className="text-base">
                Sube tus análisis médicos y gana USDC cuando sean utilizados en reportes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Completa tu historial clínico</li>
                <li>✓ Sube análisis en PDF</li>
                <li>✓ Recibe 5 USDC por cada uso</li>
                <li>✓ Visualiza tus earnings</li>
              </ul>
              <Link href="/contributor" className="block">
                <Button className="w-full" size="lg">
                  Acceder como Contribuyente
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card Investigador */}
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Soy Investigador</CardTitle>
              <CardDescription className="text-base">
                Genera reportes personalizados con IA usando el dataset global
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Compra BioCredits (1 = $60)</li>
                <li>✓ Define filtros personalizados</li>
                <li>✓ Genera reportes con IA</li>
                <li>✓ Descarga análisis completos</li>
              </ul>
              <Link href="/researcher" className="block">
                <Button className="w-full" size="lg" variant="outline">
                  Acceder como Investigador
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
