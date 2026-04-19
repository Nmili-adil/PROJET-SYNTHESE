import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NEWS, STORE, ALLPRODUCTS } from '../router/Router';
import SponsorCarousel from '@/components/Partials/SponsorCarousel';

const newsItems = [
  {
    id: 1,
    category: 'Game Recap',
    title: 'Dominant Fourth Quarter Secures The Win',
    summary: 'The team rallied behind a spectacular 40-point performance from the captain, erasing a double-digit deficit in the final minutes.',
    image: '/lakersTeams.jpg',
  },
  {
    id: 2,
    category: 'Roster Update',
    title: 'New Signing Brings Veteran Leadership',
    summary: 'Management announces the addition of an experienced guard to bolster the backcourt rotation ahead of the playoff push.',
    image: '/images/lebronjames3.jpeg',
  },
  {
    id: 3,
    category: 'Facility',
    title: 'Arena Upgrades Unveiled For Next Season',
    summary: 'Fans can expect a new state-of-the-art center hung scoreboard and enhanced courtside seating options.',
    image: '/players.jpg',
  },
];

const socialLinks = [
  { icon: 'photo_camera', label: 'INSTAGRAM', href: 'https://instagram.com' },
  { icon: 'play_arrow', label: 'YOUTUBE', href: 'https://youtube.com' },
  { icon: 'chat', label: 'TWITTER', href: 'https://twitter.com' },
  { icon: 'music_note', label: 'TIKTOK', href: 'https://tiktok.com' },
];

function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <div className="w-full min-h-screen bg-surface text-on-surface font-body">

      {/* ── 1. Hero ── */}
      <section className="relative h-screen min-h-[600px] w-full bg-surface-container-lowest overflow-hidden flex items-end pb-12 px-6 md:px-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/asset/lebron-1.jpg"
            alt="Hero"
            className="w-full h-full object-cover object-center opacity-60"
            style={{ mixBlendMode: 'luminosity' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-end justify-between gap-8">
          <div
            className="w-full md:w-2/3 p-8 md:p-12"
            style={{
              background: 'rgba(85,37,131,0.6)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(75,68,80,0.15)',
            }}
          >
            <h2 className="font-headline font-black text-secondary tracking-widest text-xs mb-4 uppercase">
              Season Premiere
            </h2>
            <h1 className="font-headline font-black text-5xl md:text-7xl leading-none text-white uppercase tracking-tighter mb-6">
              A New Dynasty <br />
              <span className="text-secondary">Awakens</span>
            </h1>
            <p className="font-body text-on-surface-variant max-w-lg mb-8 text-lg">
              The court is set. The legacy continues. Witness the power, precision, and pure kinetic energy of this season's roster.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link
                to={STORE}
                className="bg-secondary text-on-secondary px-8 py-4 font-headline font-bold uppercase tracking-wider hover:bg-secondary-container transition-all duration-500"
              >
                Get Tickets
              </Link>
              <Link
                to={NEWS}
                className="text-on-surface px-8 py-4 font-headline font-bold uppercase tracking-wider hover:bg-surface-variant/60 transition-all duration-500"
                style={{
                  background: 'rgba(55,52,56,0.4)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(75,68,80,0.15)',
                }}
              >
                Watch Highlights
              </Link>
            </div>
          </div>

          {/* Slider dots (decorative) */}
          <div className="flex gap-2 pb-4">
            <div className="w-12 h-1 bg-secondary" />
            <div className="w-12 h-1 bg-surface-variant" />
            <div className="w-12 h-1 bg-surface-variant" />
          </div>
        </div>
      </section>

      {/* ── 2. Sponsor Carousel ── */}
      <section
        className="py-6 border-y bg-surface-container-lowest"
        style={{ borderColor: 'rgba(75,68,80,0.3)' }}
      >
        <SponsorCarousel />
      </section>

      {/* ── 3. Latest News ── */}
      <section className="py-20 px-6 md:px-16 bg-surface max-w-[1920px] mx-auto">
        <div className="flex justify-between items-end mb-14">
          <h2 className="font-headline font-black text-4xl md:text-5xl uppercase tracking-tighter">
            The <span className="text-secondary">Chronicles</span>
          </h2>
          <Link
            to={NEWS}
            className="text-secondary font-headline font-bold uppercase tracking-wider text-sm flex items-center gap-2 hover:text-secondary-fixed transition-all duration-300"
          >
            View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsItems.map((item) => (
            <article
              key={item.id}
              onClick={() => navigate(NEWS)}
              className="bg-surface-container-low group cursor-pointer overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:bg-surface-container-high"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-all duration-700 opacity-80 group-hover:opacity-100 group-hover:scale-105"
                  style={{ mixBlendMode: 'luminosity' }}
                  onMouseOver={e => (e.currentTarget.style.mixBlendMode = 'normal')}
                  onMouseOut={e => (e.currentTarget.style.mixBlendMode = 'luminosity')}
                />
              </div>
              <div className="p-8">
                <div className="text-secondary font-headline text-xs font-bold tracking-widest uppercase mb-3">
                  {item.category}
                </div>
                <h3 className="font-headline font-bold text-2xl leading-tight mb-4 group-hover:text-secondary transition-all duration-300">
                  {item.title}
                </h3>
                <p className="font-body text-on-surface-variant text-sm line-clamp-3">{item.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── 4. Exclusive Collection Banner ── */}
      <section
        className="relative w-full overflow-hidden flex items-center justify-center"
        style={{ height: '500px' }}
      >
        <div
          className="absolute inset-0 z-0 opacity-40"
          style={{
            backgroundImage: "url('/asset/drapo-1.jpg')",
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mixBlendMode: 'luminosity',
          }}
        />
        <div
          className="absolute inset-0 z-10"
          style={{ background: 'linear-gradient(to right, var(--kc-surface), color-mix(in srgb, var(--kc-surface) 80%, transparent), transparent)' }}
        />
        <div className="relative z-20 text-center px-8">
          <h2 className="font-headline font-black text-6xl md:text-8xl uppercase tracking-tighter text-white mb-6">
            The <span className="text-secondary">Exclusive</span>
            <br />Collection
          </h2>
          <p className="font-body text-on-surface-variant text-xl mb-10 max-w-2xl mx-auto">
            Elevate your game day attire with our premium line of team apparel.
          </p>
          <Link
            to={STORE}
            className="inline-block bg-secondary text-on-secondary px-12 py-5 font-headline font-black text-lg uppercase tracking-widest hover:bg-secondary-container transition-all duration-500"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* ── 5. Gear Up (Shop Categories) ── */}
      <section className="py-20 px-6 md:px-16 bg-surface max-w-[1920px] mx-auto">
        <h2 className="font-headline font-black text-4xl md:text-5xl uppercase tracking-tighter mb-14 text-center">
          Gear Up
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Jerseys */}
          <Link
            to={ALLPRODUCTS}
            className="group relative overflow-hidden bg-surface-container-low block"
            style={{ height: '480px' }}
          >
            <img
              src="/players/Pau Gasol.jpg"
              alt="Jerseys"
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
              style={{ mixBlendMode: 'luminosity' }}
            />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-all duration-500"
              style={{ background: 'linear-gradient(135deg,#552583,#5e2e8c)', mixBlendMode: 'multiply' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-dim via-transparent to-transparent" />
            <div
              className="absolute bottom-6 left-6 right-6 p-6 flex justify-between items-end transform translate-y-4 group-hover:translate-y-0 transition-all duration-500"
              style={{
                background: 'rgba(85,37,131,0.6)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(75,68,80,0.15)',
                boxShadow: '0 0 0 0 transparent',
              }}
              onMouseOver={e => (e.currentTarget.style.boxShadow = '0px 0px 30px rgba(255,190,60,0.3)')}
              onMouseOut={e => (e.currentTarget.style.boxShadow = 'none')}
            >
              <div>
                <h3 className="font-headline font-black text-3xl uppercase tracking-tighter text-white mb-1">
                  Authentic Jerseys
                </h3>
                <p className="font-body text-secondary text-sm font-semibold tracking-wider uppercase">
                  Wear the colors
                </p>
              </div>
              <span className="material-symbols-outlined text-secondary text-3xl">arrow_forward</span>
            </div>
          </Link>

          {/* Footwear */}
          <Link
            to={ALLPRODUCTS}
            className="group relative overflow-hidden bg-surface-container-low block"
            style={{ height: '480px' }}
          >
            <img
              src="/players.jpg"
              alt="Footwear"
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
              style={{ mixBlendMode: 'luminosity' }}
            />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-all duration-500"
              style={{ background: 'linear-gradient(135deg,#552583,#5e2e8c)', mixBlendMode: 'multiply' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-dim via-transparent to-transparent" />
            <div
              className="absolute bottom-6 left-6 right-6 p-6 flex justify-between items-end transform translate-y-4 group-hover:translate-y-0 transition-all duration-500"
              style={{
                background: 'rgba(85,37,131,0.6)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(75,68,80,0.15)',
              }}
            >
              <div>
                <h3 className="font-headline font-black text-3xl uppercase tracking-tighter text-white mb-1">
                  Performance Kicks
                </h3>
                <p className="font-body text-secondary text-sm font-semibold tracking-wider uppercase">
                  Own the court
                </p>
              </div>
              <span className="material-symbols-outlined text-secondary text-3xl">arrow_forward</span>
            </div>
          </Link>
        </div>
      </section>

      {/* ── 6. Newsletter ── */}
      <section className="py-20 px-6 md:px-16 bg-surface-container-lowest">
        <div
          className="max-w-4xl mx-auto p-10 md:p-12 relative overflow-hidden"
          style={{
            background: 'rgba(85,37,131,0.6)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(75,68,80,0.15)',
            boxShadow: '0px 20px 40px rgba(85,37,131,0.15)',
          }}
        >
          <div
            className="absolute -top-24 -right-24 w-64 h-64 blur-[80px] opacity-50 pointer-events-none"
            style={{ backgroundColor: '#552583', borderRadius: '50%' }}
          />
          <div className="relative z-10 text-center">
            <span className="material-symbols-outlined text-secondary text-5xl mb-6 block">mail</span>
            <h2 className="font-headline font-black text-4xl uppercase tracking-tighter mb-4">
              Stay in the <span className="text-secondary">Paint</span>
            </h2>
            <p className="font-body text-on-surface-variant mb-8 max-w-lg mx-auto">
              Subscribe for exclusive updates, ticket pre-sales, and behind-the-scenes access to the team.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto"
            >
              <input
                type="email"
                required
                placeholder="ENTER YOUR EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-surface-container-highest border-0 border-b-2 border-outline focus:border-secondary focus:outline-none text-on-surface font-body px-6 py-4 placeholder:text-on-surface-variant/50 transition-all duration-300"
              />
              <button
                type="submit"
                className="bg-secondary text-on-secondary px-8 py-4 font-headline font-bold uppercase tracking-wider hover:bg-secondary-container transition-all duration-500 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── 7. Social Media Slider ── */}
      <section
        className="py-14 bg-surface overflow-hidden"
        style={{ borderTop: '1px solid rgba(75,68,80,0.2)' }}
      >
        <div className="flex items-center gap-16 opacity-70 animate-slide" style={{ width: '200%' }}>
          {[...socialLinks, ...socialLinks].map((s, i) => (
            <a
              key={i}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-headline font-black text-xl tracking-widest text-on-surface-variant flex items-center gap-2 whitespace-nowrap hover:text-secondary transition-all duration-300"
            >
              <span className="material-symbols-outlined">{s.icon}</span>
              {s.label}
            </a>
          ))}
        </div>
      </section>

    </div>
  );
}

export default Home;
