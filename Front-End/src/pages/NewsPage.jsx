import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NewsService } from '../../service/NewsService';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${BACKEND_URL}/${path}`;
};

const getArticleImage = (article) => {
  try {
    const images = typeof article.images === 'string'
      ? JSON.parse(article.images)
      : (Array.isArray(article.images) ? article.images : []);
    if (images.length > 0) return getImageUrl(images[0]);
  } catch {}
  return null;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getReadTime = (content) => {
  if (!content) return '2 min read';
  return `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} min read`;
};

const truncate = (text, len = 130) => {
  if (!text) return '';
  return text.length > len ? text.slice(0, len).trimEnd() + '…' : text;
};

const getYouTubeEmbed = (url) => {
  if (!url) return null;
  const match = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
};

const getAuthorName = (article) =>
  article.created_by?.name || article.created_by?.username || null;

// ─── Skeleton components ─────────────────────────────────────────────────────
const ArticleSkeleton = () => (
  <div className="bg-surface-container-low border border-outline-variant rounded-2xl overflow-hidden animate-pulse">
    <div className="h-52 bg-surface-container-high" />
    <div className="p-5 space-y-3">
      <div className="h-3 w-28 bg-surface-container-high rounded" />
      <div className="h-5 w-full bg-surface-container-high rounded" />
      <div className="h-4 w-5/6 bg-surface-container-high rounded" />
    </div>
  </div>
);

const FeaturedSkeleton = () => (
  <div className="grid lg:grid-cols-2 gap-0 bg-surface-container-low border border-outline-variant rounded-2xl overflow-hidden animate-pulse">
    <div className="h-80 lg:h-[420px] bg-surface-container-high" />
    <div className="p-8 space-y-4">
      <div className="h-4 w-24 bg-surface-container-high rounded-full" />
      <div className="h-8 w-full bg-surface-container-high rounded" />
      <div className="h-8 w-4/5 bg-surface-container-high rounded" />
      <div className="h-4 w-full bg-surface-container-high rounded" />
      <div className="h-4 w-5/6 bg-surface-container-high rounded" />
      <div className="h-4 w-2/3 bg-surface-container-high rounded" />
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const NBANewsHub = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await NewsService.getAllArticles();
      setArticles(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('Could not load articles. Please try again later.');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = articles.filter(a =>
    !search ||
    a.title?.toLowerCase().includes(search.toLowerCase()) ||
    a.content?.toLowerCase().includes(search.toLowerCase())
  );

  const featured = filtered[0] || null;
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen w-full bg-surface text-on-surface overflow-x-hidden">

      {/* ── Hero Banner ───────────────────────────────────────────────── */}
      <section className="relative h-[58vh] min-h-[380px] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: "url('/asset/news-bg.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/55 to-surface/10" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 pb-14">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/30 text-secondary text-xs font-headline font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse inline-block" />
              Live Coverage
            </div>
            <h1 className="font-headline font-black text-5xl md:text-7xl uppercase tracking-tighter text-on-surface mb-3">
              Kinetic <span className="text-secondary">News</span>
            </h1>
            <p className="font-body text-on-surface-variant text-lg max-w-xl leading-relaxed">
              Breaking news, analysis &amp; exclusive coverage of the Lakers and the NBA.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Search bar ────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-surface/90 backdrop-blur-md border-b border-outline-variant">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl select-none">search</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search articles…"
              className="w-full bg-surface-container border border-outline-variant rounded-xl pl-10 pr-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-secondary transition-colors font-body"
            />
          </div>
          {search && (
            <button onClick={() => setSearch('')} className="text-on-surface-variant hover:text-on-surface transition-colors" aria-label="Clear search">
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          )}
          <span className="text-on-surface-variant text-sm font-body ml-auto tabular-nums">
            {loading ? '…' : `${filtered.length} article${filtered.length !== 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-14 space-y-16">

        {/* Error state */}
        {error && !loading && (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/50">wifi_off</span>
            <p className="font-headline font-black text-xl text-on-surface">Connection Error</p>
            <p className="font-body text-on-surface-variant text-sm max-w-xs">{error}</p>
            <button
              onClick={fetchArticles}
              className="mt-2 px-6 py-2.5 bg-secondary text-on-secondary text-sm font-headline font-bold rounded-full uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Featured Story ─────────────────────────────────────────── */}
        {!error && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline font-black text-2xl uppercase tracking-tighter text-on-surface">
                Featured <span className="text-secondary">Story</span>
              </h2>
            </div>

            {loading ? (
              <FeaturedSkeleton />
            ) : featured ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="group grid lg:grid-cols-2 gap-0 bg-surface-container-low border border-outline-variant rounded-2xl overflow-hidden hover:border-secondary/40 transition-colors cursor-pointer"
                onClick={() => setExpandedId(expandedId === featured.id ? null : featured.id)}
              >
                {/* Image */}
                <div className="relative h-72 lg:h-auto overflow-hidden">
                  {getArticleImage(featured) ? (
                    <img
                      src={getArticleImage(featured)}
                      alt={featured.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-surface-container-high flex items-center justify-center min-h-[280px]">
                      <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">newspaper</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-secondary text-on-secondary text-xs font-headline font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                      Featured
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-on-surface-variant text-sm font-body mb-4">
                    <span className="material-symbols-outlined text-base">calendar_today</span>
                    <span>{formatDate(featured.date || featured.created_at)}</span>
                    <span className="w-1 h-1 rounded-full bg-on-surface-variant/40 inline-block" />
                    <span>{getReadTime(featured.content)}</span>
                  </div>
                  <h3 className="font-headline font-black text-3xl md:text-4xl text-on-surface leading-tight mb-4 group-hover:text-secondary transition-colors">
                    {featured.title}
                  </h3>
                  <p className="font-body text-on-surface-variant text-base leading-relaxed mb-6">
                    {expandedId === featured.id ? featured.content : truncate(featured.content, 200)}
                  </p>
                  {featured.video_url && expandedId === featured.id && (
                    <div className="mb-6 aspect-video rounded-xl overflow-hidden">
                      <iframe
                        src={getYouTubeEmbed(featured.video_url)}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={featured.title}
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-auto">
                    {getAuthorName(featured) && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
                          <span className="text-primary text-sm font-headline font-black">
                            {getAuthorName(featured)[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-on-surface text-sm font-body font-semibold leading-tight">{getAuthorName(featured)}</p>
                          <p className="text-on-surface-variant text-xs font-body">Staff Writer</p>
                        </div>
                      </div>
                    )}
                    <button className="flex items-center gap-1 text-secondary text-sm font-headline font-bold uppercase tracking-wider ml-auto hover:gap-2 transition-all">
                      {expandedId === featured.id ? 'Collapse' : 'Read more'}
                      <span className="material-symbols-outlined text-sm">
                        {expandedId === featured.id ? 'expand_less' : 'arrow_forward'}
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-64 bg-surface-container-low border border-dashed border-outline-variant rounded-2xl flex flex-col items-center justify-center gap-3 text-center px-6">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">newspaper</span>
                <p className="font-headline font-black text-xl text-on-surface">No Articles Yet</p>
                <p className="font-body text-on-surface-variant text-sm max-w-xs">
                  The news team is crafting the first stories. Check back soon!
                </p>
              </div>
            )}
          </section>
        )}

        {/* ── Latest Coverage grid ───────────────────────────────────── */}
        {!error && !loading && rest.length > 0 && (
          <section>
            <h2 className="font-headline font-black text-2xl uppercase tracking-tighter text-on-surface mb-6">
              Latest <span className="text-secondary">Coverage</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((article, i) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="group bg-surface-container-low border border-outline-variant rounded-2xl overflow-hidden hover:border-secondary/40 transition-colors flex flex-col cursor-pointer"
                  onClick={() => setExpandedId(expandedId === article.id ? null : article.id)}
                >
                  {/* Thumbnail */}
                  <div className="relative h-52 overflow-hidden flex-shrink-0">
                    {getArticleImage(article) ? (
                      <img
                        src={getArticleImage(article)}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">image</span>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-on-surface-variant text-xs font-body mb-3">
                      <span>{formatDate(article.date || article.created_at)}</span>
                      <span className="w-1 h-1 rounded-full bg-on-surface-variant/40 inline-block" />
                      <span>{getReadTime(article.content)}</span>
                    </div>
                    <h3 className="font-headline font-black text-lg text-on-surface leading-snug mb-2 group-hover:text-secondary transition-colors">
                      {article.title}
                    </h3>
                    <p className="font-body text-on-surface-variant text-sm leading-relaxed flex-1">
                      {expandedId === article.id ? article.content : truncate(article.content, 110)}
                    </p>

                    {/* Video embed on expand */}
                    {expandedId === article.id && article.video_url && (
                      <div className="mt-4 aspect-video rounded-xl overflow-hidden">
                        <iframe
                          src={getYouTubeEmbed(article.video_url)}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={article.title}
                        />
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-outline-variant/50">
                      {getAuthorName(article) && (
                        <span className="font-body text-xs text-on-surface-variant truncate max-w-[120px]">
                          {getAuthorName(article)}
                        </span>
                      )}
                      <button className="flex items-center gap-1 text-secondary text-xs font-headline font-bold uppercase tracking-wider ml-auto hover:gap-2 transition-all">
                        {expandedId === article.id ? 'Collapse' : 'Read more'}
                        <span className="material-symbols-outlined text-sm">
                          {expandedId === article.id ? 'expand_less' : 'arrow_forward'}
                        </span>
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        )}

        {/* Loading skeletons for grid */}
        {loading && !error && (
          <section>
            <div className="h-6 w-44 bg-surface-container-high rounded animate-pulse mb-6" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => <ArticleSkeleton key={i} />)}
            </div>
          </section>
        )}

        {/* Empty search result */}
        {!loading && !error && search && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">search_off</span>
            <p className="font-headline font-black text-xl text-on-surface">No Results</p>
            <p className="font-body text-on-surface-variant text-sm">No articles match &ldquo;{search}&rdquo;</p>
            <button onClick={() => setSearch('')} className="mt-2 text-secondary text-sm font-body hover:underline">
              Clear search
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default NBANewsHub;
