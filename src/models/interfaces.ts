import type { Model } from "sequelize-typescript";
import type { Document } from "mongoose";
import type { DeleteResult, UpdateResult } from "mongodb";

export interface IModelRepository<T extends Document | Model> {
  create: (entity: Partial<T>) => Promise<T | null> | Promise<T>;
  getById: (id: string) => Promise<T | null>;
  getAll: () => Promise<T[] | null>;
  deleteById: (id: string) => Promise<DeleteResult> | Promise<number>;
  deleteAll: () => Promise<DeleteResult> | Promise<number>;
  updateById: (
    id: string,
    entity: Partial<T>,
  ) => Promise<T | null> | Promise<UpdateResult<T>>;
}
