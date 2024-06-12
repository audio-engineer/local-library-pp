import type { Document } from "mongoose";
import { model, Schema } from "mongoose";
import { DateTime } from "luxon";
import type { Url } from "node:url";

interface IAuthor {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  dateOfDeath: Date | null;
}

export interface IAuthorBaseDocument extends IAuthor, Document {
  url: Url;
  fullName: string;
  lifeSpan: string;
  dateOfBirthISODate: Date;
  dateOfDeathISODate: Date | null;
}

const authorSchema = new Schema<IAuthorBaseDocument>(
  {
    firstName: { type: String, required: true, maxLength: 100 },
    lastName: { type: String, required: true, maxLength: 100 },
    dateOfBirth: { type: Date, required: true },
    dateOfDeath: Date,
  },
  {
    toJSON: { virtuals: true },
  },
);

authorSchema.virtual("fullName").get(function (this: IAuthorBaseDocument) {
  return `${this.lastName} ${this.firstName}`;
});

authorSchema.virtual("url").get(function (this: IAuthorBaseDocument) {
  return `/authors/${this._id}`;
});

authorSchema.virtual("lifeSpan").get(function (this: IAuthorBaseDocument) {
  let lifeSpan = DateTime.fromJSDate(this.dateOfBirth).toLocaleString(
    DateTime.DATE_MED,
  );

  lifeSpan += " - ";

  if (this.dateOfDeath) {
    lifeSpan += DateTime.fromJSDate(this.dateOfDeath).toLocaleString(
      DateTime.DATE_MED,
    );
  }

  return lifeSpan;
});

authorSchema.virtual("dateOfBirthISODate").get(function (
  this: IAuthorBaseDocument,
) {
  return DateTime.fromJSDate(this.dateOfBirth).toISODate();
});

authorSchema.virtual("dateOfDeathISODate").get(function (
  this: IAuthorBaseDocument,
) {
  if (!this.dateOfDeath) {
    return null;
  }

  return DateTime.fromJSDate(this.dateOfDeath).toISODate();
});

export const mongooseAuthor = model("Author", authorSchema);
