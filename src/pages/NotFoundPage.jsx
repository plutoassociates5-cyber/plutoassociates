import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

export default function NotFoundPage() {
  useEffect(() => {
    document.title = 'Page Not Found — Pluto Associates';
  }, []);

  return (
    <div>
      <PublicNavbar />

      <section className="relative min-h-[70vh] flex items-center justify-center text-center bg-gradient-to-br from-navy to-teal py-24">
        <div className="relative z-10 max-w-[700px] mx-auto px-4 sm:px-6 lg:px-8 pt-[70px]">
          <div className="font-serif text-[clamp(4rem,12vw,7rem)] text-gold font-bold leading-none mb-4">404</div>
          <h1 className="font-serif text-[clamp(1.6rem,4vw,2.4rem)] text-white font-bold mb-4">Page Not Found</h1>
          <p className="text-white/70 text-base mb-8 max-w-lg mx-auto leading-relaxed">
            The page you are looking for may have been moved or no longer exists.
            Explore our practice areas or get in touch with our legal team in Nepal.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/" className="inline-flex items-center gap-3 px-8 py-3.5 bg-gold text-navy font-sans text-sm font-semibold border-2 border-gold cursor-pointer transition-all duration-300 hover:bg-navy hover:text-gold no-underline">Back to Home</Link>
            <Link to="/practice-areas" className="inline-flex items-center gap-3 px-8 py-3.5 bg-transparent text-white font-sans text-sm font-semibold border-2 border-white/30 cursor-pointer transition-all duration-300 hover:border-gold hover:text-gold no-underline">Practice Areas</Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
