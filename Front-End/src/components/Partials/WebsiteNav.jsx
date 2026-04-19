import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Product from '../../../service/Product';
import { HOME, ABOUT, NEWS, STORE, CART, LOGINSTORE, PRODUCT_DETAIL } from '../../router/Router';
import ThemeToggle from '../ThemeToggle';

const WebsiteNav = () => {
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);

  const navLinks = [
    { name: 'TEAM', path: ABOUT },
    { name: 'SCHEDULE', path: HOME },
    { name: 'SHOP', path: STORE },
    { name: 'NEWS', path: NEWS },
  ];
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (showSearch) fetchProducts();
  }, [showSearch]);

  useEffect(() => {
    if (searchTerm.trim() === '') { setFilteredProducts([]); return; }
    setFilteredProducts(
      products.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await Product.getAll();
      setProducts(response.data);
    } catch (e) {
      console.error('Error fetching products:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = () => {
    setShowSearch(false);
    setSearchTerm('');
    setFilteredProducts([]);
  };

  const isActive = (path) =>
    path === HOME ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <header className="bg-surface/80 backdrop-blur-xl shadow-[0px_20px_40px_rgba(85,37,131,0.15)] fixed top-0 w-full z-50 border-b border-outline-variant/50">
      <div className="flex justify-between items-center w-full px-6 md:px-8 py-4 max-w-[1920px] mx-auto">

        {/* Logo + Desktop Nav */}
        <div className="flex items-center gap-8 md:gap-12">
          <Link to={HOME} className="text-xl md:text-2xl italic font-black text-on-surface font-headline tracking-tight">
            KINETIC COURT
          </Link>
          <nav className="hidden md:flex gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-headline font-black uppercase tracking-tighter text-sm transition-all duration-300 pb-1 ${
                  isActive(link.path)
                    ? 'text-secondary border-b-2 border-secondary'
                    : 'text-on-surface/60 hover:text-on-surface hover:bg-primary-container/20 px-1'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 md:gap-4 relative">
          {/* Search toggle */}
          <div className="relative">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="text-secondary hover:bg-primary-container/20 transition-all duration-300 p-2"
              aria-label="Search"
            >
              <span className="material-symbols-outlined text-xl">search</span>
            </button>
            {showSearch && (
              <div className="absolute top-full right-0 mt-2 w-72 z-50">
                <input
                  type="text"
                  placeholder="SEARCH PRODUCTS..."
                  className="w-full bg-surface-container-highest border-0 border-b-2 border-outline focus:border-secondary focus:outline-none text-on-surface font-body px-4 py-3 placeholder:text-on-surface-variant/50 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
                {filteredProducts.length > 0 && (
                  <div className="bg-surface-container-high shadow-lg max-h-60 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                    {filteredProducts.map((product) => (
                      <Link
                        key={product.id}
                        to={PRODUCT_DETAIL(product.id)}
                        onClick={handleProductClick}
                        className="flex items-center gap-3 p-3 hover:bg-surface-container-highest transition-colors duration-200"
                      >
                        {product.image && (
                          <img src={product.image} alt={product.name} className="w-10 h-10 object-cover" />
                        )}
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-on-surface">{product.name}</span>
                          <span className="text-xs text-secondary">${product.price}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                {isLoading && (
                  <div className="bg-surface-container-high p-2 text-center text-on-surface-variant text-sm">
                    Loading...
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to={CART} className="text-secondary hover:bg-primary-container/20 transition-all duration-300 p-2" aria-label="Cart">
            <span className="material-symbols-outlined text-xl">shopping_cart</span>
          </Link>

          {/* Account */}
          <Link to={LOGINSTORE} className="text-secondary hover:bg-primary-container/20 transition-all duration-300 p-2" aria-label="Account">
            <span className="material-symbols-outlined text-xl">account_circle</span>
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-secondary hover:bg-primary-container/20 transition-all duration-300 p-2 ml-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span className="material-symbols-outlined text-xl">{mobileOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-surface/95 backdrop-blur-xl border-t border-outline-variant px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`font-headline font-black uppercase tracking-tighter text-sm py-2 ${
                isActive(link.path) ? 'text-secondary' : 'text-on-surface/70'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default WebsiteNav;
