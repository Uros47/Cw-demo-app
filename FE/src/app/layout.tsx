import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import { Box } from "@mui/material";
import { UserContextProvider } from "./context/UsersContext";

export const metadata: Metadata = {
  title: "CW demo app",
  description: "Next.js/MUI demo app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav>
          <Navbar />
        </nav>
        <main style={{ marginTop: "2rem" }}>
          <UserContextProvider>{children}</UserContextProvider>
        </main>
      </body>
    </html>
  );
}
