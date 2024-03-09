import type { Document } from "mongoose";
import { model, Schema } from "mongoose";

interface IGenre {
  name: string;
}

export interface IGerneBaseDocument extends IGenre, Document {
  url: URL;
  checked: boolean;
}

const genreSchema = new Schema<IGerneBaseDocument>({
  name: { type: String, required: true, minLength: 3, maxLength: 100 },
});

genreSchema.virtual("url").get(function (this: IGerneBaseDocument) {
  return "/catalog/genre/" + this._id;
});

genreSchema.virtual("checked").get(function (this: IGerneBaseDocument) {
  return true;
});

export const genre = model("Genre", genreSchema);
