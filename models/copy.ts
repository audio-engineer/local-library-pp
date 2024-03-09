import type { Document, Types } from "mongoose";
import { model, Schema } from "mongoose";
import { DateTime } from "luxon";
import type { IBookBaseDocument } from "@/models/book.js";
import type { Url } from "node:url";

type Status = "Available" | "Loaned" | "Maintenance" | "Reserved";

interface IBookInstance {
  book: Types.ObjectId;
  imprint: string;
  dueBack: Date | null;
  status: Status;
}

interface IBookInstanceBaseDocument extends IBookInstance, Document {
  url: Url;
  dueBackLocaleString: Date | null;
  dueBackISODate: Date | null;
  availability: string;
}

export interface IBookInstanceDocument extends IBookInstanceBaseDocument {
  book: IBookBaseDocument["_id"];
}

// export interface IBookInstancePopulatedDocument
//   extends IBookInstanceBaseDocument {
//   book: IBook;
// }

const bookInstanceSchema = new Schema<IBookInstanceDocument>({
  book: { type: Schema.ObjectId, ref: "Book", required: true },
  imprint: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["Available", "Maintenance", "Loaned", "Reserved"],
    default: "Maintenance",
  },
  dueBack: { type: Date, default: Date.now },
});

bookInstanceSchema.virtual("url").get(function (
  this: IBookInstanceBaseDocument,
) {
  return "/catalog/book-instance/" + this._id;
});

bookInstanceSchema.virtual("dueBackLocaleString").get(function (
  this: IBookInstanceBaseDocument,
) {
  if (!this.dueBack) {
    return null;
  }

  return DateTime.fromJSDate(this.dueBack).toLocaleString(DateTime.DATE_MED);
});

bookInstanceSchema.virtual("dueBackISODate").get(function (
  this: IBookInstanceBaseDocument,
) {
  if (!this.dueBack) {
    return null;
  }

  return DateTime.fromJSDate(this.dueBack).toISODate();
});

bookInstanceSchema.virtual("availability").get(function (
  this: IBookInstanceBaseDocument,
) {
  switch (this.status) {
    case "Loaned":
      return "table-primary";
    case "Maintenance":
      return "table-secondary";
    case "Available":
      return "table-success";
    case "Reserved":
      return "table-warning";
    default:
      return "table-danger";
  }
});

export const copy = model<IBookInstanceDocument>(
  "Copy",
  bookInstanceSchema,
);
