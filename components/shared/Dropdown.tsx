import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { startTransition, useEffect, useState } from "react";
import { Plus } from "lucide-react"; 
import { createCategory, getAllCategories } from "@/lib/actions/category.actions";

type DropdownProps = {
  value?: string;
  onChangeHandler: (value: string) => void;
};

type CategoryOption = {
  _id: string;
  name: string;
};

const Dropdown = ({ value, onChangeHandler }: DropdownProps) => {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [newCategory, setNewCategory] = useState<string>("");

  const handleAddCategory = () => {
    if(!newCategory.trim()) return; 
    
    createCategory({ categoryName: newCategory.trim() }).then((category) => {
      setCategories((prevCategories) => [...prevCategories, category]);
    });
  };

  useEffect(() => {
    const getCategories = async () => {
      const categoryList = await getAllCategories();
      categoryList && setCategories(categoryList);
    };
    getCategories();
  }, []);

  return (
    <Select 
        onValueChange={onChangeHandler} 
        value={value} 
        // FIX: Add a key that changes when categories load. 
        // This forces the component to re-render correctly with the pre-selected value.
        key={categories.length > 0 ? "loaded" : "loading"}
    > 
      <SelectTrigger className="w-full rounded-md h-[54px] px-4 py-3 text-base placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white">
        <SelectValue placeholder="Select Category" />
      </SelectTrigger>

      <SelectContent className="bg-white dark:bg-zinc-900 border-slate-100 dark:border-zinc-800 shadow-xl !z-[50]">
        {categories.length > 0 && categories.map((category) => (
          <SelectItem 
            key={category._id} 
            value={category._id} 
            className="cursor-pointer text-slate-700 dark:text-zinc-300 focus:bg-purple-50 focus:text-purple-700 dark:focus:bg-zinc-800 dark:focus:text-indigo-400 py-3"
          >
            {category.name}
          </SelectItem>
        ))}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="flex w-full cursor-pointer items-center justify-start gap-2 rounded-sm p-3 text-sm font-medium text-purple-600 dark:text-indigo-400 hover:bg-purple-50 dark:hover:bg-zinc-800 hover:text-purple-700 dark:hover:text-indigo-300 transition-colors">
              <Plus className="h-4 w-4" /> Add new category
            </div>
          </AlertDialogTrigger>
          
          <AlertDialogContent className="bg-white dark:bg-zinc-900 dark:border-zinc-800 sm:max-w-[500px]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                New Category
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-500 dark:text-zinc-400">
                Create a new category to organize your events better.
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <div className="my-4">
              <input
                type="text"
                placeholder="e.g., Tech Conference"
                className="w-full rounded-md border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:border-purple-500 focus:bg-white dark:focus:bg-black focus:ring-2 focus:ring-purple-500/20"
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel className="border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-800 dark:hover:text-white">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                onClick={() => startTransition(handleAddCategory)}
              >
                Add Category
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SelectContent>
    </Select>
  );
};

export default Dropdown;