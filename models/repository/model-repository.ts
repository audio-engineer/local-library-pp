import type { Document, Model } from "mongoose";
import type { DeleteResult, UpdateResult } from "mongodb";

export interface IModelRepository<T extends Document> {
  create: (entity: T) => Promise<T>;
  update: (entity: T) => Promise<UpdateResult<T>>;
  deleteById: (entity: T) => Promise<DeleteResult>;
  getAll: () => Promise<T[]>;
  deleteAll: () => Promise<DeleteResult>;
  getById: (id: string) => Promise<T | null>;
}

export class ModelRepository<T extends Document>
  implements IModelRepository<T>
{
  private readonly model;

  public constructor(model: Model<T>) {
    this.model = model;
  }

  public async create(entity: T): Promise<T> {
    return this.model.create(entity);
  }

  public async deleteById(entity: T): Promise<DeleteResult> {
    return this.model.deleteOne({ _id: entity.id }).exec();
  }

  public async update(entity: T): Promise<UpdateResult<T>> {
    return this.model.updateOne({ _id: entity._id }, {}).exec();
  }

  public async getAll(): Promise<T[]> {
    return this.model.find({});
  }

  public async deleteAll(): Promise<DeleteResult> {
    return this.model.deleteMany({}).exec();
  }

  public async getById(id: string): Promise<T | null> {
    return this.model.findById<T>(id, {}).exec();
  }
}
