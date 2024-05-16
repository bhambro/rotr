
import { RotrProvider } from "@/components/rotr/RotrContext";
import RotrTurnList from "@/components/rotr/RotrTurnList";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-7xl mb-12">
        Rotr
      </h1>

      <RotrProvider>
        <RotrTurnList />
      </RotrProvider>

    </main>
  );
}
