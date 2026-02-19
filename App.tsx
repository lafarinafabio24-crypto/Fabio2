
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Sections/Hero';
import Interests from './components/Sections/Interests';
import About from './components/Sections/About';
import Contact from './components/Sections/Contact';
import ClientPortal from './components/Sections/ClientPortal';
import PrivateArea from './components/Admin/PrivateArea';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-light text-brand-dark font-sans selection:bg-brand-accent selection:text-white">
      <Header />
      
      <main>
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

export default App;
