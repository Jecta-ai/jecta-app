// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { ChatProvider } from "./chat/providers/chatProvider";
import { ValidatorProvider } from "./chat/providers/validatorProvider";
import MenuProvider from "./chat/providers/menuProvider";
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
      </body>
    </html>
  );
}
