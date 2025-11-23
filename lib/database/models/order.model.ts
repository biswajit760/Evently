import { Schema, model, models, Document, Types } from "mongoose";

export interface IOrder extends Document {
  _id: Types.ObjectId;
  createdAt: Date;
  stripeId: string;
  totalAmount: number;
  event: Types.ObjectId;
  buyer: Types.ObjectId;
}

const OrderSchema = new Schema<IOrder>(
  {
    stripeId: { type: String, required: true, unique: true },
    totalAmount: { type: Number, required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default models.Order || model<IOrder>("Order", OrderSchema);
