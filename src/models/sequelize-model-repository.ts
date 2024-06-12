import type { Model } from "sequelize-typescript";
import { sequelize } from "../database/sequelize.js";

export class SequelizeModelRepository<T extends Model> {
  private readonly repository;

  public constructor(modelClass: new () => T) {
    this.repository = sequelize.getRepository(modelClass);
  }

  public async create(entity: Partial<T>): Promise<T | null> {
    try {
      // @ts-expect-error This is most likely a bug and needs to be reported
      return await this.repository.create(entity);
    } catch (error) {
      console.error(error);
    }

    return null;
  }

  public async getById(id: number): Promise<T | null> {
    try {
      return await this.repository.findByPk(id);
    } catch (error) {
      console.error(error);
    }

    return null;
  }

  public async getAll(): Promise<T[] | null> {
    try {
      return await this.repository.findAll();
    } catch (error) {
      console.error(error);
    }

    return null;
  }

  public async deleteById(id: number): Promise<number | null> {
    try {
      return await this.repository.destroy({
        where: { attribute: { id } },
      });
    } catch (error) {
      console.error(error);
    }

    return null;
  }

  public async deleteAll(): Promise<number | null> {
    try {
      return await this.repository.destroy({ where: {} });
    } catch (error) {
      console.error(error);
    }

    return null;
  }

  public async updateById(
    id: number,
    entity: Partial<T>,
  ): Promise<[affectedCount: number, affectedRows: T[]] | null> {
    try {
      return await this.repository.update(entity, {
        where: { attribute: { id } },
        returning: true,
      });
    } catch (error) {
      console.error(error);
    }

    return null;
  }
}
