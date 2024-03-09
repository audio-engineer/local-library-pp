import type { Document, Types } from "mongoose";
import { model, Schema } from "mongoose";

interface IBook {
  title: string;
  author: Types.ObjectId;
  summary: string;
  isbn: string;
  genre?: Types.ObjectId[];
}

export interface IBookBaseDocument extends IBook, Document {
  url: URL;
  genre?: Types.Array<Types.ObjectId>;
}

const bookSchema = new Schema<IBookBaseDocument>({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "Author", required: true },
  summary: { type: String, required: true },
  isbn: { type: String, required: true },
  genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
});

bookSchema.virtual("url").get(function (this: IBookBaseDocument) {
  return "/catalog/book/" + this._id;
});

export const book = model("Book", bookSchema);
