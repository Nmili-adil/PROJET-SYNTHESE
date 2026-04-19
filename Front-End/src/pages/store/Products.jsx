import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Grid, List, Heart, Star, ShoppingCart, SlidersHorizontal } from 'lucide-react';
import axios from 'axios';
import { PRODUCT_DETAIL, LOGINSTORE } from '../../router/Router';
import { useCartContext } from '../../../api/context/CartContext';
import { useClientContext } from '../../../api/context/ClientContext';
import { toast } from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [filterOpen, setFilterOpen] = useState(false);
  const [wishlist, setWishlist] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('wishlist') || '[]')); }
    catch { return new Set(); }
  });

  const navigate = useNavigate();
  const { authenticated, client } = useClientContext();
  const { addToCart } = useCartContext();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [productsRes, categoriesRes, subCategoriesRes] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/categories'),
          axios.get('/api/sub-categorie'),
        ]);
        setProducts(productsRes.data || []);
        setCategories(categoriesRes.data || []);
        setSubcategories(subCategoriesRes.data || []);
      } catch (err) {
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    const storedCategory = localStorage.getItem('selectedCategory');
    if (storedCategory) {
      try { setSelectedCategory(JSON.parse(storedCategory)); } catch {}
      localStorage.removeItem('selectedCategory');
    }
    const storedSubcategory = localStorage.getItem('selectedSubcategory');
    if (storedSubcategory) {
      try { setSelectedSubcategory(JSON.parse(storedSubcategory)); } catch {}
      localStorage.removeItem('selectedSubcategory');
    }
  }, []);

  const getImageUrl = (images) => {
    try { return JSON.parse(images)[0]; } catch { return images || ''; }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(selectedCategory?.id === category.id ? null : category);
    setSelectedSubcategory(null);
  };

  const handleSubcategoryClick = (sub) => {
    setSelectedSubcategory(selectedSubcategory?.id === sub.id ? null : sub);
  };

  const toggleWishlist = (productId, e) => {
    e.stopPropagation();
    const updated = new Set(wishlist);
    if (updated.has(productId)) { updated.delete(productId); }
    else { updated.add(productId); }
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify([...updated]));
    window.dispatchEvent(new Event('wishlist-updated'));
  };

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    if (!authenticated) { navigate(LOGINSTORE); return; }
    try {
      await addToCart({ clientId: client.id, productId: product.id, quantity: 1, color: 'default', size: 'M' });
      toast.success(`${product.name} added to bag!`);
    } catch {
      toast.error('Could not add to cart');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchCategory = selectedCategory ? p.category_id === selectedCategory.id : true;
    const matchSub = selectedSubcategory ? p.sousCategorie_id === selectedSubcategory.id : true;
    const matchSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSub && matchSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return Number(a.price) - Number(b.price);
      case 'price-high': return Number(b.price) - Number(a.price);
      case 'rating': return (b.rating || 0) - (a.rating || 0);
      case 'newest': return b.id - a.id;
      default: return (a.name || '').localeCompare(b.name || '');
    }
  });




  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* Page Header */}
      <div className="bg-surface-container-low border-b border-outline-variant px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs text-secondary uppercase tracking-widest font-semibold mb-2">Collection</p>
          <h1 className="text-4xl md:text-5xl font-headline font-black uppercase tracking-tighter">
            {selectedCategory ? selectedCategory.name : 'All Products'}
          </h1>
          <p className="text-on-surface-variant mt-2 text-sm">{sortedProducts.length} products found</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-surface-container border border-outline-variant text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-secondary transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-surface-container border border-outline-variant text-sm text-on-surface px-3 py-2.5 focus:outline-none focus:border-secondary transition-colors"
            >
              <option value="name">Sort: Name</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="newest">Newest First</option>
            </select>

            {/* View toggle */}
            <div className="flex border border-outline-variant overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-secondary text-on-secondary' : 'text-on-surface-variant hover:bg-surface-container'}`}
              ><Grid size={16} /></button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-secondary text-on-secondary' : 'text-on-surface-variant hover:bg-surface-container'}`}
              ><List size={16} /></button>
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm border transition-colors ${filterOpen ? 'border-secondary text-secondary bg-secondary/10' : 'border-outline-variant text-on-surface-variant hover:border-secondary hover:text-secondary'}`}
            >
              <SlidersHorizontal size={15} /> Filters
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filter Sidebar */}
          {filterOpen && (
            <aside className="w-56 flex-shrink-0">
              <div className="border border-outline-variant bg-surface-container-low">
                <div className="px-4 py-3 border-b border-outline-variant">
                  <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Categories</h3>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => { setSelectedCategory(null); setSelectedSubcategory(null); }}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${!selectedCategory ? 'text-secondary font-semibold' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`}
                  >
                    All Products
                  </button>
                  {categories.map((cat) => (
                    <div key={cat.id}>
                      <button
                        onClick={() => handleCategoryClick(cat)}
                        className={`w-full text-left px-3 py-2 text-sm transition-colors ${selectedCategory?.id === cat.id ? 'text-secondary font-semibold' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`}
                      >
                        {cat.name}
                      </button>
                      {selectedCategory?.id === cat.id && (
                        <div className="pl-4 border-l border-outline-variant ml-3 mb-1">
                          {subcategories.filter((s) => s.category_id === cat.id).map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => handleSubcategoryClick(sub)}
                              className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${selectedSubcategory?.id === sub.id ? 'text-secondary' : 'text-on-surface-variant hover:text-on-surface'}`}
                            >
                              {sub.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {(selectedCategory || selectedSubcategory) && (
                <button
                  onClick={() => { setSelectedCategory(null); setSelectedSubcategory(null); }}
                  className="mt-2 w-full text-xs text-on-surface-variant hover:text-secondary transition-colors py-2 border border-outline-variant"
                >
                  Clear filters ×
                </button>
              )}
            </aside>
          )}

          {/* Products */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="border border-outline-variant bg-surface-container-low animate-pulse">
                    <div className="aspect-square bg-surface-container" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-surface-container w-3/4" />
                      <div className="h-3 bg-surface-container w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="py-24 text-center">
                <Search size={40} className="mx-auto text-on-surface-variant mb-4" strokeWidth={1} />
                <p className="text-on-surface-variant font-medium">No products found</p>
                {searchTerm && <p className="text-on-surface-variant text-sm mt-1">Try a different search term</p>}
              </div>
            ) : (
              <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
                {sortedProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigate(PRODUCT_DETAIL(product.id))}
                    className={`group border border-outline-variant bg-surface-container-low hover:border-secondary transition-all duration-300 cursor-pointer ${viewMode === 'list' ? 'flex gap-4 p-4' : ''}`}
                  >
                    {/* Image */}
                    <div className={`relative overflow-hidden bg-surface-container ${viewMode === 'grid' ? 'aspect-square' : 'w-32 h-32 flex-shrink-0'}`}>
                      <img
                        src={getImageUrl(product.images)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.old_price && (
                          <span className="bg-secondary text-on-secondary text-xs font-bold px-2 py-0.5 uppercase tracking-wide">
                            Sale
                          </span>
                        )}
                      </div>
                      {/* Hover actions */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          className="flex items-center gap-1.5 bg-secondary text-on-secondary px-4 py-2 text-xs font-bold uppercase tracking-wide hover:bg-secondary-container transition-colors"
                        >
                          <ShoppingCart size={12} /> Add to Bag
                        </button>
                      </div>
                      {/* Wishlist */}
                      <button
                        onClick={(e) => toggleWishlist(product.id, e)}
                        className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-surface-container-high opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-surface-container-highest"
                      >
                        <Heart
                          size={14}
                          className={wishlist.has(product.id) ? 'fill-red-400 text-red-400' : 'text-on-surface-variant'}
                        />
                      </button>
                    </div>

                    {/* Info */}
                    <div className={`p-3 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-center' : ''}`}>
                      {product.rating && (
                        <div className="flex items-center gap-0.5 mb-1.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={10} className={i < Math.floor(product.rating) ? 'fill-secondary text-secondary' : 'text-outline-variant'} />
                          ))}
                        </div>
                      )}
                      <p className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-secondary transition-colors">{product.name}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-secondary font-bold text-sm">${Number(product.price).toFixed(2)}</span>
                        {product.old_price && (
                          <span className="line-through text-on-surface-variant text-xs">${Number(product.old_price).toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;