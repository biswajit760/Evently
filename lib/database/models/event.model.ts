import { Document, Schema, model, models, Types } from "mongoose";

export interface IEvent extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  location?: string;
  imageUrl: string;
  startDateTime: Date;
  endDateTime: Date;
  price: number;
  isFree: boolean;
  url?: string;
  category: Types.ObjectId;
  organizer: Types.ObjectId;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    imageUrl: { type: String, required: true },
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },
    price: { type: Number, default: 0 },
    isFree: { type: Boolean, default: false },
    url: { type: String },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    organizer: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default models.Event || model<IEvent>("Event", EventSchema);
