import type { Document, Types } from "mongoose";
import { model, Schema } from "mongoose";
import { DateTime } from "luxon";
import type { Url } from "node:url";

type Status = "Available" | "Loaned" | "Maintenance" | "Reserved";

interface ICopy {
  book: Types.ObjectId;
  imprint: string;
  dueBack: Date | null;
  status: Status;
}

interface ICopyBaseDocument extends ICopy, Document {
  url: Url;
  dueBackLocaleString: Date | null;
  dueBackISODate: Date | null;
  availability: string;
}

// export interface ICopyDocument extends ICopyBaseDocument {
//   book: IBookBaseDocument["_id"];
// }

// export interface IBookInstancePopulatedDocument
//   extends ICopyBaseDocument {
//   book: IBook;
// }

const copySchema = new Schema<ICopyBaseDocument>({
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

copySchema.virtual("url").get(function (this: ICopyBaseDocument) {
  return `/copies/${this._id}`;
});

copySchema.virtual("dueBackLocaleString").get(function (
  this: ICopyBaseDocument,
) {
  if (!this.dueBack) {
    return null;
  }

  return DateTime.fromJSDate(this.dueBack).toLocaleString(DateTime.DATE_MED);
});

copySchema.virtual("dueBackISODate").get(function (this: ICopyBaseDocument) {
  if (!this.dueBack) {
    return null;
  }

  return DateTime.fromJSDate(this.dueBack).toISODate();
});

copySchema.virtual("availability").get(function (this: ICopyBaseDocument) {
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

export const mongooseCopy = model("Copy", copySchema);
