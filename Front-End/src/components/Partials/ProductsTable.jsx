import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Product from "../../../service/Product";
import { Editproduct } from "./EditProduct";
import ProductDetails from "./ProductDetails";
import Loading from "./loading";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { PRODUCT_CREATE } from "../../router/paths";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "../ui/alert-dialog";

const tableVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.1, duration: 0.3 },
  }),
};

const ProductsTable = () => {
  const [products, setProduct] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  
  useEffect(() => {
    fetchProducts();
  }, []);

 
  useEffect(() => {
    setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when search changes
  }, [filteredProducts, itemsPerPage]);

  useEffect(() => {
    // Filter products based on search query
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.product_code.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          (product.categorie?.name && product.categorie.name.toLowerCase().includes(query))
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    try {
      const res = await Product.getAll();
      setProduct(res.data);
      setFilteredProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    toast
      .promise(Product.delete(id), {
        loading: "Deleting product...",
        success: (data) => ` ${data.data.message} !`,
        error: (err) => `Could not delete product: ${err.message}`,
      })
      .then(() => {
        setProduct((prevProduct) =>
          prevProduct.filter((product) => product.id !== id)
        );
      });
  };

  const handleEdit = (updateProduct) => {
    // Update the state with the modified product
    setProduct((prevProduct) =>
      prevProduct.map((product) =>
        product.id === updateProduct.id ? updateProduct : product
      )
    );
  };

  // Get current products for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

console.log(currentProducts)
  return (
    <div className="flex flex-col items-start border-1 shadow-md dark:border-slate-700 border-slate-300 rounded-md p-4 dark:bg-slate-950 bg-white">
      <div className="w-full border-b-2 border-slate-700 pb-4 mb-4 relative">
        <div className="flex flex-col items-start mb-4">
        <h1 className="text-black dark:text-white text-xl font-semibold">Products List</h1>
        <p className="dark:text-gray-400 text-gray-800 text-sm">Search for a product by name, code, or description</p>
        </div>
        <div className="flex flex-row items-center justify-between">
        <div className="relative w-1/2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products by name, code, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-transparent dark:text-white border-slate-700"
          />
        </div>
        <Link to={PRODUCT_CREATE}>
        <Button variant="default">Add Product</Button>
        </Link>
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <Table className="mt-4 w-full lg:w-[800px] mx-auto">
          <TableCaption>A list of Products. <span className="text-xs underline text-gray-500">{currentProducts.length} products</span></TableCaption>
          <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Product code</TableHead>
            <TableHead>Product name</TableHead>
            <TableHead>Product description</TableHead>
            <TableHead>Categorie</TableHead>
            <TableHead>Sous categorie</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentProducts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                {searchQuery ? "No products match your search." : "No Products found."}
              </TableCell>
            </TableRow>
          ) : (
            currentProducts.map((product) => (
              <motion.tr
                key={product.id}
                custom={product.id}
                initial="hidden"
                animate="visible"
                variants={tableVariants}
              >
                <TableCell className="font-medium">{product.product_code}</TableCell>
                <TableCell className="truncate-cell">{product.name}</TableCell>
                <TableCell className="truncate-cell">{product.description}</TableCell>
                <TableCell>{product.categories?.name}</TableCell>
                <TableCell>{product.sous_categories?.name}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <ProductDetails product={product} />
                  <Editproduct id={product.id} onEdit={handleEdit} />
                  <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete product and remove it data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDelete(product.id)}
                      > 
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                </TableCell>
              </motion.tr>
            ))
          )}
        </TableBody>
      </Table>
      )}
      {totalPages > 1 && (
        <div className="flex mx-auto justify-center mt-4 gap-2">
          <Button 
            variant="outline"   
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <Button
              key={number}
              variant={currentPage === number ? "default" : "outline"}
              onClick={() => paginate(number)}
              className="w-10 h-10"
            >
              {number}
            </Button>
          ))}
          
          <Button 
            variant="outline" 
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductsTable;
