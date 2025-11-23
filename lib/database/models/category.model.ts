import { Schema, model, models, Document, Types } from "mongoose";

export interface ICategory extends Document {
  _id: Types.ObjectId;
  name: string;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
  }
);

export default models.Category || model<ICategory>("Category", CategorySchema);
