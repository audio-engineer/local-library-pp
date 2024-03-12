import { ModelRepository } from "@/models/repository/model-repository.js";
import { author, type IAuthorBaseDocument } from "@/models/author.js";
import type { Request, RequestHandler, Response } from "express";

export interface IControllerRepository {
  create: RequestHandler;
  update: RequestHandler;
  deleteById: RequestHandler;
  getAll: RequestHandler;
  deleteAll: RequestHandler;
  getById: RequestHandler;
}

export class ControllerRepository implements IControllerRepository {
  private readonly modelRepository;

  public constructor() {
    this.modelRepository = new ModelRepository<IAuthorBaseDocument>(
      new author<IAuthorBaseDocument>(),
    );
  }

  public create(req: Request, res: Response): void {
    res.json(this.modelRepository.getById(req.params.id));
  }

  public deleteAll(req: Request, res: Response): void {
    res.json(this.modelRepository.getById(req.params.id));
  }

  public deleteById(req: Request, res: Response): void {
    res.json(this.modelRepository.getById(req.params.id));
  }

  public getAll(req: Request, res: Response): void {
    res.json(this.modelRepository.getById(req.params.id));
  }

  public update(req: Request, res: Response): void {
    res.json(this.modelRepository.getById(req.params.id));
  }

  public getById(req: Request, res: Response): void {
    res.json(this.modelRepository.getById(req.params.id));
  }
}
