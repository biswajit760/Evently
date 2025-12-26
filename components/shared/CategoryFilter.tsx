"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getAllCategories } from "@/lib/actions/category.actions";
import { ICategory } from "@/lib/database/models/category.model";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Filter } from "lucide-react"; 

const CategoryFilter = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentCategory = searchParams.get('category') || 'All';

  useEffect(() => {
    const getCategories = async () => {
      const categoryList = await getAllCategories();
      categoryList && setCategories(categoryList as ICategory[])
    }
    getCategories();
  }, [])

  const onSelectCategory = (category: string) => {
      let newUrl = '';

      if(category && category !== 'All') {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'category',
          value: category
        })
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ['category']
        })
      }

      router.push(newUrl, { scroll: false });
  }

  return (
    <Select 
        onValueChange={(value: string) => onSelectCategory(value)} 
        defaultValue={currentCategory} 
    >
      <SelectTrigger className="w-full rounded-full h-[60px] px-5 
        bg-gray-50 border-gray-200 text-gray-600       /* Light Mode */
        dark:bg-zinc-900 dark:border-zinc-800 dark:text-gray-300 /* Dark Mode */
        border shadow-none focus:ring-0 focus:ring-offset-0 transition-all hover:bg-white dark:hover:bg-zinc-800/80"
      >
        <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400 dark:text-zinc-500" />
            <SelectValue placeholder="Select Category" />
        </div>
      </SelectTrigger>
      
      <SelectContent className="bg-white border-gray-100 text-gray-700 shadow-xl rounded-xl
                                dark:bg-zinc-900 dark:border-zinc-800 dark:text-gray-300 dark:shadow-none">
        <SelectItem 
            value="All" 
            className="py-3 px-4 cursor-pointer focus:bg-gray-50 focus:text-indigo-600 
                       dark:focus:bg-zinc-800 dark:focus:text-indigo-400"
        >
            All Categories
        </SelectItem>

        {categories.map((category) => (
          <SelectItem 
            value={category.name} 
            key={category.name} 
            className="py-3 px-4 cursor-pointer focus:bg-gray-50 focus:text-indigo-600 
                       dark:focus:bg-zinc-800 dark:focus:text-indigo-400"
          >
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default CategoryFilter