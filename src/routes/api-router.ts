import { Router } from "express";
import { HandlerRepository } from "../controllers/api/handler-repository.js";
import type { Document } from "mongoose";
import type { Model } from "sequelize-typescript";
import type { SequelizeModelRepository } from "../models/sequelize-model-repository.js";
import type { MongooseModelRepository } from "../models/mongoose-model-repository.js";

export class ApiRouter<T extends Document> {
  private readonly router = Router();
  private readonly handlerRepository;
  private readonly path;

  public constructor(
    path: string,
    modelRepository:
      | MongooseModelRepository<T>
      | SequelizeModelRepository<Model>,
  ) {
    this.path = path;
    this.handlerRepository = new HandlerRepository(modelRepository);
  }

  public get routes(): Router {
    this.router.get(`/v1/${this.path}`, this.handlerRepository.getAll);
    this.router.post(`/v1/${this.path}`, this.handlerRepository.create);
    this.router.delete(`/v1/${this.path}`, this.handlerRepository.deleteAll);

    this.router.get(`/v1/${this.path}/:id`, this.handlerRepository.getById);
    this.router.put(`/v1/${this.path}/:id`, this.handlerRepository.updateById);
    this.router.delete(
      `/v1/${this.path}/:id`,
      this.handlerRepository.deleteById,
    );

    return this.router;
  }
}
