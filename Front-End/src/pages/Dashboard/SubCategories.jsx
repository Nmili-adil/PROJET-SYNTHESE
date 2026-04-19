import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SubCategoriesTable from "@/components/Partials/SubCategoriesTable";
import SubCategoryForm from "@/components/Partials/SubCategoryForm";
import Loading from "../../components/Partials/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import SubCategoriesApi from "../../../service/SubCategorie";

const SubCategories = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    SubCategoriesApi.getAll().then((res) => {
      setCategories(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-6 max-w-[900px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Sub-Categories</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage product sub-categories and their groupings</p>
      </div>
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 p-5">
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Filter by Category</label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[260px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categories</SelectLabel>
                {categories.map((categorie) => (
                  <SelectItem key={categorie.id} value={categorie.id.toString()}>
                    {categorie.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Tabs defaultValue="sub-categories" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="sub-categories">All Sub-Categories</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
          </TabsList>
          <TabsContent value="sub-categories">
            {loading ? <Loading /> : <SubCategoriesTable selectedCategory={Number(selectedCategory)} />}
          </TabsContent>
          <TabsContent value="create">
            <SubCategoryForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SubCategories;
