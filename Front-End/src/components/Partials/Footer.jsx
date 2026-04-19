import { Link } from 'react-router-dom';
import { NEWS, STORE } from '../../router/Router';

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant w-full px-8 md:px-12 py-12 md:py-16 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
      {/* Brand */}
      <div className="font-headline font-black text-xl text-secondary tracking-tight">
        KINETIC COURT
      </div>

      {/* Nav links */}
      <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
        <a
          href="#"
          className="font-body font-semibold tracking-widest text-xs text-on-surface-variant hover:text-secondary hover:translate-x-1 transition-all duration-300"
        >
          PRIVACY POLICY
        </a>
        <a
          href="#"
          className="font-body font-semibold tracking-widest text-xs text-on-surface-variant hover:text-secondary hover:translate-x-1 transition-all duration-300"
        >
          TERMS OF SERVICE
        </a>
        <a
          href="#"
          className="font-body font-semibold tracking-widest text-xs text-on-surface-variant hover:text-secondary hover:translate-x-1 transition-all duration-300"
        >
          SPONSORSHIP
        </a>
        <Link
          to={STORE}
          className="font-body font-semibold tracking-widest text-xs text-on-surface-variant hover:text-secondary hover:translate-x-1 transition-all duration-300"
        >
          SHOP
        </Link>
        <Link
          to={NEWS}
          className="font-body font-semibold tracking-widest text-xs text-on-surface-variant hover:text-secondary hover:translate-x-1 transition-all duration-300"
        >
          NEWS
        </Link>
        <a
          href="#"
          className="font-body font-semibold tracking-widest text-xs text-on-surface-variant hover:text-secondary hover:translate-x-1 transition-all duration-300"
        >
          CONTACT
        </a>
      </nav>

      {/* Copyright */}
      <div className="font-body font-semibold tracking-widest text-xs text-on-surface-variant text-center md:text-right">
        {`© ${new Date().getFullYear()} KINETIC COURT BASKETBALL. ALL RIGHTS RESERVED.`}
      </div>
    </footer>
  );
}
