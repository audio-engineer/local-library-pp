import { Router } from "express";
import { ControllerRepository } from "@/controllers/api/controller-repository.js";

export interface IGenericApiRouter {
  get routes(): Router;
}

export class ApiRouter implements IGenericApiRouter {
  private readonly router: Router;
  private readonly controllerRepository;

  public constructor() {
    this.router = Router();
    this.controllerRepository = new ControllerRepository();
  }

  public get routes(): Router {
    const { router } = this;

    router.get(`/v1/authors`, this.controllerRepository.getAll);
    router.post("/v1/authors", this.controllerRepository.create);
    router.delete("/v1/authors", this.controllerRepository.deleteAll);

    router.get("/v1/authors/:id", this.controllerRepository.getById);
    router.put("/v1/authors/:id", this.controllerRepository.update);
    router.delete("/v1/authors/:id", this.controllerRepository.deleteById);

    return router;
  }
}

const apiRouter = new ApiRouter();
