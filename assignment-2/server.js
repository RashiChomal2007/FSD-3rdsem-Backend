
const express = require("express");

const app = express();
const PORT = 3000;

// Middleware to read JSON data
app.use(express.json());

// Product categories
const categories = [
    "Electronics",
    "Clothing",
    "Books",
    "Home Appliances",
    "Sports",
    "Accessories",
    "Furniture",
    "Beauty",
    "Groceries",
    "Toys"
];

// Generate 100 products
let products = Array.from({ length: 100 }, (_, index) => ({
    id: index + 1,
    name: `Product ${index + 1}`,
    category: categories[index % categories.length],
    price: (index + 1) * 100,
    stock: (index + 1) * 2,
    description: `This is product number ${index + 1}`
}));

// Welcome route
app.get("/", (req, res) => {
    res.send("Welcome to Express Product REST API");
});

// GET all products
app.get("/api/products", (req, res) => {
    res.json({
        message: "All products fetched successfully",
        total: products.length,
        products: products
    });
});

// GET product by ID
app.get("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);

    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.json(product);
});

// POST - Add a new product
app.post("/api/products", (req, res) => {
    const { name, category, price, stock, description } = req.body;

    if (!name || !category || price === undefined || !Number.isFinite(Number(price)) || Number(price) < 0) {
        return res.status(400).json({
            message: "Please provide a valid name, category and price"
        });
    }

    const newProduct = {
        id: products.length
            ? Math.max(...products.map(p => p.id)) + 1
            : 1,
        name,
        category,
        price: Number(price),
        stock: Number(stock) || 0,
        description: description || "No description available"
    };

    products.push(newProduct);

    res.status(201).json({
        message: "Product added successfully",
        product: newProduct
    });
});

// PUT - Update a product
app.put("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);

    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    const { name, category, price, stock, description } = req.body;

    if (price !== undefined &&
        (!Number.isFinite(Number(price)) || Number(price) < 0)) {
        return res.status(400).json({
            message: "Price must be a valid non-negative number"
        });
    }

    if (name !== undefined) product.name = name;
    if (category !== undefined) product.category = category;
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (description !== undefined) product.description = description;

    res.json({
        message: "Product updated successfully",
        product: product
    });
});

// DELETE - Delete a product
app.delete("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    const deletedProduct = products.splice(index, 1);

    res.json({
        message: "Product deleted successfully",
        product: deletedProduct[0]
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Total products: ${products.length}`);
});
