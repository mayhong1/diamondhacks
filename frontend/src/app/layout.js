import "./globals.css";
import FloatingIcons from "@/components/Background/FloatingIcons";

export const metadata = {
  title: "NotRedShirt",
  description:
    "Made by Spencer Cowles, Markus Grundler, Daniel Bonkowsky, and May Hong",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <FloatingIcons />
        {children}
      </body>
    </html>
  );
}
