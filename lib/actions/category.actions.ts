'use server'
import { CreateCategoryParams } from "@/types"
import { connectToDatabase } from "../database"
import categoryModel from "../database/models/category.model";
import { handleError } from "../utils";

export const createCategory = async({categoryName}: CreateCategoryParams)=>{
    try {
        await connectToDatabase();
        const newCategory = await categoryModel.create({name: categoryName});

        return JSON.parse(JSON.stringify(newCategory))
    } catch (error) {
        handleError(error);
    }
}
export const getAllCategories = async()=>{
    try {
        await connectToDatabase();
        const Category = await categoryModel.find();

        return JSON.parse(JSON.stringify(Category))
    } catch (error) {
        handleError(error);
    }
}