import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PRODUCT_DETAIL, ALLPRODUCTS } from '../../router/Router';
import StoreNav from '../../components/Partials/StoreNav';

const AllCategories = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0); // Remonter en haut de la page
    axios.get('/api/categories')
      .then(response => setCategories(response.data))
      .catch(error => console.error("Erreur lors de la récupération des catégories :", error));

    axios.get('/api/sub-categorie')
      .then(response => setSubcategories(response.data))
      .catch(error => console.error("Erreur lors de la récupération des sous-catégories :", error));

    axios.get('/api/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error("Erreur lors de la récupération des produits :", error));
  }, []);

  const handleCategoryClick = (category) => {
    localStorage.setItem('selectedCategory', JSON.stringify(category));
    setSelectedCategory(category); // pour affichage direct
    navigate(ALLPRODUCTS); // ou retirer si on veut rester ici
  };

  const handleSubcategoryClick = (subcategory) => {
    localStorage.setItem('selectedSubcategory', JSON.stringify(subcategory));
    navigate(ALLPRODUCTS);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory ? product.category_id === selectedCategory.id : true;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* Page Header */}
      <div className="bg-surface-container-low border-b border-outline-variant px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs text-secondary uppercase tracking-widest font-semibold mb-2">Store</p>
          <h1 className="text-4xl md:text-5xl font-headline font-black uppercase tracking-tighter">Shop by Category</h1>
          <p className="text-on-surface-variant mt-2 text-sm">Explore our full collection</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="flex flex-col">
              {/* Category Card */}
              <div
                className="group relative aspect-square overflow-hidden cursor-pointer border border-outline-variant"
                onClick={() => handleCategoryClick(category)}
              >
                <img
                  src={category.image || '/images/default.jpg'}
                  alt={category.name}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition duration-300" />
                <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
                  <h2 className="text-2xl font-headline font-black uppercase tracking-tighter text-white group-hover:text-secondary transition-colors duration-300">
                    {category.name}
                  </h2>
                  <span className="mt-2 text-xs text-white/60 uppercase tracking-widest flex items-center gap-1 group-hover:text-secondary/80 transition-colors duration-300">
                    Shop Now →
                  </span>
                </div>
                {/* Hover overlay accent line */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-500" />
              </div>

              {/* Subcategories */}
              <div className="flex flex-wrap gap-2 mt-3">
                {subcategories
                  .filter((sub) => sub.category_id === category.id)
                  .map((sub) => (
                    <button
                      key={sub.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSubcategoryClick(sub);
                      }}
                      className="text-xs text-on-surface-variant hover:text-secondary border border-outline-variant hover:border-secondary px-3 py-1.5 transition-colors"
                    >
                      {sub.name}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Filtered Products (when category selected) */}
        {selectedCategory && filteredProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs text-secondary uppercase tracking-widest font-semibold mb-1">Collection</p>
                <h2 className="text-3xl font-headline font-black uppercase tracking-tighter">
                  {selectedCategory.name}
                </h2>
              </div>
              <span className="text-sm text-on-surface-variant">{filteredProducts.length} products</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(PRODUCT_DETAIL(product.id))}
                  className="group border border-outline-variant bg-surface-container-low cursor-pointer hover:border-secondary transition-colors duration-300"
                >
                  <div className="relative aspect-square overflow-hidden bg-surface-container">
                    <img
                      src={JSON.parse(product.images)[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-secondary text-on-secondary text-xs font-bold px-2 py-1 uppercase tracking-wide">
                        Sale
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-sm leading-snug mb-2">{product.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-secondary font-bold text-sm">{product.price} DH</span>
                      {product.old_price && (
                        <span className="line-through text-on-surface-variant text-xs">{product.old_price} DH</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCategories;
