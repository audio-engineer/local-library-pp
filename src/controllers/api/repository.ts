import type { Request, Response } from "express";
import type { Document, Model } from "mongoose";
import { Repository as ModelRepository } from "../../models/repository.js";
import asyncHandler from "express-async-handler";

export class Repository<T extends Document> {
  public readonly getAll = asyncHandler(async (req: Request, res: Response) => {
    res.json({ data: await this.modelRepository.getAll() });
  });

  public readonly create = asyncHandler(async (req: Request, res: Response) => {
    res.json({ data: await this.modelRepository.create(req.body.data as T) });
  });

  public readonly deleteAll = asyncHandler(
    async (req: Request, res: Response) => {
      res.json({ data: await this.modelRepository.deleteAll() });
    },
  );

  public readonly getById = asyncHandler(
    async (req: Request, res: Response) => {
      res.json({ data: await this.modelRepository.getById(req.params.id) });
    },
  );

  public readonly updateById = asyncHandler(
    async (req: Request, res: Response) => {
      res.json({
        data: await this.modelRepository.updateById(
          req.params.id,
          req.body.data as T,
        ),
      });
    },
  );

  public readonly deleteById = asyncHandler(
    async (req: Request, res: Response) => {
      res.json({ data: await this.modelRepository.deleteById(req.params.id) });
    },
  );

  private readonly modelRepository;

  public constructor(model: Model<T>) {
    this.modelRepository = new ModelRepository<T>(model);
  }
}
