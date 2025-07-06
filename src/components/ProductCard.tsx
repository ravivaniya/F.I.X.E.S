import React from "react";

type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  description?: string;
};

type ProductCardProps = {
  product: Product;
  onAddToCart?: (product: Product) => void;
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: 8,
        padding: 16,
        maxWidth: 300,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        background: "#fff",
      }}
    >
      <img
        src={product.image}
        alt={product.name}
        style={{
          width: "100%",
          height: 180,
          objectFit: "cover",
          borderRadius: 4,
          marginBottom: 12,
        }}
      />
      <h2 style={{ fontSize: 20, margin: "8px 0" }}>{product.name}</h2>
      <p style={{ color: "#888", margin: "8px 0" }}>
        ${product.price.toFixed(2)}
      </p>
      {product.description && (
        <p style={{ fontSize: 14, color: "#555", marginBottom: 12 }}>
          {product.description}
        </p>
      )}
      {onAddToCart && (
        <button
          onClick={() => onAddToCart(product)}
          style={{
            padding: "8px 16px",
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Add to Cart
        </button>
      )}
    </div>
  );
};

export default ProductCard;
