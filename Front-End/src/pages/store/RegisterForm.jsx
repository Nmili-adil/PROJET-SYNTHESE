import { useNavigate } from "react-router-dom";
import ClientApi from "../../../service/Client";
import { LOGINSTORE } from "@/router/Router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useClientContext } from "../../../api/context/ClientContext";
import { ALLPRODUCTS } from "../../router/paths";
import { ArrowRight, ArrowLeft, Eye, EyeOff } from "lucide-react";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postal_code: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { authenticated } = useClientContext();

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  useEffect(() => {
    authenticated ? navigate(ALLPRODUCTS) : '';
  }, [authenticated]);

  const validateStep = (step) => {
    setError("");
    switch (step) {
      case 1:
        if (!formData.first_name || !formData.last_name || !formData.email) {
          setError("Please fill in all required fields");
          return false;
        }
        if (!formData.email.includes('@')) {
          setError("Please enter a valid email address");
          return false;
        }
        return true;
      case 2:
        if (!formData.password || !formData.password_confirmation) {
          setError("Please fill in all required fields");
          return false;
        }
        if (formData.password !== formData.password_confirmation) {
          setError("Passwords do not match");
          return false;
        }
        if (formData.password.length < 8) {
          setError("Password must be at least 8 characters long");
          return false;
        }
        if (!formData.phone || !formData.address) {
          setError("Please fill in all required fields");
          return false;
        }
        return true;
      case 3:
        if (!formData.city || !formData.country || !formData.postal_code) {
          setError("Please fill in all required fields");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;
    
    setLoading(true);
    try {
      const response = await ClientApi.addClient(formData);
      if (response.status === 201) {
        toast.success("Account created successfully!");
        setTimeout(() => {
          navigate(LOGINSTORE);
        }, 2000);
      }
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          "An error occurred during registration";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const renderStep = () => {
    const inputCls = "w-full px-4 py-3 bg-surface-container border border-outline-variant text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-secondary transition-colors disabled:opacity-50 text-sm";
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-secondary uppercase tracking-widest font-semibold mb-1">Step 1 of 3</p>
              <h3 className="text-xl font-headline font-black uppercase tracking-tighter">Personal Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-on-surface-variant uppercase tracking-wider block mb-1.5">First Name</label>
                <input type="text" name="first_name" placeholder="John" value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  required disabled={loading} className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-on-surface-variant uppercase tracking-wider block mb-1.5">Last Name</label>
                <input type="text" name="last_name" placeholder="Doe" value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  required disabled={loading} className={inputCls} />
              </div>
            </div>
            <div>
              <label className="text-xs text-on-surface-variant uppercase tracking-wider block mb-1.5">Email Address</label>
              <input type="email" name="email" placeholder="you@example.com" value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required disabled={loading} className={inputCls} />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-secondary uppercase tracking-widest font-semibold mb-1">Step 2 of 3</p>
              <h3 className="text-xl font-headline font-black uppercase tracking-tighter">Security & Contact</h3>
            </div>
            <div>
              <label className="text-xs text-on-surface-variant uppercase tracking-wider block mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password" placeholder="Min. 8 characters" value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required disabled={loading} className={`${inputCls} pr-12`} />
                <button type="button" tabIndex={-1} onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs text-on-surface-variant uppercase tracking-wider block mb-1.5">Confirm Password</label>
              <input type="password" name="password_confirmation" placeholder="Repeat password" value={formData.password_confirmation}
                onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                required disabled={loading} className={inputCls} />
            </div>
            <div>
              <label className="text-xs text-on-surface-variant uppercase tracking-wider block mb-1.5">Phone Number</label>
              <input type="tel" name="phone" placeholder="+1 (555) 000-0000" value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required disabled={loading} className={inputCls} />
            </div>
            <div>
              <label className="text-xs text-on-surface-variant uppercase tracking-wider block mb-1.5">Address</label>
              <input type="text" name="address" placeholder="123 Main St" value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required disabled={loading} className={inputCls} />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-secondary uppercase tracking-widest font-semibold mb-1">Step 3 of 3</p>
              <h3 className="text-xl font-headline font-black uppercase tracking-tighter">Location Details</h3>
            </div>
            <div>
              <label className="text-xs text-on-surface-variant uppercase tracking-wider block mb-1.5">City</label>
              <input type="text" name="city" placeholder="Los Angeles" value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required disabled={loading} className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-on-surface-variant uppercase tracking-wider block mb-1.5">Country</label>
                <input type="text" name="country" placeholder="United States" value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  required disabled={loading} className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-on-surface-variant uppercase tracking-wider block mb-1.5">Postal Code</label>
                <input type="text" name="postal_code" placeholder="90001" value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  required disabled={loading} className={inputCls} />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex">
      {/* Left brand panel */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center px-16"
        style={{ background: "linear-gradient(135deg, #1a0a2e 0%, #2d1060 50%, #552583 100%)" }}
      >
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-secondary/5 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-secondary/5 translate-x-1/3 translate-y-1/3" />
        <div className="relative z-10 text-center">
          <p className="text-xs text-secondary uppercase tracking-widest font-semibold mb-4">Kinetic Court</p>
          <h1 className="text-5xl font-headline font-black uppercase tracking-tighter text-white leading-none mb-6">
            Join The<br /><span className="text-secondary">Dynasty</span>
          </h1>
          <p className="text-white/60 text-sm leading-relaxed max-w-sm mx-auto">
            Create your account and get exclusive access to merchandise, match updates, and member-only deals.
          </p>
          {/* Step indicators */}
          <div className="mt-12 space-y-4">
            {[['01', 'Personal Info'], ['02', 'Security & Contact'], ['03', 'Location']].map(([num, label], i) => (
              <div key={num} className={`flex items-center gap-4 text-left ${currentStep > i ? 'opacity-100' : 'opacity-30'}`}>
                <div className={`w-8 h-8 flex items-center justify-center text-xs font-bold ${currentStep > i ? 'bg-secondary text-on-secondary' : 'border border-white/30 text-white/60'}`}>
                  {currentStep > i + 1 ? '✓' : num}
                </div>
                <span className={`text-sm ${currentStep === i + 1 ? 'text-secondary font-semibold' : 'text-white/60'}`}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-16 bg-surface">
        <div className="w-full max-w-md">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-xs text-on-surface-variant mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-1 bg-surface-container-high">
              <div
                className="h-full bg-secondary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStep()}

            {error && (
              <div className="px-4 py-3 bg-red-900/20 border border-red-400/30">
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              {currentStep > 1 ? (
                <button type="button" onClick={handleBack} disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 border border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-on-surface text-sm transition-colors disabled:opacity-40">
                  <ArrowLeft size={14} /> Back
                </button>
              ) : (
                <div />
              )}
              {currentStep < totalSteps ? (
                <button type="button" onClick={handleNext} disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-secondary text-on-secondary font-bold uppercase tracking-widest text-xs hover:bg-secondary-container transition-colors disabled:opacity-40">
                  Continue <ArrowRight size={14} />
                </button>
              ) : (
                <button type="submit" disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-secondary text-on-secondary font-bold uppercase tracking-widest text-xs hover:bg-secondary-container transition-colors disabled:opacity-40">
                  {loading ? (
                    <>
                      <div className="w-3 h-3 border border-on-secondary/30 border-t-on-secondary rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>Create Account <ArrowRight size={14} /></>
                  )}
                </button>
              )}
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-outline-variant text-center">
            <p className="text-on-surface-variant text-sm">
              Already have an account?{' '}
              <button onClick={() => navigate(LOGINSTORE)} disabled={loading}
                className="text-secondary hover:text-secondary-container font-semibold transition-colors">
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;

