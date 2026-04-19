import { useEffect, useState } from 'react';
import CartService from '../../../service/Cart';
import { useClientContext } from '../../../api/context/ClientContext';
import { useNavigate } from 'react-router-dom';
import { CHECKOUT, ALLPRODUCTS, LOGINSTORE } from '../../router/Router';
import { Trash, ArrowLeft, Tag, ShoppingBag, Truck, Gift, Phone, MessageSquare } from 'lucide-react';
import { useCartContext } from '../../../api/context/CartContext';
import { toast } from 'react-hot-toast';


export default function Cart() {
  const { client,authenticated } = useClientContext();
  const { 
    cart, 
    applyCoupon, 
    removeCoupon, 
    coupon, 
    discountType,
    discountValue,
    isFreeShipping,
    calculateSubtotal,
    calculateDiscount,
    calculateShipping,
    calculateTotal,
    updateQuantity
  } = useCartContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  const [couponInput, setCouponInput] = useState('');

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await CartService.getCart(client.id);
      setItems(res.data.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

useEffect(()=>{
  if(!authenticated){
    navigate(LOGINSTORE)
  }
},[])

  useEffect(() => {
    if (client.id) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [client.id]);

  const handleAddCoupon = () => {
    if (couponInput !== '') {
      applyCoupon(couponInput.toUpperCase());
      setCouponInput('');
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponInput('');
  };

  const renderDiscountInfo = () => {
    if (!coupon) return null;

    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscount(subtotal);

    switch (discountType) {
      case 'percentage':
        return (
          <div className="flex justify-between text-sm text-green-400">
            <span>Discount ({discountValue}%)</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        );
      case 'fixed_amount':
        return (
          <div className="flex justify-between text-sm text-green-400">
            <span>Discount (Fixed Amount)</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        );
      case 'free_shipping':
        return (
          <div className="flex justify-between text-sm text-green-400">
            <span>Free Shipping Applied</span>
            <span>-${calculateShipping().toFixed(2)}</span>
          </div>
        );
      default:
        return null;
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      // Update local state first for immediate feedback
      setItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));

      // Then update the backend through context
      await updateQuantity(itemId, newQuantity);
      
      // Fetch fresh cart data
      await fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
      // Revert local state on error
      await fetchCart();
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      // Update local state first
      setItems(prev => prev.filter(item => item.id !== itemId));
      
      // Then update the backend
      await CartService.removeItem(itemId);
      
      // Fetch fresh cart data
      await fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
      // Revert local state on error
      await fetchCart();
    }
  };

  const handleClearCart = async () => {
    try {
      // Update local state first
      setItems([]);
      
      // Then update the backend
      await CartService.clearCart(client.id);
      
      // Fetch fresh cart data
      await fetchCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
      // Revert local state on error
      await fetchCart();
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* Page Header */}
      <div className="bg-surface-container-low border-b border-outline-variant px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs text-secondary uppercase tracking-widest font-semibold mb-2">Store</p>
          <h1 className="text-4xl md:text-5xl font-headline font-black uppercase tracking-tighter">Your Bag</h1>
          <p className="text-on-surface-variant mt-2 text-sm">{items.length} item{items.length !== 1 ? 's' : ''} in your bag</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col lg:flex-row gap-8">
        {/* LEFT: Cart Items */}
        <div className="flex-1 min-w-0">
          <button
            onClick={() => navigate(ALLPRODUCTS)}
            className="flex items-center gap-2 text-on-surface-variant hover:text-secondary transition-colors mb-6 text-sm"
          >
            <ArrowLeft size={16} /> Continue Shopping
          </button>

          <div className="border border-outline-variant">
            {/* Table Header Row */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant bg-surface-container">
              <h2 className="font-headline text-lg uppercase tracking-wide">Shopping Bag</h2>
              {items.length > 0 && (
                <button
                  onClick={handleClearCart}
                  className="text-xs text-red-400 hover:text-red-300 uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  <Trash size={12} /> Clear All
                </button>
              )}
            </div>

            {loading ? (
              <div className="py-20 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin"></div>
              </div>
            ) : items.length === 0 ? (
              <div className="py-24 text-center">
                <ShoppingBag className="mx-auto mb-4 text-on-surface-variant" size={48} strokeWidth={1} />
                <p className="text-on-surface-variant mb-2 font-medium">Your bag is empty</p>
                <p className="text-on-surface-variant text-sm mb-8">Add items to get started</p>
                <button
                  onClick={() => navigate(ALLPRODUCTS)}
                  className="px-8 py-3 bg-secondary text-on-secondary font-bold uppercase tracking-widest text-sm hover:bg-secondary-container transition-colors"
                >
                  Shop Now
                </button>
              </div>
            ) : (
              <>
                {/* Column Headers */}
                <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_40px] px-6 py-3 border-b border-outline-variant text-xs text-on-surface-variant uppercase tracking-widest">
                  <span>Product</span>
                  <span>Price</span>
                  <span>Quantity</span>
                  <span>Total</span>
                  <span></span>
                </div>

                {/* Items */}
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className={`grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_40px] items-center px-6 py-5 gap-4 hover:bg-surface-container transition-colors ${
                      index < items.length - 1 ? 'border-b border-outline-variant' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-20 overflow-hidden bg-surface-container-high flex-shrink-0">
                        <img
                          src={item.product?.images ? JSON.parse(item.product.images)[0] : ''}
                          alt={item.product?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-sm leading-snug">{item.product?.name}</p>
                        <p className="text-xs text-on-surface-variant mt-1">
                          {item.color && `Color: ${item.color}`}
                          {item.size ? ` · Size: ${item.size}` : ''}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm font-medium">${Number(item.product?.price).toFixed(2)}</p>

                    <div className="flex items-center border border-outline-variant w-fit">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high disabled:opacity-30 transition-colors text-lg"
                      >−</button>
                      <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors text-lg"
                      >+</button>
                    </div>

                    <p className="font-bold text-secondary text-sm">
                      ${(item.product?.price * item.quantity).toFixed(2)}
                    </p>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-red-400 transition-colors"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* RIGHT: Summary */}
        <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 space-y-4">
          {/* Order Summary Card */}
          <div className="border border-outline-variant">
            <div className="px-6 py-4 border-b border-outline-variant bg-surface-container">
              <h3 className="font-headline uppercase tracking-wide text-base">Order Summary</h3>
            </div>
            <div className="px-6 py-5 space-y-4">
              {!loading && items.length > 0 ? (
                <>
                  {/* Coupon */}
                  <div className="pb-4 border-b border-outline-variant">
                    <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <Tag size={11} /> Coupon Code
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 bg-surface-container border border-outline-variant px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-secondary transition-colors"
                        placeholder="Enter code"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        disabled={!!coupon}
                      />
                      {coupon ? (
                        <button
                          onClick={handleRemoveCoupon}
                          className="px-3 py-2 text-xs text-red-400 border border-red-400/30 hover:bg-red-400/10 transition-colors uppercase tracking-wide"
                        >Remove</button>
                      ) : (
                        <button
                          onClick={handleAddCoupon}
                          className="px-3 py-2 text-xs text-secondary border border-secondary/30 hover:bg-secondary/10 transition-colors uppercase tracking-wide"
                        >Apply</button>
                      )}
                    </div>
                    {coupon && (
                      <p className="text-xs text-green-400 mt-2">✓ Coupon "{coupon}" applied</p>
                    )}
                  </div>

                  {/* Totals */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-on-surface-variant">Subtotal</span>
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-on-surface-variant">Shipping</span>
                      <span>${calculateShipping().toFixed(2)}</span>
                    </div>
                    {renderDiscountInfo()}
                    <div className="flex justify-between text-lg font-bold pt-3 border-t border-outline-variant">
                      <span>Total</span>
                      <span className="text-secondary">${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(CHECKOUT)}
                    className="w-full py-4 bg-secondary text-on-secondary font-bold uppercase tracking-widest text-sm hover:bg-secondary-container transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                </>
              ) : (
                !loading && (
                  <p className="text-center text-on-surface-variant py-4 text-sm">Add items to see summary</p>
                )
              )}
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Truck, label: 'Free Shipping', sub: 'On orders $50+' },
              { icon: Phone, label: 'Call Us', sub: '+1 800 123 4567' },
              { icon: MessageSquare, label: 'Live Chat', sub: '24/7 Support' },
              { icon: Gift, label: 'Gift Cards', sub: 'Send a gift' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="border border-outline-variant p-4 hover:bg-surface-container transition-colors">
                <Icon size={18} className="text-secondary mb-2" strokeWidth={1.5} />
                <p className="text-xs font-semibold">{label}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
