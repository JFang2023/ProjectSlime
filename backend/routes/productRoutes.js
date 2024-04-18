import express from 'express';
const router = express.Router();
import {
  getRecommendedProducts,
  getProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

//router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/').get(getRecommendedProducts).post(protect, admin, createProduct);
router.route('/:id/reviews').post(protect, checkObjectId, createProductReview);
router.get('/top', getTopProducts);

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
router.route('/category/:category').get(getProductsByCategory);

router
  .route('/:id')
  .get(checkObjectId, getProductById)
  .put(protect, admin, checkObjectId, updateProduct)
  .delete(protect, admin, checkObjectId, deleteProduct);

export default router;
