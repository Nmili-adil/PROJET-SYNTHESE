import axios from 'axios';
import StoreNav from './StoreNav';
import { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { PRODUCT_DETAIL } from '../../router/Router';


const ListeProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { category_id } = useParams();  // Récupérer le nom de la catégorie dans l'URL
  const navigate = useNavigate();

  // Function to handle image URLs
  const getImageUrl = (images) => {
    if (!images) return '/images/default.jpg';
    
    try {
      // If images is a string, parse it
      let imageArray = images;
      if (typeof images === 'string') {
        imageArray = JSON.parse(images);
      }
      
      // Get the first image
      const firstImage = imageArray[0];
      if (!firstImage) return '/images/default.jpg';
      
      // If it's a full URL, return it
      if (firstImage.startsWith('http://') || firstImage.startsWith('https://')) {
        return firstImage;
      }
      
      // Otherwise, it's a local path
      return `${import.meta.env.VITE_BACKEND_URL}/storage/${firstImage}`;
    } catch (error) {
      console.error('Error processing image:', error);
      return '/images/default.jpg';
    }
  };

  const goToDetail = (id) => {
    navigate(PRODUCT_DETAIL(id));
  };

  useEffect(() => {
    axios.get('/api/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error("Erreur lors de la récupération des produits :", error));
     
  }, []);

  useEffect(() => {
    axios.get('/api/categories')
      .then(response => setCategories(response.data))
      .catch(error => console.error("Erreur lors de la récupération des catégories :", error));
  }, []);

  useEffect(() => {
    axios.get('/api/sub-categorie')
      .then(response => setSubcategories(response.data))
      .catch(error => console.error("Erreur lors de la récupération des sous-catégories :", error));
  }, []);

  // Fonction pour changer de catégorie via le menu déroulant
  const toggleCategory = (categoryId) => {
    setActiveCategoryId(activeCategoryId === categoryId ? null : categoryId);
    setSelectedCategoryId(categoryId);
    setSelectedSubcategoryId(null);
  };

  // Fonction pour changer de sous-catégorie
  const handleSubcategoryClick = (sub) => {
    if (selectedSubcategoryId === sub.id) {
      setSelectedSubcategoryId(null);
    } else {
      setSelectedSubcategoryId(sub.id);
      setSelectedCategoryId(sub.category_id);
    }
  };
console.log(category_id)
  // Filtrage des produits en fonction de la catégorie ou sous-catégorie sélectionnée


  const filteredProducts = products.filter(product => {
    // Vérification de la catégorie passée dans l'URL via useParams
    const matchesCategory = category_id
      ? product.category_name && product.category_name.toLowerCase() === category_id.toLowerCase()  // Vérification avant d'utiliser toLowerCase()
      : selectedSubcategoryId
        ? product.sousCategorie_id === selectedSubcategoryId  // Filtrer par sous-catégorie sélectionnée
        : selectedCategoryId
          ? product.category_id === selectedCategoryId  // Filtrer par catégorie sélectionnée
          : true;

    // Filtrage par terme de recherche
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-40">
      <StoreNav searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <nav className="flex space-x-8 justify-center mb-10 relative">
        {categories.map((categorie) => (
          <div key={categorie.id} className="relative">
            <p
              className={`cursor-pointer font-semibold hover:text-orange-500 ${selectedCategoryId === categorie.id ? 'text-orange-500' : ''}`}
              onClick={() => toggleCategory(categorie.id)}
            >
              {categorie.name}
            </p>

            {activeCategoryId === categorie.id && (
              <div className="absolute bg-white w-56 shadow-lg p-4 mt-2 rounded-lg z-10">
                {subcategories
                  .filter((sub) => sub.category_id === categorie.id)
                  .map((sub) => (
                    <p
                      key={sub.id}
                      className={`text-sm cursor-pointer py-1 ${selectedSubcategoryId === sub.id ? 'text-orange-500 font-medium' : 'hover:text-orange-500'}`}
                      onClick={() => handleSubcategoryClick(sub)}
                    >
                      {sub.name}
                    </p>
                  ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <h1 className="text-4xl font-bold text-center mb-8">All Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div 
              key={product.id} 
              onClick={() => goToDetail(product.id)} 
              className="relative bg-white rounded-lg shadow-md p-4 flex flex-col items-center transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">-35%</span>
              <img
                src={getImageUrl(product.images)}
                alt={product.name}
                className="w-32 h-32 object-contain mb-4"
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop
                  e.target.src = '/images/default.jpg';
                }}
              />
              <button className="bg-black text-white w-full py-2 rounded mb-3 flex items-center justify-center gap-2 hover:bg-gray-800 transition">
                🛒 Add To Cart
              </button>
              <p className="font-medium text-sm text-center">{product.name}</p>
              <div className="flex justify-center items-center gap-2 mt-1">
                <span className="text-red-600 font-semibold">{product.price} DH</span>
                {product.old_price && (
                  <span className="line-through text-gray-400 text-sm">DH{product.old_price}</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-4 text-center text-gray-500">No product found.</p>
        )}
      </div>
    </div>
  );
};

export default ListeProducts;
