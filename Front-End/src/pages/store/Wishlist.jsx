import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import Product from "../../../service/Product";
import { ALLPRODUCTS, LOGINSTORE, PRODUCT_DETAIL } from "../../router/paths";
import { useClientContext } from "../../../api/context/ClientContext";
import { useCartContext } from "../../../api/context/CartContext";

const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return import.meta.env.VITE_BACKEND_URL + "/" + path;
};

const Wishlist = () => {
  const navigate = useNavigate();
  const { authenticated } = useClientContext();
  const { addToCart } = useCartContext();

  const [wishlistIds, setWishlistIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("wishlist") || "[]")); }
    catch { return new Set(); }
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    const fetchWishlisted = async () => {
      if (wishlistIds.size === 0) { setLoading(false); return; }
      try {
        const res = await Product.getAll();
        const all = res.data?.data ?? res.data ?? [];
        setProducts(all.filter((p) => wishlistIds.has(p.id)));
      } catch {
        toast.error("Failed to load wishlist products.");
      } finally {
        setLoading(false);
      }
    };
    fetchWishlisted();
  }, []);

  const removeFromWishlist = (id) => {
    const updated = new Set(wishlistIds);
    updated.delete(id);
    setWishlistIds(updated);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    localStorage.setItem("wishlist", JSON.stringify([...updated]));
    window.dispatchEvent(new Event("wishlist-updated"));
    toast.success("Removed from wishlist");
  };

  const handleAddToCart = async (product) => {
    if (!authenticated) { navigate(LOGINSTORE); return; }
    setAddingId(product.id);
    try {
      const images = JSON.parse(product.images || "[]");
      await addToCart({
        product_id: product.id,
        name: product.name,
        price: product.price,
        image: getImageUrl(images[0]),
        quantity: 1,
      });
      toast.success(`${product.name} added to cart!`);
    } catch {
      toast.error("Failed to add to cart.");
    } finally {
      setAddingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="w-12 h-12 border-4 border-outline-variant border-t-secondary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* Page Header */}
      <div className="bg-surface-container-low border-b border-outline-variant px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs text-secondary uppercase tracking-widest font-body mb-2">My Collection</p>
          <div className="flex items-end justify-between">
            <h1 className="font-headline font-black text-4xl md:text-5xl uppercase tracking-tighter text-on-surface">
              Wishlist
              <span className="ml-3 text-secondary">({wishlistIds.size})</span>
            </h1>
            <button
              onClick={() => navigate(ALLPRODUCTS)}
              className="flex items-center gap-2 text-on-surface-variant hover:text-secondary transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {wishlistIds.size === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center">
              <Heart className="w-10 h-10 text-on-surface-variant" />
            </div>
            <div className="text-center">
              <h2 className="font-headline font-black uppercase tracking-tighter text-2xl text-on-surface mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-on-surface-variant text-sm max-w-xs">
                Save items you love to your wishlist and come back to them anytime.
              </p>
            </div>
            <button
              onClick={() => navigate(ALLPRODUCTS)}
              className="py-3.5 px-8 bg-secondary text-on-secondary font-bold uppercase tracking-widest text-sm hover:bg-secondary-container transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const images = (() => { try { return JSON.parse(product.images || "[]"); } catch { return []; } })();
              return (
                <div
                  key={product.id}
                  className="group bg-surface-container-low border border-outline-variant hover:border-secondary transition-colors duration-300 flex flex-col"
                >
                  {/* Product Image */}
                  <div
                    className="relative aspect-square overflow-hidden cursor-pointer bg-surface-container"
                    onClick={() => navigate(PRODUCT_DETAIL(product.id))}
                  >
                    <img
                      src={getImageUrl(images[0])}
                      alt={product.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Remove from Wishlist */}
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFromWishlist(product.id); }}
                      className="absolute top-3 right-3 w-8 h-8 bg-surface-container-high/80 backdrop-blur-sm flex items-center justify-center text-secondary hover:bg-surface-container-highest transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex flex-col flex-1">
                    <p
                      className="text-on-surface font-medium text-sm truncate cursor-pointer hover:text-secondary transition-colors mb-1"
                      onClick={() => navigate(PRODUCT_DETAIL(product.id))}
                    >
                      {product.name}
                    </p>
                    {product.brand && (
                      <p className="text-xs text-on-surface-variant mb-2">{product.brand}</p>
                    )}
                    <p className="text-secondary font-bold text-lg mt-auto mb-3">${product.price}</p>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={addingId === product.id}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-secondary text-on-secondary text-xs font-bold uppercase tracking-widest hover:bg-secondary-container transition-colors disabled:opacity-60"
                    >
                      {addingId === product.id ? (
                        <span className="w-4 h-4 border-2 border-on-secondary/30 border-t-on-secondary rounded-full animate-spin" />
                      ) : (
                        <ShoppingBag className="w-4 h-4" />
                      )}
                      {addingId === product.id ? "Adding..." : "Add to Cart"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
