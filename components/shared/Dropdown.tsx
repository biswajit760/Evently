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
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { createCategory, getAllCategories } from "@/lib/actions/category.actions";
import { ICategory } from "@/lib/database/models/category.model";

type DropdownProps = {
  value?: string;
  onChangeHandler: (value: string) => void;
};

// ⭐ UI-only type (no ObjectId issues)
type CategoryOption = {
  _id: string;
  name: string;
};

const Dropdown = ({ value, onChangeHandler }: DropdownProps) => {
  const [categories, setCategories] = useState<CategoryOption[]>([
    // { _id: "1", name: "Category 1" },
    // { _id: "2", name: "Category 2" },
    // { _id: "3", name: "Category 3" },
  ]);
  const [newCategory, setNewCategory] = useState<string>("");

  const handleAddCategory = () => {
    createCategory({ categoryName: newCategory.trim() }).then((category)=>{
      setCategories((prevCategories) => [...prevCategories, category]);
    });
  };

useEffect(()=>{
  const getCategories = async()=>{
    const categoryList = await getAllCategories();
    categoryList && setCategories(categoryList);
  }
  getCategories();
},[])

  return (
    <Select onValueChange={onChangeHandler} defaultValue={value}>
      <SelectTrigger className="select-field">
        <SelectValue placeholder="Category" />
      </SelectTrigger>

      <SelectContent className="bg-white">
        {categories.map((category) => (
          <SelectItem key={category._id} value={category._id}>
            {category.name}
          </SelectItem>
        ))}
        <AlertDialog>
          <AlertDialogTrigger
            asChild
            className="p-medium-14 flex w-full rounded-sm py-3 pl-8 bg-amber-50"
          >
            <Button variant="outline">Add Category</Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to add a new category?
              </AlertDialogTitle>
              <AlertDialogDescription>
                <Input
                  type="text"
                  placeholder="Category Name"
                  className="input-field mt-3"
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => startTransition(handleAddCategory)}
              >
                Add
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SelectContent>
    </Select>
  );
};

export default Dropdown;
