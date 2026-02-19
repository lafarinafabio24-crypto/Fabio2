
import Hero from '../components/Sections/Hero';
import Interests from '../components/Sections/Interests';
import About from '../components/Sections/About';
import ClientPortal from '../components/Sections/ClientPortal';
import Contact from '../components/Sections/Contact';
import PrivateArea from '../components/Admin/PrivateArea';

export default function Home() {
  return (
    <>
      <Hero />
      <Interests />
      <About />
      <ClientPortal />
      <Contact />
      <PrivateArea />
    </>
  );
}
