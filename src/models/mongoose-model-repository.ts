import type { Document, Model, UpdateQuery } from "mongoose";
import type { DeleteResult, UpdateResult } from "mongodb";

export class MongooseModelRepository<T extends Document> {
  private readonly model;

  public constructor(model: Model<T>) {
    this.model = model;
  }

  public async create(entity: Partial<T>): Promise<T> {
    return this.model.create(entity as T);
  }

  public async getById(id: string): Promise<T | null> {
    return this.model.findById<T>(id, {}).exec();
  }

  public async getAll(): Promise<T[]> {
    return this.model.find({}).exec();
  }

  public async deleteById(id: string): Promise<DeleteResult> {
    return this.model.deleteOne({ _id: id });
  }

  public async deleteAll(): Promise<DeleteResult> {
    return this.model.deleteMany({}).exec();
  }

  public async updateById(
    id: string,
    entity: Partial<T>,
  ): Promise<UpdateResult<T>> {
    return this.model.updateOne({ _id: id }, entity as UpdateQuery<unknown>);
  }
}
