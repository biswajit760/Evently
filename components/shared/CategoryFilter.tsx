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
import { Filter } from "lucide-react"; // Import standard icon

const CategoryFilter = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // SYNC: Get current category from URL to ensure dropdown matches state
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
        defaultValue={currentCategory} // FIX: Bind to URL state
        
    >
      <SelectTrigger className="w-full bg-gray-200 rounded-4xl h-[60px] border border-gray-400 shadow-none focus:ring-0 focus:ring-offset-0  px-4 py-2  text-gray-600">
        <div className="flex py-3 items-center gap-2">
            <Filter size={24} className="text-gray-500" />
            <SelectValue placeholder="Select Category" />
        </div>
      </SelectTrigger>
      
      <SelectContent className="bg-gray-50 border-gray-100 shadow-xl rounded-xl">
        <SelectItem value="All" className="py-3 px-4 text-gray-800 focus:bg-gray-300 focus:text-black cursor-pointer">
            All Categories
        </SelectItem>

        {categories.map((category) => (
          <SelectItem 
            value={category.name} 
            key={category.name} 
            className="py-3 px-4 text-gray-800 focus:bg-gray-300 focus:text-black focus:font-bold cursor-pointer"
          >
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default CategoryFilter