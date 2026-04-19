import { Outlet } from 'react-router-dom';
import Footer from '@/components/Partials/Footer'; // Importer le footer
import WebsiteNav from '@/components/Partials/WebsiteNav';


const SiteLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface"> 
      <WebsiteNav />
      <main className="flex-grow flex flex-col relative pt-[72px]">
        <Outlet /> 

      </main>
      <Footer />
    </div>
  );
};

export default SiteLayout;

