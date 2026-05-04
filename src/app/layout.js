import './globals.css';

export const metadata = {
  title: 'NusaJelajah — Temukan Keajaiban Indonesia',
  description: 'Platform wisata terbaik untuk menjelajahi destinasi alam dan budaya Indonesia. Temukan Bromo, Kawah Ijen, Raja Ampat, Bali dan masih banyak lagi.',
  keywords: 'wisata indonesia, travel indonesia, bromo, kawah ijen, raja ampat, bali, komodo',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
