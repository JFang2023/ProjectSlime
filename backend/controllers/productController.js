import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';
import OpenAI from "openai";


// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = parseInt(process.env.PAGINATION_LIMIT) || 8;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

const getRecommendedProducts = asyncHandler(async (req, res) => {
  const pageSize = parseInt(process.env.PAGINATION_LIMIT) || 8; // 如果环境变量不存在，则默认为8
  const page = Number(req.query.pageNumber) || 1;

  const products = await Product.find({});
  if (!req.query.keyword) {
    const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    return res.json({ products, page, pages: Math.ceil(count / pageSize) });
  }

  const userRequest = req.query.keyword;

  // 构建产品列表文本，每个产品用分号隔开
  const productsText = products.map(product => `${product.name}`).join("; ");


  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    // 使用chatCompletion端点发送请求
    const prompt = `User interest: ${userRequest}. Products: ${productsText}. Based on the user interest, recommend products.`;
    console.log("Prompt:", prompt);
    const response = await openai.chat.completions.create({
      model: "ft:gpt-3.5-turbo-1106:genaiteam3:slime:9Fnt5QA4", // 根据您的需求选择合适的模型
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant. Given a user interest, recommend products by returning product names separated by semicolons (;). Do not include any extra text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    console.log("GPT Response:", response.choices[0].message.content);

    // 提取GPT的响应，并使用分号分割产品名
    const recommendedProductNames = response.choices[0].message.content.split(';').map(name => name.trim());

    // 使用提取的产品名筛选出推荐的产品
    const recommendedProducts = products.filter(product => recommendedProductNames.includes(product.name));

    const totalProducts = recommendedProducts.length;
    const pages = Math.ceil(totalProducts / pageSize);

    // 计算当前页的产品子集的开始和结束索引
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // 使用.slice方法选择当前页的产品
    const paginatedProducts = recommendedProducts.slice(startIndex, endIndex);

    // 返回分页信息和当前页的产品列表
    return res.json({
      products: paginatedProducts,
      page: page,
      pages: pages
    });
  } catch (error) {
    console.error("Error calling OpenAI Chat API:", error);
    throw new Error("Failed to get product recommendations.");
  }
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  // NOTE: checking for valid ObjectId to prevent CastError moved to separate
  // middleware. See README for more info.

  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  } else {
    // NOTE: this will run if a valid ObjectId but no product was found
    // i.e. product may be null
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getRecommendedProducts,
};