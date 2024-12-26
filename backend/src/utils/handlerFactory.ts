import { Request, Response } from 'express';
import statusCodes from '../errors/statusCodes';
import * as AppError from '../errors/appError';
import * as utils from '../utils';
import GetRequestAPI, { paginateDetails } from './getRequestAPI';

type CreateOneParams = {
  Model: any;
  label: string;
  includedFields?: string[];
  excludedFields?: string[];
};

type GetOneParams = {
  Model: any;
  label: string;
  populateOption?: { path: string; select?: string };
};

// baseUrl: '/api/v1/users',
//   originalUrl: '/api/v1/users/me'

export const createOne = ({
  Model,
  label,
  includedFields,
  excludedFields,
}: CreateOneParams) => {
  return async (req: Request, res: Response) => {
    const filteredObj = utils.fieldFilter({
      req,
      includedFields,
      excludedFields,
    });

    console.log(filteredObj);

    const newDoc = await Model.create(filteredObj);
    res.status(statusCodes.CREATED).json({
      status: 'success',
      [label]: newDoc,
      message: `${
        label.charAt(0).toUpperCase() + label.slice(1).toLowerCase()
      } created successfully.`,
    });
  };
};

export const getAll = ({ Model, label }: { Model: any; label: string }) => {
  return async (req: Request, res: Response) => {
    // Hack to get reviews on product - for nested get request on review
    let filterObj: any = {};
    if (req.params.productid) filterObj = { product: req.params.productId };

    const getFeatures = new GetRequestAPI(Model.find(filterObj), req.query)
      .filter()
      .sort()
      .limitFields()
      .limitDocuments()
      .paginate();

    const docs = await getFeatures.query;

    // To get the document count using the incoming query except for pagination and limit.
    const queryReq = new GetRequestAPI(Model.find(filterObj), req.query)
      .filter()
      .sort()
      .limitFields();

    const documentCount = await queryReq.query.countDocuments();

    let page;
    if (req.query.page) page = paginateDetails(documentCount, req);
    res
      .status(statusCodes.OK)
      .json({ status: 'success', noHits: docs.length, page, [label]: docs });
  };
};

export const getOne = ({ Model, label, populateOption }: GetOneParams) => {
  return async (req: Request, res: Response) => {
    let query = Model.findById(req.params.id);

    if (populateOption) {
      query = query.populate(populateOption);
    }
    const doc = await query;

    if (!doc) {
      throw new AppError.NotFoundError(
        `We could not find ${label} resource you are looking for.`
      );
    }

    res.status(statusCodes.OK).json({ status: 'success', [label]: doc });
  };
};

export const updateOne = ({
  Model,
  label,
  includedFields,
  excludedFields,
}: CreateOneParams) => {
  return async (req: Request, res: Response) => {
    const filteredObj = utils.fieldFilter({
      req,
      includedFields,
      excludedFields,
    });

    const doc = await Model.findByIdAndUpdate(req.params.id, filteredObj, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      throw new AppError.NotFoundError(
        `We could not find ${label} resource you are looking for.`
      );
    }
    res.status(statusCodes.OK).json({
      status: 'success',
      message: `${
        label.charAt(0).toUpperCase() + label.slice(1)
      } updated successfully.`,
      [label]: doc,
    });
  };
};

export const deleteOne = ({ Model, label }: { Model: any; label: string }) => {
  return async (req: Request, res: Response) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      throw new AppError.NotFoundError(
        `We could not find the ${label} resource you are looking for.`
      );
    }
    await doc.deleteOne();
    res.status(statusCodes.NO_CONTENT).json({ status: 'success' });
  };
};
