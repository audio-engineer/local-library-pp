import type { Request, Response } from "express";
import type { Document } from "mongoose";
import asyncHandler from "express-async-handler";
import type { Model } from "sequelize-typescript";
import type { IModelRepository } from "../../models/interfaces.js";

export class HandlerRepository<T extends Document | Model> {
  public readonly getAll = asyncHandler(async (req: Request, res: Response) => {
    res.json({ data: await this.modelRepository.getAll() });
  });

  public readonly create = asyncHandler(async (req: Request, res: Response) => {
    res.json({
      data: await this.modelRepository.create(req.body.data as T),
    });
  });

  public readonly deleteAll = asyncHandler(
    async (req: Request, res: Response) => {
      res.json({ data: await this.modelRepository.deleteAll() });
    },
  );

  public readonly getById = asyncHandler(
    async (req: Request, res: Response) => {
      res.json({
        data: await this.modelRepository.getById(req.params.id),
      });
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
      res.json({
        data: await this.modelRepository.deleteById(req.params.id),
      });
    },
  );

  private readonly modelRepository;

  public constructor(modelRepository: IModelRepository<Document | Model>) {
    this.modelRepository = modelRepository;
  }
}
