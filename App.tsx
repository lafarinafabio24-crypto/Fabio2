
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
    <div className="min-h-screen flex flex-col font-sans bg-[#e0ede4]">
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

export default App;
