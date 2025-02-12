// app/page.tsx

import Chatbot from "@/components/ChatBot";

import "./globals.css"
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Chatbot />
    </main>
  );
}
