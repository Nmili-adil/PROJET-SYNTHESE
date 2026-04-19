import ProductsTable from "../../components/Partials/ProductsTable";

export default function ListProducts() {
  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Products</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage store inventory and product listings</p>
      </div>
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 p-5">
        <ProductsTable />
      </div>
    </div>
  );
}
