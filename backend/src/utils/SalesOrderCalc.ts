import { Request } from 'express';
import * as AppError from '../errors/appError';

export const calculateOrderMetrics = async (req: Request, Model: any) => {
  // Declare variables to calculate  the total costs
  let subtotal = 0;
  let discount = 0;
  let totalCost = 0;

  // Calculating order totals
  for (const item of JSON.parse(req.body.orders)) {
    if (!item.product || !item.size || !item.color) {
      throw new AppError.BadRequestError(
        'Please fill all required fields in the order lines.'
      );
    }
    // Get current product in the loop as we do not want to rely on pricing from frontend to prevent manupulation.
    const currentProduct = await Model.findById(item.product);
    // Calculate total selling price which will be subtotal.
    if (currentProduct?.sellingPrice) {
      subtotal += currentProduct.sellingPrice * item.quantity;
    }

    // Calculate total cost for the incomeing order.
    if (currentProduct?.costPrice) {
      totalCost += currentProduct.costPrice * item.quantity;
    }

    // Calculate the total discount given on the order.
    if (currentProduct?.discountPrice && currentProduct?.sellingPrice) {
      discount +=
        (currentProduct.sellingPrice - currentProduct.discountPrice) *
        item.quantity;
    }
  }

  return { subtotal, discount, totalCost };
};
