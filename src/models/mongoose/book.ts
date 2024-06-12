import type { Document, Types } from "mongoose";
import { model, Schema } from "mongoose";

interface IBook {
  title: string;
  author: Types.ObjectId;
  summary: string;
  isbn: string;
  genres?: Types.ObjectId[];
  copies?: Types.ObjectId[];
}

export interface IBookBaseDocument extends IBook, Document {
  url: URL;
  genres?: Types.Array<Types.ObjectId>;
  copies?: Types.Array<Types.ObjectId>;
}

const bookSchema = new Schema<IBookBaseDocument>(
  {
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "Author", required: true },
    summary: { type: String, required: true },
    isbn: { type: String, required: true },
    genres: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
    copies: [{ type: Schema.Types.ObjectId, ref: "Copy" }],
  },
  {
    toJSON: { virtuals: true },
  },
);

bookSchema.virtual("url").get(function (this: IBookBaseDocument) {
  return `/books/${this._id}`;
});

export const mongooseBook = model("Book", bookSchema);
