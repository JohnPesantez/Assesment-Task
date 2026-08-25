import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const API_URL = "http://localhost:8000";
  function ProductImage({ src, alt }) {
    const [loaded, setLoaded] = useState(false);

    return (
      <div className={`image-container ${loaded ? "loaded" : ""}`}>
        {!loaded && <div className="skeleton-image"></div>}

        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
      </div>
    );
  }
  const getProducts = async () => {
    const response = await fetch(`${API_URL}/get_items.php`);

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await response.json();
    console.log("Full data:", data);
    console.log("product_arr:", data.product_arr);
    console.log("Is array:", Array.isArray(data.product_arr));
    console.log("Products:", data);
    return data.product_arr;
  };
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("");
  

  const displayedProducts = products
    .sort((a, b) => {
      if (!sortBy) return 0;

      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === "price") {
        return a.price - b.price;
      }

      if (sortBy === "review") {
        return a.reviews - b.reviews;
      }
      if (sortBy === "saving") {
        const aSaving = a.was_price !== false ? a.was_price - a.price : 0;

        const bSaving = b.was_price !== false ? b.was_price - b.price : 0;

        return aSaving - bSaving;
      }

      return 0;
    });
  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container">
        <h3 className="title">Office Essentials</h3>

        <section className="products">
          {Array.from({ length: 12 }).map((_, index) => (
            <article className="product-card skeleton-card" key={index}>
              <div className="skeleton-image"></div>
              <div className="skeleton-title"></div>
              <div className="skeleton-price"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-button"></div>
            </article>
          ))}
        </section>
      </div>
    );
  }

  if (error) {
    return <p>Unable to load products.</p>;
  }
  const sortOptions = ["Price", "Review", "Name", "Saving"];
  return (
    <div className="container">
      <h3 className="title">Office Essentials</h3>
      <div>
        <div className="sort-buttons">
          {sortOptions.map((option) => (
            <button
              key={option}
              className={sortBy === option.toLowerCase() ? "active" : ""}
              onClick={() => setSortBy(option.toLowerCase())}
            >
              Sort By {option}
            </button>
          ))}
        </div>
      </div>
      <div className="mobile-sort">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="">Sort by</option>
          {sortOptions.map((option) => (
            <option value={option.toLowerCase()}>{option}</option>
          ))}
        </select>
      </div>

      <section className="products">
        {displayedProducts.length === 0 ? (
          <div className="no-results">
            <p>No products found.</p>
          </div>
        ) : (
          displayedProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <ProductImage
                src={`${API_URL}/img/${product.img}.jpg`}
                alt={product.name}
              />
              <h4 className="product-title">{product.name}</h4>
              <p>£{product.price.toFixed(2)}</p>
              <p className="product-text">
                {product.was_price !== false && (
                  <>
                    Was{" "}
                    <span className="old-price">
                      £{product.was_price.toFixed(2)}
                    </span>
                  </>
                )}
              </p>
              <p className="product-text text-green">
                {product.reviews !== false &&
                  `${product.reviews}% Review Score`}
              </p>
              <button className="add-to-cart">Add to Basket</button>
            </article>
          ))
        )}
      </section>
    </div>
  );
}

export default App;
