import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { getPopularProducts, getRecommendationsForUser } from "../config/api";
import { IProduct } from "../types/backend";
import "./Chatbot.css";

interface Message {
  from: "bot" | "user";
  text: string | JSX.Element;
  type?: "text" | "products";
  products?: IProduct[];
}

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [popularProducts, setPopularProducts] = useState<IProduct[]>([]);
  const [messages, setMessages] = useState<Message[]>(
    [{ from: "bot", text: "Hi there! How can I assist you today?" }]
  );

  const isLoggedIn = () => {
    const user = localStorage.getItem('user');
    return user && user !== 'null';
  };

  // Fetch popular products when chatbot opens
  useEffect(() => {
    if (open && popularProducts.length === 0) {
      fetchPopularProducts();
    }
  }, [open]);

  const fetchPopularProducts = async () => {
    try {
      const response = await getPopularProducts(3);
      const products = response.products || [];
      setPopularProducts(products);
    } catch (error) {
      console.error('Error fetching popular products:', error);
    }
  };

  const fetchProductRecommendations = async () => {
    setLoading(true);
    try {
      let response;
      if (isLoggedIn()) {
        try {
          response = await getRecommendationsForUser(6);
        } catch (error) {
          // If personalized recommendations fail, fall back to popular products
          console.warn('Failed to get personalized recommendations, using popular products:', error);
          response = await getPopularProducts(6);
        }
      } else {
        response = await getPopularProducts(6);
      }

      const products = response.products || [];
      
      if (products.length > 0) {
        const recommendationType = isLoggedIn() ? "personalized recommendations" : "popular products";
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            text: `Here are some ${recommendationType} for you:`,
            type: "products",
            products: products
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            text: "Sorry, I couldn't find any product recommendations at the moment. Please try again later or browse our catalog directly."
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Sorry, I'm having trouble getting product recommendations right now. Please try again later or browse our products directly."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = async (option: string) => {
    setMessages((prev) => [...prev, { from: "user", text: option }]);

    switch (option) {
      case "Product Recommendations":
        if (loading) return; // Prevent multiple requests
        await fetchProductRecommendations();
        break;

      case "Popular Products":
        if (popularProducts.length > 0) {
          setMessages((prev) => [
            ...prev,
            {
              from: "bot",
              text: "Here are our most popular products:",
              type: "products",
              products: popularProducts
            }
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              from: "bot",
              text: "Loading popular products..."
            }
          ]);
          await fetchPopularProducts();
          setTimeout(() => {
            if (popularProducts.length > 0) {
              setMessages((prev) => [
                ...prev,
                {
                  from: "bot",
                  text: "Here are our most popular products:",
                  type: "products",
                  products: popularProducts
                }
              ]);
            }
          }, 1000);
        }
        break;

      case "Common Questions":
        const faqResponse = (
          <div>
            <strong>Here are some frequently asked questions:</strong>
            <ul style={{ margin: "8px 0", paddingLeft: "16px" }}>
              <li><strong>Q:</strong> How long does delivery take?<br /><strong>A:</strong> Typically within 1–2 days.</li>
              <li><strong>Q:</strong> Can I cancel an order?<br /><strong>A:</strong> Yes, within 1 hour after placing it.</li>
              <li><strong>Q:</strong> Do you offer custom bouquets?<br /><strong>A:</strong> Yes! You can customize in the cart.</li>
              <li><strong>Q:</strong> What's your return policy?<br /><strong>A:</strong> We offer returns within 24 hours for fresh flowers.</li>
              <li><strong>Q:</strong> Do you deliver on weekends?<br /><strong>A:</strong> Yes, we deliver 7 days a week.</li>
            </ul>
          </div>
        );
        setTimeout(() => {
          setMessages((prev) => [...prev, { from: "bot", text: faqResponse }]);
        }, 500);
        break;

      case "Buying Support Guide":
        const guideResponse = (
          <div>
            <strong>Buying Support Guide:</strong>
            <ol style={{ margin: "8px 0", paddingLeft: "16px" }}>
              <li>🛒 Browse our product catalog or use the search feature.</li>
              <li>🔐 Log in or create an account for personalized recommendations.</li>
              <li>🛍️ Add items to your cart and review your selection.</li>
              <li>💳 Choose your payment method (Card, Apple Pay, Google Pay).</li>
              <li>🚚 Confirm your delivery address and preferred time.</li>
              <li>✅ Place your order and track it in 'Your Orders'.</li>
              <li>📞 Contact support if you need any assistance.</li>
            </ol>
          </div>
        );
        setTimeout(() => {
          setMessages((prev) => [...prev, { from: "bot", text: guideResponse }]);
        }, 500);
        break;

      default:
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { from: "bot", text: "Sorry, I didn't quite get that. Please select one of the options." }
          ]);
        }, 500);
    }
  };

  const ProductRecommendations = ({ products }: { products: IProduct[] }) => (
    <div style={{ marginTop: "8px" }}>
      {products.map((product) => (
        <div 
          key={product.id} 
          className="product-recommendation-card"
          onClick={() => window.open(`/products/${product.id}`, '_blank')}
        >
          <img 
            src={product.imageUrls?.[0] || 'https://via.placeholder.com/60x60'} 
            alt={product.name}
            className="product-recommendation-image"
          />
          <div className="product-recommendation-details">
            <h4 className="product-recommendation-name">
              {product.name}
            </h4>
            <p className="product-recommendation-price">
              ${product.basePrice?.toFixed(2)}
            </p>
            <p className="product-recommendation-stock">
              {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : "Out of stock"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  const shouldShowChatbot = () => {
    const currentPath = window.location.pathname;
    
    // Don't show chatbot on these pages
    const excludedPaths = [
      '/admin',
      '/checkout',
      '/login',
      '/register',
      '/payment'
    ];
    
    // Don't show on admin pages
    if (currentPath.startsWith('/admin')) {
      return false;
    }
    
    // Don't show on checkout related pages
    if (excludedPaths.some(path => currentPath.startsWith(path))) {
      return false;
    }
    
    // Don't show on product pages (they have their own specialized chatbot)
    // if (currentPath.includes('/products/')) {
    //   return false;
    // }
    
    // Show on all other pages: home, product listing, categories, about, etc.
    return true;
  };

  // Don't render chatbot if it shouldn't be shown
  if (!shouldShowChatbot()) {
    return null;
  }

  return (
    <div className="chatbot-container">
      {/* Toggle Button */}
      <button 
        className={`chatbot-toggle ${open ? 'chatbot-toggle-open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        <MessageCircle size={24} />
      </button>

      {/* Chatbot Window */}
      <div className={`chatbot-window ${open ? 'chatbot-window-open' : 'chatbot-window-closed'}`}>
        <div className="chatbot-header">
          <span>FlowerShop Support</span>
          <button 
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="chatbot-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        <div className="chatbot-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message-container ${msg.from}`}>
              <div className={`chatbot-msg ${msg.from === "user" ? "user" : "bot"}`}>
                {typeof msg.text === "string" ? msg.text : msg.text}
              </div>
              {msg.type === "products" && msg.products && (
                <ProductRecommendations products={msg.products} />
              )}
            </div>
          ))}
          {loading && (
            <div className="message-container bot">
              <div className="chatbot-msg bot">
                <div className="loading-container">
                  <div className="loading-text">Getting recommendations...</div>
                  <div className="loading-spinner"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="chatbot-options">
          <button 
            onClick={() => handleOptionClick("Product Recommendations")}
            disabled={loading}
            className="chatbot-option-button"
          >
            🌟 Product Recommendations
          </button>
          <button 
            onClick={() => handleOptionClick("Popular Products")}
            className="chatbot-option-button"
          >
            🔥 Popular Products
          </button>
          <button 
            onClick={() => handleOptionClick("Common Questions")}
            className="chatbot-option-button"
          >
            ❓ Common Questions
          </button>
          <button 
            onClick={() => handleOptionClick("Buying Support Guide")}
            className="chatbot-option-button"
          >
            📘 Buying Support Guide
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
