import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "./Button"
import { Input } from "./Input"
import { Card, CardContent } from "./Card"
import { Select } from "./Select"
import { IProduct, ICategory } from "../types/backend"

const myCategories = ["All", "Electronics", "Books", "Clothing", "Home"];
const tagOptions = ["New", "Popular", "Discount", "Limited"];
const ratings = ["All", "1+", "2+", "3+", "4+", "5"];

const mockCategories: ICategory[] = Array.from({ length: 4 }).map((_, index) => ({
  id:index,
  name:myCategories[index % 4 + 1],
  description: 'This is a short description of the category',
}))

const mockProducts: IProduct[] = Array.from({ length: 200 }).map((_, index) => ({
  id: index,
  name: `Product ${index + 1}`,
  flowerStatus: index % 3,
  description: `This is a short description of Product ${index + 1}.`,
  basePrice: Math.floor(Math.random() * 1000),
  condition: ["New", "Used", "Refurbished"][index % 3],
  stockQuantity: index % 10 === 0 ? 0 : Math.floor(Math.random() * 50) + 1,
  isActive: index % 5 !== 0,
  imagesUrls: [`https://picsum.photos/seed/${index}/300/200`],
  categories: [mockCategories[index % 4]],
}));

const PRODUCTS_PER_PAGE = 20;

export default function ProductListingsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name-asc");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    let filtered = mockProducts;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(p => p.categories.some(c => c.name === selectedCategory));

    }

    if (search.trim()) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(p => selectedTags.every(tag => p.condition?.includes(tag)));
    }

    if (minRating > 0) {
      filtered = filtered.filter(p => p.flowerStatus >= minRating);
    }

    if (showOnlyAvailable) {
      filtered = filtered.filter(p => p.stockQuantity > 0);
    }

    if (sortBy === "name-asc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === "price-asc") {
      filtered.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortBy === "price-desc") {
      filtered.sort((a, b) => b.basePrice - a.basePrice);
    }

    setProducts(filtered);
  }, [search, selectedCategory, sortBy, selectedTags, minRating, showOnlyAvailable]);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = products.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Browse Products</h1>
      <div className="flex flex-wrap gap-4 mb-6">
        <Input
          label="Search..."
          type="text"
          //placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Select
          label="Category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          options={myCategories.map((cat) => ({ value: cat, label: cat }))}
        />

        <Select
          label="Sort By"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          options={[
            { value: "name-asc", label: "Name (A-Z)" },
            { value: "name-desc", label: "Name (Z-A)" },
            { value: "price-asc", label: "Price (Low-High)" },
            { value: "price-desc", label: "Price (High-Low)" },
          ]}
        />

        <Select
          label="Minimum Rating"
          value={minRating.toString()}
          onChange={(e) => setMinRating(Number(e.target.value))}
          options={ratings.map((r) => ({
            value: r === "All" ? "0" : r[0],
            label: `${r} Stars`,
          }))}
        />
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={showOnlyAvailable} onChange={e => setShowOnlyAvailable(e.target.checked)} />
          <span className="text-sm">In Stock Only</span>
        </label>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {tagOptions.map(tag => (
          <Button
            key={tag}
            //variant={selectedTags.includes(tag) ? "default" : "outline"}
            onClick={() =>
              setSelectedTags(prev =>
                prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
              )
            }
          >
            {tag}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginatedProducts.map(product => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="rounded-2xl shadow-lg hover:shadow-xl transition">
              <img
                src={product.imagesUrls[0]}
                alt={product.name}
                className="rounded-t-2xl object-cover h-48 w-full"
              />
              <CardContent className="p-4 space-y-2">
                <h2 className="text-lg font-semibold truncate">{product.name}</h2>
                <p className="text-sm text-gray-500 truncate">{product.description}</p>
                <p className="text-blue-600 font-bold">${product.basePrice.toFixed(2)}</p>
                <p className="text-xs text-yellow-500">Status: {product.flowerStatus} / 5</p>
                {product.stockQuantity === 0 && <p className="text-red-600 text-sm">Out of Stock</p>}
                <Button className="w-full" onClick={() => navigate(`/products/${product.id}`)}>View Details</Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center mt-8 gap-2">
        <Button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
        <span className="px-4 py-2">Page {page} of {totalPages}</span>
        <Button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
      </div>
    </div>
  );
}
