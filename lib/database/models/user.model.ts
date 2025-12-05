import { Schema, model, models, Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  clerkId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  photo: string;
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, required: false, unique: false, trim: true },
    firstName: { type: String, required: false, trim: true },
    lastName: { type: String, required: false, trim: true },
    photo: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.User || model<IUser>("User", UserSchema);
