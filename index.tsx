
import React from 'react';
import { createRoot } from 'react-dom/client';
import Hero from './components/Sections/Hero';
import Interests from './components/Sections/Interests';
import About from './components/Sections/About';
import ClientPortal from './components/Sections/ClientPortal';
import Contact from './components/Sections/Contact';
import PrivateArea from './components/Admin/PrivateArea';
import Header from './components/Header';
import Footer from './components/Footer';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Interests />
        <About />
        <ClientPortal />
        <Contact />
        <PrivateArea />
      </main>
      <Footer />
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
