"use client";
import { useState } from "react";
import "./App.css";
import headphoneImg from "./assets/Headphone.jpg";
import laptopImg from "./assets/LaptopStand.jpg";
import cableImg from "./assets/Usb-cable.jpg";
import keyboardImg from "./assets/Mechanical.jpg";
import PhoneHolder from "./assets/PhoneHolder.jpg";
import cameraImg from "./assets/Camera.jpg";

const defaultProducts = [
  {
    id: 1,
    name: "Wireless Headphones Pro",
    category: "Electronics",
    image: headphoneImg,
    price: 79.99,
    stock: 15,
    rating: 4.5,
    description:
      "Premium wireless headphones with active noise cancellation and 30-hour battery life.",
    specs: "Bluetooth 5.0, 30-hour battery, Active Noise Cancellation, Foldable design",
  },
  {
    id: 2,
    name: "Laptop Stand",
    category: "Accessories",
    image: laptopImg,
    price: 49.99,
    stock: 10,
    rating: 4.8,
    description: "Adjustable aluminum stand for laptops up to 17 inches.",
    specs: "Adjustable height, Foldable, Lightweight aluminum build",
  },
  {
    id: 3,
    name: "USB-C Cable",
    category: "Cables",
    image: cableImg,
    price: 12.99,
    stock: 6,
    rating: 4.6,
    description: "Durable nylon braided USB-C cable with fast charging support.",
    specs: "1.5m length, 60W PD support, braided protection",
  },
  {
    id: 4,
    name: "Mechanical Keyboard",
    category: "Electronics",
    image: keyboardImg,
    price: 129.99,
    stock: 4,
    rating: 4.7,
    description: "RGB backlit mechanical keyboard with blue switches.",
    specs: "RGB lighting, Blue switches, Detachable cable",
  },
  {
    id: 5,
    name: "Camera",
    category: "Accessories",
    image: cameraImg,
    price: 89.99,
    stock: 1,
    rating: 4.4,
    description: "Compact digital camera with 20MP lens and 1080p recording.",
    specs: "20MP lens, 1080p video, 3x optical zoom",
  },
  {
    id: 6,
    name: "Phone Mount",
    category: "Accessories",
    image: PhoneHolder,
    price: 24.99,
    stock: 8,
    rating: 4.3,
    description: "Flexible phone mount ideal for desks and cars.",
    specs: "360° rotation, Adjustable grip, Strong suction base",
  },
];

export default function App() {
  const [products, setProducts] = useState(defaultProducts);
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleQuantityChange = (productId, delta, stock) => {
    setQuantities((prev) => {
      const current = prev[productId] || 0;
      const newQty = Math.min(Math.max(current + delta, 0), stock);
      return { ...prev, [productId]: newQty };
    });
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 0;
    if (quantity <= 0) return;

    const existing = cartItems.find((i) => i.id === product.id);
    if (existing) {
      setCartItems(
        cartItems.map((i) =>
          i.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity }]);
    }

    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id
          ? { ...p, stock: Math.max(0, p.stock - quantity) }
          : p
      )
    );

    setQuantities((prev) => ({ ...prev, [product.id]: 0 }));
  };

  const handleRemoveFromCart = (id) => {
    const itemToRemove = cartItems.find((i) => i.id === id);
    if (itemToRemove) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, stock: p.stock + itemToRemove.quantity }
            : p
        )
      );
    }
    setCartItems(cartItems.filter((i) => i.id !== id));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="app">
      <header className="app-header">
        <h1>Product Manager</h1>
      </header>

      <div className="content">
        <div className="product-list">
          {products.map((product) => {
            const quantity = quantities[product.id] || 0;
            const isPlusDisabled =
              product.stock === 0 || quantity >= product.stock;
            return (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  {product.stock <= 1 && (
                    <span className="stock-badge">Low Stock</span>
                  )}
                </div>
                <h3>{product.name}</h3>
                <p className="category">{product.category}</p>
                <p className="price">${product.price.toFixed(2)}</p>
                <p className="rating">★ {product.rating}</p>
                <p
                  className={`stock-info ${
                    product.stock < 5 ? "danger" : "safe"
                  }`}
                >
                  Stocks: {product.stock}
                </p>

                <div className="quantity-control">
                  <span>Quantity:</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(product.id, -1, product.stock)
                    }
                    disabled={quantity <= 0}
                  >
                    −
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(product.id, 1, product.stock)
                    }
                    disabled={isPlusDisabled}
                  >
                    +
                  </button>
                </div>

                <p className="subtotal">
                  Subtotal: ${(quantity * product.price).toFixed(2)}
                </p>

                <div className="action-buttons">
                  <button
                    className="add"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="details"
                    onClick={() => setSelectedProduct(product)}
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* CART */}
        <aside className="cart">
          <h2>Shopping Cart</h2>
          {cartItems.length === 0 && <p>No items yet.</p>}
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-info">
                <p className="cart-name">{item.name}</p>
                <p className="cart-price">
                  ${item.price.toFixed(2)} × {item.quantity}
                </p>
              </div>
              <p className="cart-subtotal">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <button
                className="remove"
                onClick={() => handleRemoveFromCart(item.id)}
              >
                ✕
              </button>
            </div>
          ))}
          <div className="cart-summary">
            <p>
              <strong>Items:</strong> {cartItems.length}
            </p>
            <p>
              <strong>Total:</strong>{" "}
              <span className="total">${total.toFixed(2)}</span>
            </p>
          </div>
        </aside>
      </div>

      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedProduct(null)}
            >
              ✕
            </button>
            <h2>{selectedProduct.name}</h2>
            <span className="category">{selectedProduct.category}</span>
            <div className="modal-body">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="modal-img"
              />
              <div className="modal-details">
                <p className="price">${selectedProduct.price.toFixed(2)}</p>
                <p className="rating">
                  ★ {selectedProduct.rating} (Customer Rating)
                </p>
                <h4>Description</h4>
                <p>{selectedProduct.description}</p>
                <h4>Specifications</h4>
                <p>{selectedProduct.specs}</p>
                <p
                  className={`stock-info ${
                    selectedProduct.stock < 5 ? "danger" : "safe"
                  }`}
                >
                  Available Stock: {selectedProduct.stock} units
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
