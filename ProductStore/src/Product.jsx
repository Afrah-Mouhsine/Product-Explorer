import { useEffect, useState } from "react";
import "./Product.css";

export default function ProductList() {
  const [productList, setProductList] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // Added state for selected category

  // Fetch products and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await fetch(
          "https://fakestoreapi.com/products"
        );
        const productsData = await productsResponse.json();
        setProductList(productsData);

        const categoriesResponse = await fetch(
          "https://fakestoreapi.com/products/categories"
        );
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Handle search input change
  const handleSearch = (e) => {
    e.preventDefault();
    const inputValue = e.target.previousElementSibling.value; // Get the input value
    setSearchInput(inputValue);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchInput("");
  };

  // Filter products based on search input and selected category
  const filteredProducts = productList.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchInput.toLowerCase()) ||
      product.id.toString().includes(searchInput) ||
      product.description.toLowerCase().includes(searchInput.toLowerCase());

    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Handle category button click
  const handleCategoryClick = (category) => {
    setSelectedCategory(category); // Set selected category
  };

  return (
    <div className="container">
      <h1 className="title">Product Search</h1>

      {/* Search Form */}
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="search-container">
          <input
            type="text"
            id="searchInput"
            placeholder="Search by title, ID, or description..."
            className="search-input"
          />
          <button
            type="submit"
            onClick={handleSearch}
            className="search-button"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleClearSearch}
            className="clear-button"
          >
            Clear
          </button>
        </div>
      </form>

      <hr />

      {/* Categories */}
      <h2 className="subtitle">Categories</h2>
      <div className="categories-container">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-button ${
              selectedCategory === category ? "selected" : ""
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
        {/* Add a button to clear the category filter */}
        <button
          className={`category-button ${!selectedCategory ? "selected" : ""}`}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
      </div>

      <hr />

      {/* Product Table */}
      <table className="product-table">
        <thead>
          <tr>
            <th>#ID</th>
            <th>Title</th>
            <th>Price</th>
            <th>Description</th>
            <th>Category</th>
            <th>Image</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.title}</td>
              <td>${product.price}</td>
              <td>{product.description.slice(0, 150)}...</td>
              <td>{product.category}</td>
              <td>
                <img
                  src={product.image}
                  alt={product.title}
                  className="product-image"
                />
              </td>
              <td>
                {product.rating.rate} / {product.rating.count}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
