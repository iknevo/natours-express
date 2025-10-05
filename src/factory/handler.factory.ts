import { APIFeatures } from "@/utils/api-features";
import { AppError } from "@/utils/app-error";
import { catchHandler } from "@/utils/catch-handler";
import { NextFunction, Request, Response } from "express";
import { status } from "http-status";
import { Model, PopulateOptions } from "mongoose";

export function getOne<T>(
  model: Model<T>,
  populateOptions?: PopulateOptions | (string | PopulateOptions)[],
) {
  const name = model.modelName.toLowerCase();
  return catchHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      let query = model.findById(id);
      if (populateOptions) query = query.populate(populateOptions);
      const doc = await query;
      if (!doc) {
        return next(new AppError("Document not found", status.NOT_FOUND));
      }
      res.status(status.OK).json({
        status: { success: true, code: status.OK },
        data: { [name]: doc },
      });
    },
  );
}

export function getAll<T>(model: Model<T>) {
  const name = model.collection.name.toLowerCase();
  return catchHandler(async (req: Request, res: Response) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const features = new APIFeatures(model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const docs = await features.query;
    res.status(status.OK).json({
      status: { success: true, code: status.OK },
      numItem: docs.length,
      data: { [name]: docs },
    });
  });
}

export function deleteOne<T>(model: Model<T>) {
  return catchHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const document = await model.findByIdAndDelete(id);
      if (!document) {
        return next(new AppError("Document not found", status.NOT_FOUND));
      }
      res.status(status.NO_CONTENT).json({
        status: { code: status.NO_CONTENT, success: true },
        data: null,
      });
    },
  );
}

export function createOne<T>(model: Model<T>) {
  const name = model.modelName.toLowerCase();
  return catchHandler(async (req: Request, res: Response) => {
    const doc = await model.create(req.body);
    res.status(status.CREATED).json({
      status: { success: true, code: status.CREATED },
      data: { [name]: doc },
    });
  });
}

export function updateOne<T>(model: Model<T>) {
  const name = model.modelName.toLowerCase();
  return catchHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const doc = await model.findByIdAndUpdate(id, req.body, {
        // to return the new updated tour
        new: true,
        runValidators: true,
      });
      if (!doc) {
        return next(new AppError("Document not found", status.NOT_FOUND));
      }
      res.status(status.OK).json({
        status: { code: status.OK, success: true },
        data: { [name]: doc },
      });
    },
  );
}
