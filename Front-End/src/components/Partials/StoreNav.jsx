import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Search, Loader2, ShoppingCart, Heart } from "lucide-react";
import { CART, PRODUCT_DETAIL, STORE, WISHLIST } from "../../router/paths";
import { DropDownLogin } from "./DropDownLogin";
import { useClientContext } from "../../../api/context/ClientContext";
import { HoverCardClient } from "../ui/hoverCardClient";
import { useCartContext } from "../../../api/context/CartContext";
import Product from "../../../service/Product";
import { useSearchParams } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";

const StoreNav = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { authenticated, client } = useClientContext();
  const { cartCount, fetchCart } = useCartContext();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const [wishlistCount, setWishlistCount] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wishlist') || '[]').length; } catch { return 0; }
  });

  useEffect(() => {
    const syncWishlist = () => {
      try { setWishlistCount(JSON.parse(localStorage.getItem('wishlist') || '[]').length); } catch {}
    };
    window.addEventListener('storage', syncWishlist);
    window.addEventListener('wishlist-updated', syncWishlist);
    return () => {
      window.removeEventListener('storage', syncWishlist);
      window.removeEventListener('wishlist-updated', syncWishlist);
    };
  }, []);

  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCart();
    };

    window.addEventListener('cart-updated', handleCartUpdate);

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [fetchCart]);

  useEffect(() => {
    const searchProducts = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await Product.getAll();
        if (response.data) {
          const filteredProducts = response.data.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase())
          ).slice(0, 5);
          setSearchResults(filteredProducts);
        }
      } catch (error) {
        console.error('Error searching products:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setShowResults(false);
    setSearchParams({ search: searchTerm });
    navigate(`/store?search=${encodeURIComponent(searchTerm)}`);
  };

  const handleProductClick = (product) => {
    setShowResults(false);
    navigate(PRODUCT_DETAIL(product.id));
  };

  return (
    <nav className="h-16 w-screen flex items-center fixed top-0 left-0 z-50 bg-[#151317]/95 backdrop-blur-xl border-b border-outline-variant">
      {/* Logo */}
      <button onClick={() => navigate(STORE)} className="flex items-center gap-2 pl-8 pr-6 flex-shrink-0">
        <img src="/logo.png" alt="logo" className="w-9 h-9 object-cover" />
        <span className="font-headline font-black text-secondary uppercase tracking-tighter text-lg hidden sm:block">Kinetic Court</span>
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div ref={searchRef} className="relative hidden md:block w-64 lg:w-80 mr-4">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-4 pr-10 py-2 bg-surface-container border border-outline-variant text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-secondary transition-colors"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setShowResults(true); }}
            onFocus={() => setShowResults(true)}
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-secondary transition-colors">
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </button>
        </form>

        {/* Search Results */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-surface-container-high border border-outline-variant max-h-80 overflow-y-auto z-50 shadow-xl">
            {searchResults.map((product) => (
              <button
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="w-full flex items-center gap-3 p-3 hover:bg-surface-container-highest text-left border-b border-outline-variant last:border-0 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-xs font-medium text-on-surface">{product.name}</p>
                  <p className="text-xs text-secondary">${product.price}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Wishlist */}
      <button
        onClick={() => navigate(WISHLIST)}
        className="relative p-2.5 mx-1 text-on-surface-variant hover:text-secondary transition-colors"
        title="Wishlist"
      >
        <Heart className="w-5 h-5" />
        {wishlistCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-primary-container text-primary rounded-full text-[10px] flex items-center justify-center font-bold">
            {wishlistCount}
          </span>
        )}
      </button>

      {/* Cart */}
      <button
        onClick={() => navigate(CART)}
        className="relative p-2.5 mx-1 text-on-surface-variant hover:text-secondary transition-colors"
      >
        <ShoppingCart className="w-5 h-5" />
        {cartCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-secondary text-on-secondary rounded-full text-[10px] flex items-center justify-center font-bold">
            {cartCount}
          </span>
        )}
      </button>

      {/* Theme toggle */}
      <ThemeToggle />

      {/* Auth */}
      <div className="pr-6">
        {authenticated ? <HoverCardClient /> : <DropDownLogin />}
      </div>
    </nav>
  );
};

export default StoreNav;