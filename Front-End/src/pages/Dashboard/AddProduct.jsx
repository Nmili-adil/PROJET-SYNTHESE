import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import Categorie from "../../../service/Categorie";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Product from "../../../service/Product";
import { toast } from "react-hot-toast";
import SubCategoriesApi from "../../../service/SubCategorie";

function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    product_code: generateProductCode(),
    sizes: [],
    colors: [],
    images: [],
    category_id: "",
    sousCategorie: "",
  });

  function generateProductCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  const [categories, setCategories] = useState([]);
  const [sousCategorie, setSousCategories] = useState([]);
  useEffect(() => {
    Categorie.getAll().then((res) => {
      setCategories(res.data);
    });
    SubCategoriesApi.getAll().then((res) => {
      setSousCategories(res.data);
    });
  }, []);

  const availableSizes = ["S", "M", "L", "XL", "XXL"];

  const availableColors = [
    "Black",
    "White",
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Orange",
  ];
  const [imagePreviews, setImagePreviews] = useState([]);
  console.log(product.images);

  const handleSizeChange = useCallback((size) => {
    event.preventDefault();
    setProduct((prevState) => {
      const newSizes = prevState.sizes.includes(size)
        ? prevState.sizes.filter((s) => s !== size)
        : [...prevState.sizes, size];

      return { ...prevState, sizes: newSizes };
    });
  }, []);
  const handleColorChange = useCallback((color) => {
    event.preventDefault();
    setProduct((prevState) => {
      const newColors = prevState.colors.includes(color)
        ? prevState.colors.filter((c) => c !== color)
        : [...prevState.colors, color];

      return { ...prevState, colors: newColors };
    });
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProduct((prevState) => ({
      ...prevState,
      images: [...prevState.images, ...files],
    }));

    const previewURLs = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...previewURLs]);
  };

  const handleRemoveImage = (index) => {
    setProduct((prevState) => ({
      ...prevState,
      images: prevState.images.filter((_, i) => i !== index),
    }));

    setImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.promise(Product.create(product), {
      loading: "Creating product... ",
      success: (data) => {
        setProduct({
          name: "",
          description: "",
          price: 0,
          quantity: 0,
          product_code: generateProductCode(),
          sizes: [],
          colors: [],
          images: [],
          category_id: "",
          sousCategorie: "",
        });
        setImagePreviews([]);
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
          fileInput.value = '';
        }
        const categorySelect = document.querySelector('select[name="category_id"]');
        const subcategorySelect = document.querySelector('select[name="sousCategorie"]');
        if (categorySelect) categorySelect.value = '';
        if (subcategorySelect) subcategorySelect.value = '';
        
        return `Product ${data.data.name} created successfully!`;
      },
      error: (err) => `Could not create product: ${err.message}`,
    });
  };

  return (
    <div className="p-6 max-w-[1000px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Add Product</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Add a new product to the store inventory</p>
      </div>

      <form
        className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 p-6 space-y-6"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        {/* Basic Info */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 pb-2 border-b border-slate-200 dark:border-slate-700/60">
            Basic Information
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-slate-600 dark:text-slate-300">Product Name</Label>
              <Input id="name" placeholder="Product name..." onChange={(e) => setProduct({ ...product, name: e.target.value })}
                className="bg-transparent dark:text-white border-slate-300 dark:border-slate-700" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="productCode" className="text-xs font-semibold text-slate-600 dark:text-slate-300">Product Code</Label>
              <Input id="productCode" value={product.product_code} disabled
                className="bg-slate-50 dark:bg-slate-700/40 cursor-not-allowed border-slate-300 dark:border-slate-700 text-slate-500" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="price" className="text-xs font-semibold text-slate-600 dark:text-slate-300">Price ($)</Label>
              <Input id="price" type="number" placeholder="0.00" onChange={(e) => setProduct({ ...product, price: e.target.value })}
                className="bg-transparent dark:text-white border-slate-300 dark:border-slate-700" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="quantity" className="text-xs font-semibold text-slate-600 dark:text-slate-300">Quantity</Label>
              <Input id="quantity" type="number" placeholder="0" onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
                className="bg-transparent dark:text-white border-slate-300 dark:border-slate-700" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold text-slate-600 dark:text-slate-300">Description</Label>
              <Textarea id="description" placeholder="Product description..." value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                className="bg-transparent dark:text-white border-slate-300 dark:border-slate-700 min-h-[80px]" />
            </div>
          </div>
        </div>

        {/* Categorization */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 pb-2 border-b border-slate-200 dark:border-slate-700/60">
            Categorization
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Category</Label>
              <Select onValueChange={(v) => setProduct({ ...product, category_id: Number(v) })}>
                <SelectTrigger className="border-slate-300 dark:border-slate-700">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Sub-Category</Label>
              <Select onValueChange={(v) => setProduct({ ...product, sousCategorie: Number(v) })}>
                <SelectTrigger className="border-slate-300 dark:border-slate-700">
                  <SelectValue placeholder="Select a sub-category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sub-Categories</SelectLabel>
                    {sousCategorie.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Variants */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 pb-2 border-b border-slate-200 dark:border-slate-700/60">
            Variants
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Sizes</Label>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeChange(size)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                      product.sizes.includes(size)
                        ? "bg-purple-600 border-purple-600 text-white"
                        : "border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-purple-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Colors</Label>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleColorChange(color)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                      product.colors.includes(color)
                        ? "bg-purple-600 border-purple-600 text-white"
                        : "border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-purple-400"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Images */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 pb-2 border-b border-slate-200 dark:border-slate-700/60">
            Images
          </p>
          <div className="space-y-3">
            <Input type="file" accept="image/*" onChange={handleImageChange}
              className="border-slate-300 dark:border-slate-700 file:text-xs file:font-semibold" />
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-2">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative group">
                    <img src={src} alt="" className="w-20 h-20 object-cover rounded-xl border border-slate-200 dark:border-slate-700" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-700/60">
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-6">
            Save Product
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
