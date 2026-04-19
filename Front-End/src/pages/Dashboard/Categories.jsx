import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoriesTable from "@/components/Partials/CategoriesTable";
import CategorieForm from "@/components/Partials/CategorieForm";
import Loading from "../../components/Partials/loading";

const Categories = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6 max-w-[900px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Categories</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage product categories for the store</p>
      </div>
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 p-5">
        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="categories">All Categories</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
          </TabsList>
          <TabsContent value="categories">
            {loading ? <Loading /> : <CategoriesTable />}
          </TabsContent>
          <TabsContent value="create">
            <CategorieForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Categories;
