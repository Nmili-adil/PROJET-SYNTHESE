import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { CART, STORE } from '../../router/Router';
import { useClientContext } from '../../../api/context/ClientContext';
import { useCartContext } from '../../../api/context/CartContext';
import Order from '../../../service/Order';
import ProductService from '../../../service/Product';
import { axiosClient } from '../../../api/axios';
// shadcn/ui components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Wallet, Banknote, ArrowBigLeft } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import OrderSuccess from '@/components/OrderSuccess';
import UpsellProducts from '@/components/UpsellProducts';
import PaypalCheckout from '../../components/PaypalCheckout'

const Checkout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [phoneError, setPhoneError] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [showPaypalDialog, setShowPaypalDialog] = useState(false);
  const [isPaypalVerified, setIsPaypalVerified] = useState(false);
  const [showCardDialog, setShowCardDialog] = useState(false);
  const [isCardVerified, setIsCardVerified] = useState(false);
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const { client } = useClientContext();
  const { 
    cart, 
    clearCart, 
    discountType,
    discountValue,
    isFreeShipping,
    calculateSubtotal,
    calculateDiscount,
    calculateShipping,
    calculateTotal,
    coupon
  } = useCartContext();

  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    emailAddress: '',
    phoneNumber: '',
    streetAddress: '',
    townCity: '',
    stateCounty: '',
    deliveryDate: '',
    zipPostcode: ''
  });

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [lastOrderId, setLastOrderId] = useState(null);
  const [upsellProducts, setUpsellProducts] = useState([]);

  useEffect(() => {
    if (!cart) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [cart]);

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(0[567])[0-9]{8}$/;
    return phoneRegex.test(phone);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'phoneNumber') {
      setPhoneError('');
      const phoneValue = value.replace(/[^0-9]/g, '');
      setBillingInfo({
        ...billingInfo,
        [name]: phoneValue
      });
      if (phoneValue.length === 10 && !validatePhoneNumber(phoneValue)) {
        setPhoneError('Please enter a valid Moroccan phone number starting with 05, 06, or 07');
      }
    } else {
      setBillingInfo({
        ...billingInfo,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // Validate phone number
      if (!validatePhoneNumber(billingInfo.phoneNumber)) {
        setPhoneError('Please enter a valid phone number');
        return;
      }

      // Create order data
      const orderData = {
        client_id: client.id,
        total_amount: calculateTotal(),
        shipping_address: {
          full_name: `${billingInfo.firstName} ${billingInfo.lastName}`,
          address_line1: billingInfo.streetAddress,
          address_line2: '',
          city: billingInfo.townCity,
          state: billingInfo.stateCounty,
          postal_code: billingInfo.zipPostcode,
          country: 'Morocco',
          phone_number: billingInfo.phoneNumber
        }
      };

      // Create order
      const response = await Order.create(orderData);
      
      if (response.status === 201) {
        try {
          // Get the last order ID
          const lastOrderResponse = await Order.getLastOrderId();
          console.log('Last order response:', lastOrderResponse);
          
          if (lastOrderResponse.data && lastOrderResponse.data.id) {
            setLastOrderId(lastOrderResponse.data.id);
          } else {
            console.error('Invalid last order response:', lastOrderResponse);
            setLastOrderId(response.data.order.id); // Fallback to the current order ID
          }
          
          // Clear the cart and wait for it to complete
          await clearCart();
          
          // Set order success
          setOrderSuccess(true);
          
          // Fetch upsell products
          try {
            const productsResponse = await ProductService.getUpsellProducts();
            console.log('Upsell products response:', productsResponse);
            if (productsResponse && productsResponse.data) {
              setUpsellProducts(productsResponse.data);
            } else {
              console.error('Invalid upsell products response:', productsResponse);
            }
          } catch (error) {
            console.error('Error fetching upsell products:', error);
          }
        } catch (error) {
          console.error('Error getting last order ID:', error);
          // Fallback to using the current order ID
          setLastOrderId(response.data.order.id);
          setOrderSuccess(true);
        }
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Could not place your order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handlePaypalVerification = async () => {
    setProcessing(true);
    try {
      // Validate PayPal email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(paypalEmail)) {
        toast.error('Please enter a valid email address');
        return;
      }

      // Make API call to verify PayPal email
      const response = await axiosClient.post('/api/paypal/verify-email', {
        email: paypalEmail
      });
console.log(response)
      if (response.data.verified) {
        setIsPaypalVerified(true);
        setShowPaypalDialog(false);
        toast.success('PayPal email verified successfully!');
      } else {
        toast.error('This email is not associated with a PayPal account. Please use a valid PayPal email.');
      }
    } catch (error) {
      console.error('PayPal verification error:', error);
      if (error.response?.status === 404) {
        toast.error('This email is not associated with a PayPal account. Please use a valid PayPal email.');
      } else {
        toast.error('Failed to verify PayPal email. Please try again.');
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleCardVerification = async () => {
    setProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Basic validation
      const isValid = 
        cardInfo.cardNumber.replace(/\s/g, '').length === 16 &&
        /^\d{2}\/\d{2}$/.test(cardInfo.expiryDate) &&
        /^\d{3,4}$/.test(cardInfo.cvv) &&
        cardInfo.cardholderName.trim().length > 0;
      
      if (isValid) {
        setIsCardVerified(true);
        setShowCardDialog(false);
        toast.success('Card information verified successfully!');
      } else {
        toast.error('Invalid card information. Please check and try again.');
      }
    } catch (error) {
      toast.error('Failed to verify card information. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
    if (value === 'paypal') {
      setShowPaypalDialog(true);
      setIsCardVerified(false);
    } else if (value === 'credit_card') {
      setShowCardDialog(true);
      setIsPaypalVerified(false);
    } else {
      setIsPaypalVerified(false);
      setIsCardVerified(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const renderDiscountInfo = () => {
    if (!coupon) return null;

    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscount(subtotal);

    switch (discountType) {
      case 'percentage':
        return (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount ({discountValue}%)</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        );
      case 'fixed_amount':
        return (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount (Fixed Amount)</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        );
      case 'free_shipping':
        return (
          <div className="flex justify-between text-sm text-green-600">
            <span>Free Shipping Applied</span>
            <span>-${calculateShipping().toFixed(2)}</span>
          </div>
        );
      default:
        return null;
    }
  };

  const handlePaymentSuccess = (details) => {
    // Handle successful payment
    console.log('Payment successful:', details);
    // Update your database, show success message, etc.
  };

  if (orderSuccess) {
    return (
      <>
        <OrderSuccess orderId={lastOrderId} />
        {upsellProducts.length > 0 && <UpsellProducts products={upsellProducts} />}
      </>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="w-16 h-16 border-4 border-outline-variant border-t-secondary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-surface text-on-surface py-8 px-4">
      <div className="max-w-6xl pt-10 mx-auto">
        <div className='flex items-center justify-between mb-8'>
          <div>
            <p className="text-xs text-secondary uppercase tracking-widest font-body mb-1">Secure Checkout</p>
            <h1 className="font-headline font-black text-3xl uppercase tracking-tighter text-on-surface">Complete Your Order</h1>
          </div>
          <button type="button" onClick={()=> navigate(CART)} className="flex items-center gap-2 text-on-surface-variant hover:text-secondary transition-colors text-sm font-medium">
            <ArrowBigLeft className="w-4 h-4" />
            Return to Cart
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Billing Information */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={billingInfo.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={billingInfo.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailAddress">Email Address</Label>
                  <Input
                    id="emailAddress"
                    name="emailAddress"
                    type="email"
                    value={billingInfo.emailAddress}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={billingInfo.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                  {phoneError && (
                    <p className="text-sm text-red-500">{phoneError}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="streetAddress">Street Address</Label>
                  <Input
                    id="streetAddress"
                    name="streetAddress"
                    value={billingInfo.streetAddress}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="townCity">Town/City</Label>
                  <Input
                    id="townCity"
                    name="townCity"
                    value={billingInfo.townCity}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stateCounty">State/County</Label>
                  <Input
                    id="stateCounty"
                    name="stateCounty"
                    value={billingInfo.stateCounty}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipPostcode">ZIP/Postcode</Label>
                  <Input
                    id="zipPostcode"
                    name="zipPostcode"
                    value={billingInfo.zipPostcode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={handlePaymentMethodChange}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2 border border-outline-variant p-4 hover:border-secondary cursor-pointer transition-colors">
                    <RadioGroupItem value="credit_card" id="credit_card" />
                    <Label htmlFor="credit_card" className="flex items-center gap-2 cursor-pointer text-on-surface">
                      <CreditCard className="w-5 h-5 text-secondary" />
                      <span>Credit Card</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 border border-outline-variant p-4 hover:border-secondary cursor-pointer transition-colors">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer text-on-surface">
                      <Wallet className="w-5 h-5 text-secondary" />
                      <span>PayPal</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 border border-outline-variant p-4 hover:border-secondary cursor-pointer transition-colors">
                    <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
                    <Label htmlFor="cash_on_delivery" className="flex items-center gap-2 cursor-pointer text-on-surface">
                      <Banknote className="w-5 h-5 text-secondary" />
                      <span>Cash on Delivery</span>
                    </Label>
                  </div>
                </RadioGroup>

                {/* Payment Method Specific Fields */}
                {paymentMethod === 'credit_card' && (
                  <div className="mt-4 space-y-4">
                    {isCardVerified ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <p className="text-sm">Card verified ending in {cardInfo.cardNumber.slice(-4)}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">
                        Please verify your card information to continue.
                      </p>
                    )}
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="mt-4 p-4 bg-surface-container border border-outline-variant">
                    {isPaypalVerified ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <PaypalCheckout
                          amount={calculateTotal}
                          verifiedPaypalEmail={paypalEmail}
                          onSuccess={handlePaymentSuccess}
                        />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <p className="text-sm">PayPal email verified: {paypalEmail}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">
                        Please verify your PayPal email to continue.
                      </p>
                    )}
                  </div>
                )}

                {paymentMethod === 'cash_on_delivery' && (
                  <div className="mt-4 p-4 bg-surface-container border border-outline-variant">
                    <p className="text-sm text-on-surface-variant">
                      Pay with cash upon delivery. Please have the exact amount ready.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart?.items?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.product?.name}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium">
                      ${(item.product?.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping:</span>
                    <span>${calculateShipping().toFixed(2)}</span>
                  </div>
                  {renderDiscountInfo()}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold text-base">
                    <span>Total (USD):</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <Button
                    type="submit"
                    className="w-full text-white py-3 text-lg font-semibold rounded mt-4"
                    disabled={processing}
                  >
                    {processing ? 'Processing...' : `Pay ${calculateTotal().toFixed(2)} USD`}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* PayPal Verification Dialog */}
      <AlertDialog open={showPaypalDialog} onOpenChange={setShowPaypalDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Verify PayPal Email</AlertDialogTitle>
            <AlertDialogDescription>
              Please enter your PayPal email address to continue with the payment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              type="email"
              placeholder="Enter your PayPal email"
              value={paypalEmail}
              onChange={(e) => setPaypalEmail(e.target.value)}
              className="w-full"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePaypalVerification}
              disabled={processing || !paypalEmail}
            >
              {processing ? 'Verifying...' : 'Verify Email'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Credit Card Verification Dialog */}
      <AlertDialog open={showCardDialog} onOpenChange={setShowCardDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Enter Card Information</AlertDialogTitle>
            <AlertDialogDescription>
              Please enter your credit card details to continue with the payment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                placeholder="John Doe"
                value={cardInfo.cardholderName}
                onChange={(e) => setCardInfo({ ...cardInfo, cardholderName: e.target.value })}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardInfo.cardNumber}
                onChange={(e) => setCardInfo({ ...cardInfo, cardNumber: formatCardNumber(e.target.value) })}
                maxLength={19}
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={cardInfo.expiryDate}
                  onChange={(e) => setCardInfo({ ...cardInfo, expiryDate: formatExpiryDate(e.target.value) })}
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cardInfo.cvv}
                  onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value.replace(/\D/g, '') })}
                  maxLength={4}
                />
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCardVerification}
              disabled={processing || !cardInfo.cardNumber || !cardInfo.expiryDate || !cardInfo.cvv || !cardInfo.cardholderName}
            >
              {processing ? 'Verifying...' : 'Verify Card'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Order Success Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-2xl w-full mx-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
              <p className="text-gray-600">Your order has been placed successfully. Order number: #{lastOrderId}</p>
            </div>

            {/* Upsell Products Section */}
            {upsellProducts && upsellProducts.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Recommended Products</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upsellProducts.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4 flex items-center space-x-4">
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-gray-600">${product.price}</p>
                        <button
                          onClick={() => handleAddUpsellProduct(product)}
                          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={() => {
                  setOrderSuccess(false);
                  navigate('/store');
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default Checkout;