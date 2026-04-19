import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useCartContext } from '../../../api/context/CartContext';
import { useClientContext } from '../../../api/context/ClientContext';
import { toast } from 'react-hot-toast';
import {
  ALLPRODUCTS,
  ALL_CATEGORIES,
  PRODUCT_DETAIL,
  LOGINSTORE,
} from '../../router/Router';

const API = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/api`;
const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const getProductImage = (product) => {
  try {
    const imgs = typeof product.images === 'string'
      ? JSON.parse(product.images)
      : (Array.isArray(product.images) ? product.images : []);
    if (imgs.length > 0) {
      const p = imgs[0];
      return p.startsWith('http') ? p : `${BACKEND}/${p}`;
    }
  } catch {}
  return null;
};

const getCategoryImage = (cat) => {
  if (!cat.image) return null;
  return cat.image.startsWith('http') ? cat.image : `${BACKEND}/${cat.image}`;
};

// ─── Hero Slides ─────────────────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    image: '/asset/lakers-1.jpg',
    eyebrow: 'New Season Drop',
    headline: ['Gear Up', 'for the'],
    accent: 'Court',
    sub: 'Official Lakers merchandise. Authentic quality, championship spirit.',
  },
  {
    image: '/asset/product1.png',
    eyebrow: 'Exclusive Collection',
    headline: ['Wear the', 'Legend'],
    accent: '#24',
    sub: 'Iconic jerseys from the most storied franchise in NBA history.',
  },
  {
    image: '/asset/lakers-2.jpg',
    eyebrow: 'Limited Edition',
    headline: ['Champions', 'Edition'],
    accent: '2025',
    sub: 'Celebrate greatness. Commemorate every championship moment.',
  },
];

// ─── Skeleton ────────────────────────────────────────────────────────────────
const ProductSkeleton = () => (
  <div className="bg-surface-container-low border border-outline-variant rounded-2xl overflow-hidden animate-pulse">
    <div className="h-60 bg-surface-container-high" />
    <div className="p-4 space-y-3">
      <div className="h-4 w-3/4 bg-surface-container-high rounded" />
      <div className="h-5 w-1/3 bg-surface-container-high rounded" />
    </div>
  </div>
);

const CatSkeleton = () => (
  <div className="h-48 bg-surface-container-low border border-outline-variant rounded-2xl animate-pulse" />
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Store() {
  const navigate = useNavigate();
  const { addToCart } = useCartContext();
  const { authenticated, client } = useClientContext();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [slide, setSlide] = useState(0);
  const [wishlist, setWishlist] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('wishlist') || '[]')); }
    catch { return new Set(); }
  });

  const slideTimer = useRef(null);

  // Auto-advance hero slides
  useEffect(() => {
    slideTimer.current = setInterval(() => {
      setSlide(s => (s + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(slideTimer.current);
  }, []);

  const goSlide = (i) => {
    clearInterval(slideTimer.current);
    setSlide(i);
    slideTimer.current = setInterval(() => {
      setSlide(s => (s + 1) % HERO_SLIDES.length);
    }, 5000);
  };

  // Fetch data
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const load = async () => {
      setLoading(true);
      try {
        const [pRes, cRes] = await Promise.all([
          axios.get(`${API}/products`),
          axios.get(`${API}/categories`),
        ]);
        setProducts(Array.isArray(pRes.data) ? pRes.data : []);
        setCategories(Array.isArray(cRes.data) ? cRes.data : []);
      } catch (e) {
        console.error('Store load error:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleWishlist = (id) => {
    setWishlist(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem('wishlist', JSON.stringify([...next]));
      return next;
    });
  };

  const handleAddToCart = async (product) => {
    if (!authenticated) {
      toast.error('Please log in to add items to cart');
      navigate(LOGINSTORE);
      return;
    }
    try {
      await addToCart(product, client?.id, 1);
      toast.success(`${product.name} added to cart`);
    } catch {
      toast.error('Could not add to cart');
    }
  };

  const featuredProducts = products.slice(0, 8);
  const displayedCategories = categories.slice(0, 6);
  const currentSlide = HERO_SLIDES[slide];

  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden">

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative h-[92vh] min-h-[560px] overflow-hidden">
        {/* Background images crossfade */}
        <AnimatePresence initial={false}>
          <motion.div
            key={slide}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${currentSlide.image}')` }}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/70 to-surface/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface/60 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 md:px-10 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.55 }}
                className="max-w-xl"
              >
                <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/30 text-secondary text-xs font-headline font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse inline-block" />
                  {currentSlide.eyebrow}
                </div>
                <h1 className="font-headline font-black text-6xl md:text-8xl uppercase tracking-tighter text-on-surface leading-none mb-3">
                  {currentSlide.headline[0]}<br />
                  {currentSlide.headline[1]}{' '}
                  <span className="text-secondary">{currentSlide.accent}</span>
                </h1>
                <p className="font-body text-on-surface-variant text-lg max-w-sm leading-relaxed mb-8">
                  {currentSlide.sub}
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate(ALLPRODUCTS)}
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-secondary text-on-secondary font-headline font-black text-sm uppercase tracking-wider rounded-full hover:opacity-90 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-lg">shopping_bag</span>
                    Shop Now
                  </button>
                  <button
                    onClick={() => navigate(ALL_CATEGORIES)}
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-surface/80 border border-outline-variant text-on-surface font-headline font-bold text-sm uppercase tracking-wider rounded-full hover:bg-surface-container transition-colors backdrop-blur-sm"
                  >
                    Browse Categories
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-6 md:left-10 z-10 flex items-center gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goSlide(i)}
              className={`rounded-full transition-all duration-300 ${
                i === slide
                  ? 'w-8 h-2.5 bg-secondary'
                  : 'w-2.5 h-2.5 bg-on-surface-variant/40 hover:bg-on-surface-variant/70'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-6 md:right-10 z-10 flex flex-col items-center gap-1.5 text-on-surface-variant/60">
          <span className="font-body text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-10 bg-on-surface-variant/30 relative overflow-hidden">
            <motion.div
              className="w-full bg-secondary"
              animate={{ height: ['0%', '100%'], y: ['-100%', '100%'] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </section>

      {/* ── Stats strip ────────────────────────────────────────────────── */}
      <section className="bg-surface-container-lowest border-y border-outline-variant py-5">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-6">
            {[
              { icon: 'checkroom', value: '50+', label: 'Jerseys' },
              { icon: 'group', value: '100+', label: 'Customers' },
              { icon: 'sports_basketball', value: '25+', label: 'Accessories' },
              { icon: 'local_shipping', value: 'Free', label: 'Shipping $80+' },
              { icon: 'replay', value: '30-Day', label: 'Returns' },
            ].map(({ icon, value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-2xl">{icon}</span>
                <div>
                  <p className="font-headline font-black text-lg text-on-surface leading-none">{value}</p>
                  <p className="font-body text-xs text-on-surface-variant uppercase tracking-wider">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ─────────────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-body text-xs uppercase tracking-widest text-secondary font-semibold mb-1">Collections</p>
            <h2 className="font-headline font-black text-4xl md:text-5xl uppercase tracking-tighter text-on-surface">
              Shop by <span className="text-secondary">Category</span>
            </h2>
          </div>
          <button
            onClick={() => navigate(ALL_CATEGORIES)}
            className="hidden md:flex items-center gap-1 text-on-surface-variant hover:text-secondary text-sm font-headline font-bold uppercase tracking-wider transition-colors"
          >
            All Categories
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <CatSkeleton key={i} />)}
          </div>
        ) : displayedCategories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {displayedCategories.map((cat, i) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                onClick={() => {
                  localStorage.setItem('selectedCategory', JSON.stringify(cat));
                  navigate(ALLPRODUCTS);
                }}
                className="group relative h-48 rounded-2xl overflow-hidden border border-outline-variant hover:border-secondary/50 transition-colors text-left"
              >
                {getCategoryImage(cat) ? (
                  <img
                    src={getCategoryImage(cat)}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">category</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-surface/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="font-headline font-black text-sm text-on-surface uppercase tracking-tight leading-tight">
                    {cat.name}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="h-48 bg-surface-container-low border border-dashed border-outline-variant rounded-2xl flex items-center justify-center">
            <p className="text-on-surface-variant font-body text-sm">No categories available</p>
          </div>
        )}

        <div className="mt-6 flex md:hidden justify-center">
          <button
            onClick={() => navigate(ALL_CATEGORIES)}
            className="flex items-center gap-1 text-secondary text-sm font-headline font-bold uppercase tracking-wider"
          >
            View all categories
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
      </section>

      {/* ── Featured Products ───────────────────────────────────────────── */}
      <section className="py-20 bg-surface-container-lowest border-t border-outline-variant">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="font-body text-xs uppercase tracking-widest text-secondary font-semibold mb-1">Collection</p>
              <h2 className="font-headline font-black text-4xl md:text-5xl uppercase tracking-tighter text-on-surface">
                Featured <span className="text-secondary">Products</span>
              </h2>
            </div>
            <button
              onClick={() => navigate(ALLPRODUCTS)}
              className="hidden md:flex items-center gap-1 text-on-surface-variant hover:text-secondary text-sm font-headline font-bold uppercase tracking-wider transition-colors"
            >
              View All
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {featuredProducts.map((product, i) => {
                const img = getProductImage(product);
                const inWish = wishlist.has(product.id);
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="group bg-surface-container-low border border-outline-variant rounded-2xl overflow-hidden hover:border-secondary/40 transition-colors flex flex-col"
                  >
                    {/* Image */}
                    <div
                      className="relative h-60 overflow-hidden cursor-pointer"
                      onClick={() => navigate(PRODUCT_DETAIL(product.id))}
                    >
                      {img ? (
                        <img
                          src={img}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                          <span className="material-symbols-outlined text-5xl text-on-surface-variant/30">checkroom</span>
                        </div>
                      )}
                      {/* Wishlist */}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-surface/80 backdrop-blur-sm border border-outline-variant flex items-center justify-center hover:border-secondary/50 transition-colors"
                        aria-label="Wishlist"
                      >
                        <span className={`material-symbols-outlined text-lg ${inWish ? 'text-secondary' : 'text-on-surface-variant'}`}>
                          {inWish ? 'favorite' : 'favorite_border'}
                        </span>
                      </button>
                      {/* New badge */}
                      {i < 3 && (
                        <div className="absolute top-3 left-3 bg-secondary text-on-secondary text-xs font-headline font-black uppercase tracking-wide px-2.5 py-1 rounded-full">
                          New
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4 flex flex-col flex-1">
                      <h3
                        className="font-body font-semibold text-sm text-on-surface leading-snug mb-1 line-clamp-2 cursor-pointer group-hover:text-secondary transition-colors"
                        onClick={() => navigate(PRODUCT_DETAIL(product.id))}
                      >
                        {product.name}
                      </h3>
                      <p className="font-headline font-black text-lg text-secondary mt-auto mb-3">
                        ${parseFloat(product.price || 0).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary-container text-primary text-xs font-headline font-black uppercase tracking-wider rounded-xl hover:bg-secondary hover:text-on-secondary transition-colors"
                      >
                        <span className="material-symbols-outlined text-base">add_shopping_cart</span>
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="h-60 bg-surface-container-low border border-dashed border-outline-variant rounded-2xl flex items-center justify-center">
              <p className="text-on-surface-variant font-body text-sm">No products available</p>
            </div>
          )}

          <div className="mt-10 flex md:hidden justify-center">
            <button
              onClick={() => navigate(ALLPRODUCTS)}
              className="flex items-center gap-1 text-secondary text-sm font-headline font-bold uppercase tracking-wider"
            >
              View all products
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Promo Banner ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 bg-primary-container">
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, var(--kc-on-surface) 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, var(--kc-on-surface) 0px, transparent 1px, transparent 40px)',
          }}
        />
        {/* Accent blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-10 text-center">
          <div className="inline-flex items-center gap-2 bg-secondary/15 border border-secondary/30 text-secondary text-xs font-headline font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
            <span className="material-symbols-outlined text-sm">local_offer</span>
            Limited Time Offer
          </div>
          <h2 className="font-headline font-black text-6xl md:text-8xl uppercase tracking-tighter text-on-surface mb-4">
            50% <span className="text-secondary">Off</span>
          </h2>
          <p className="font-body text-on-surface-variant text-lg max-w-lg mx-auto leading-relaxed mb-8">
            Exclusive savings on premium Lakers gear. Use code{' '}
            <span className="font-headline font-black text-secondary tracking-wider">KINETIC50</span>{' '}
            at checkout. Min. purchase $80.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => navigate(ALLPRODUCTS)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-on-secondary font-headline font-black text-sm uppercase tracking-wider rounded-full hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-lg">shopping_bag</span>
              Shop the Sale
            </button>
            <button
              onClick={() => navigate(ALL_CATEGORIES)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-surface/80 border border-outline-variant text-on-surface font-headline font-bold text-sm uppercase tracking-wider rounded-full hover:bg-surface transition-colors"
            >
              Browse All
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Why shop here ──────────────────────────────────────────────── */}
      <section className="py-20 border-t border-outline-variant">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <h2 className="font-headline font-black text-3xl uppercase tracking-tighter text-on-surface text-center mb-12">
            The <span className="text-secondary">Kinetic Court</span> Difference
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'verified', title: 'Authentic Gear', desc: 'Every item is officially licensed and 100% authentic.' },
              { icon: 'local_shipping', title: 'Fast Delivery', desc: 'Free shipping on orders over $80. Ships in 1–3 days.' },
              { icon: 'replay', title: 'Easy Returns', desc: '30-day hassle-free return policy, no questions asked.' },
              { icon: 'support_agent', title: '24/7 Support', desc: 'Our team is always here to help you find the right gear.' },
            ].map(({ icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 text-center hover:border-secondary/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-2xl text-secondary">{icon}</span>
                </div>
                <h3 className="font-headline font-black text-base uppercase tracking-tight text-on-surface mb-2">{title}</h3>
                <p className="font-body text-on-surface-variant text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
