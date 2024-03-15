import { Router } from "express";
import { Repository } from "../../controllers/api/repository.js";
import type { Document, Model } from "mongoose";

export class ApiRouter<T extends Document> {
  private readonly router;
  private readonly controllerRepository;
  private readonly name;

  public constructor(model: Model<T>, name: string) {
    this.router = Router();
    this.controllerRepository = new Repository(model);
    this.name = name;
  }

  public get routes(): Router {
    this.router.get(`/v1/${this.name}`, this.controllerRepository.getAll);
    this.router.post(`/v1/${this.name}`, this.controllerRepository.create);
    this.router.delete(`/v1/${this.name}`, this.controllerRepository.deleteAll);

    this.router.get(`/v1/${this.name}/:id`, this.controllerRepository.getById);
    this.router.put(
      `/v1/${this.name}/:id`,
      this.controllerRepository.updateById,
    );
    this.router.delete(
      `/v1/${this.name}/:id`,
      this.controllerRepository.deleteById,
    );

    return this.router;
  }
}
