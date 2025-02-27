import type { Metadata } from "next";
import "./globals.css";
import { ChatProvider } from "./providers/chatProvider";
import { ValidatorProvider } from "./providers/validatorProvider";
import MenuProvider from "./providers/menuProvider";
import { Analytics } from "@vercel/analytics/react";
export const metadata: Metadata = {
  title: "Jecta",
  description: "First open-source AI copilot built on Injective Blockchain",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <ChatProvider>
          <MenuProvider>
            <ValidatorProvider>{children}</ValidatorProvider>
          </MenuProvider>
        </ChatProvider>
        <Analytics />
      </body>
    </html>
  );
}
