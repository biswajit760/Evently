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
import { Plus } from "lucide-react"; // Optional: Add an icon for better UX
import { createCategory, getAllCategories } from "@/lib/actions/category.actions";

// Keep your types defined
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
    if(!newCategory.trim()) return; // Prevent empty adds
    
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
    <Select onValueChange={onChangeHandler} defaultValue={value}>
      <SelectTrigger className="select-field w-full bg-slate-50 border-slate-200 focus:ring-purple-500 focus:ring-offset-0">
        <SelectValue placeholder="Select Category" />
      </SelectTrigger>

      <SelectContent className="bg-white border-slate-100 shadow-xl !z-[50]">
        {categories.length > 0 && categories.map((category) => (
          <SelectItem key={category._id} value={category._id} className="cursor-pointer focus:bg-purple-50 focus:text-purple-700">
            {category.name}
          </SelectItem>
        ))}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            {/* Styled Trigger Button inside the dropdown */}
            <div className="flex w-full cursor-pointer items-center justify-start gap-2 rounded-sm p-3 text-sm font-medium text-purple-600 hover:bg-purple-50 hover:text-purple-700 transition-colors">
              <Plus className="h-4 w-4" /> Add new category
            </div>
          </AlertDialogTrigger>
          
          <AlertDialogContent className="bg-white sm:max-w-[500px]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold text-slate-900">
                New Category
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-500">
                Create a new category to organize your events better.
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            {/* Input Section */}
            <div className="my-4">
              <input
                type="text"
                placeholder="e.g., Tech Conference"
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20"
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel className="border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500"
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