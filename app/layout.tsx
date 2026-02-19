
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'La Farina Fabio | Portfolio & Vault',
  description: 'Portfolio moderno di La Farina Fabio. Sport, Pop Culture e Digital Strategy.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className="scroll-smooth">
      <body className="selection:bg-brand-accent selection:text-white overflow-x-hidden bg-[#e0ede4]">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
