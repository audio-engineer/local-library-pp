import type { Document } from "mongoose";
import { model, Schema } from "mongoose";

interface IGenre {
  name: string;
}

export interface IGerneBaseDocument extends IGenre, Document {
  url: URL;
  checked: boolean;
}

const genreSchema = new Schema<IGerneBaseDocument>(
  {
    name: { type: String, required: true, minLength: 3, maxLength: 100 },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

genreSchema.virtual("url").get(function (this: IGerneBaseDocument) {
  return `/genres/${this._id}`;
});

genreSchema.virtual("checked").get(function (this: IGerneBaseDocument) {
  return true;
});

export const mongooseGenre = model("Genre", genreSchema);
