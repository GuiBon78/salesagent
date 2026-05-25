import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OS Lingueo — Dashboard Agents IA',
  description: 'Dashboard commercial IA Lingueo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
