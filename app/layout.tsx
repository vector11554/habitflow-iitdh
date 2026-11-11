import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HabitFlow — IIT Dharwad",
  description: "A thoughtful habit-building space for the IIT Dharwad community."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
