import "./globals.css";

export const metadata = {
  title: "DiamondHacks2025",
  description:
    "Made by Spencer Cowles, Markus Grundler, Daniel Bonkowsky, and May Hong",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
