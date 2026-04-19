import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AdminApi from "../../../service/Admins";
import { toast } from "react-hot-toast";
import { useState } from "react";

const EMPTY = {
  first_name: "", last_name: "", matricule: "", email: "",
  password: "", phone: "", address: "", city: "", country: "",
  postal_code: "", role: "admin", name: "",
};

function Field({ label, id, type = "text", placeholder, value, onChange, disabled }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-semibold text-slate-600 dark:text-slate-300">{label}</Label>
      <Input
        id={id} type={type} placeholder={placeholder}
        value={value} onChange={onChange} disabled={disabled}
        className="bg-transparent dark:text-white border-slate-300 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-400"
      />
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div className="col-span-2 border-b border-slate-200 dark:border-slate-700/60 pb-2 mb-1">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{children}</p>
    </div>
  );
}

function AddAdmin() {
  const [admin, setAdmin] = useState(EMPTY);
  const [confirmPassword, setConfirmPassword] = useState("");

  const set = (key) => (e) => setAdmin(a => ({ ...a, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (admin.password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    toast.promise(AdminApi.addAdmin({ ...admin, name: `${admin.first_name} ${admin.last_name}` }), {
      loading: "Creating admin...",
      success: (data) => `Admin ${data.data.first_name} created successfully!`,
      error: (err) => `Could not create admin: ${err.message}`,
    }).then(() => { setAdmin(EMPTY); setConfirmPassword(""); });
  };

  return (
    <div className="p-6 max-w-[900px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">New Admin</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Create a new administrator account</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 p-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <SectionTitle>Personal Information</SectionTitle>
          <Field label="First Name" id="first_name" placeholder="First name..." value={admin.first_name} onChange={set("first_name")} />
          <Field label="Last Name"  id="last_name"  placeholder="Last name..."  value={admin.last_name}  onChange={set("last_name")} />
          <Field label="Matricule"  id="matricule"  placeholder="Matricule..."  value={admin.matricule}  onChange={set("matricule")} />

          <SectionTitle>Account Credentials</SectionTitle>
          <Field label="Email Address" id="email"    type="email"    placeholder="Email..." value={admin.email} onChange={set("email")} />
          <Field label="Password"      id="password" type="password" placeholder="Password..." value={admin.password} onChange={set("password")} />
          <Field label="Confirm Password" id="confirmPassword" type="password" placeholder="Confirm password..."
            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

          <SectionTitle>Contact & Address</SectionTitle>
          <Field label="Phone"   id="phone"   placeholder="Phone number..." value={admin.phone}       onChange={set("phone")} />
          <Field label="Address" id="address" placeholder="Street address..." value={admin.address}   onChange={set("address")} />
          <Field label="City"    id="city"    placeholder="City..."          value={admin.city}        onChange={set("city")} />
          <Field label="Country" id="country" placeholder="Country..."       value={admin.country}     onChange={set("country")} />
          <Field label="ZIP Code" id="postal_code" placeholder="ZIP code..." value={admin.postal_code} onChange={set("postal_code")} />

          <div className="col-span-2 flex justify-end pt-2 mt-2 border-t border-slate-200 dark:border-slate-700/60">
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-6">
              Create Admin
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddAdmin;
