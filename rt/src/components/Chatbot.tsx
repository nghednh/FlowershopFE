import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Search, ShoppingCart, Star, ChevronDown, ChevronUp } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  getPopularProducts, 
  getRecommendationsForUser,
  searchProducts,
  getMyOrders,
  getDynamicPrice
} from "../config/api";
import { IProduct, IOrder } from "../types/backend";
import "./Chatbot.css";

interface Message {
  from: "bot" | "user";
  text: string | JSX.Element;
  type?: "text" | "products" | "orders" | "suggestions";
  products?: IProduct[];
  orders?: IOrder[];
  timestamp: Date;
  id: string;
}

interface ChatbotState {
  isAwaitingInput: boolean;
  awaitingInputType?: "order_tracking" | "product_search" | "feedback";
  context?: any;
}

const Chatbot = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [popularProducts, setPopularProducts] = useState<IProduct[]>([]);
  const [chatbotState, setChatbotState] = useState<ChatbotState>({
    isAwaitingInput: false
  });
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Utility functions
  const generateMessageId = () => Math.random().toString(36).substr(2, 9);
  
  const addMessage = (message: Omit<Message, 'timestamp' | 'id'>) => {
    setMessages(prev => [...prev, {
      ...message,
      timestamp: new Date(),
      id: generateMessageId()
    }]);
  };

  const addUserMessage = (text: string) => {
    addMessage({ from: "user", text });
  };

  const addBotMessage = (text: string | JSX.Element, type?: Message['type'], products?: IProduct[], orders?: IOrder[]) => {
    addMessage({ from: "bot", text, type, products, orders });
  };

  const [messages, setMessages] = useState<Message[]>([
    { 
      from: "bot", 
      text: "👋 Hi there! I'm your FlowerShop assistant. How can I help you today?",
      timestamp: new Date(),
      id: generateMessageId()
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isLoggedIn = () => {
    const user = localStorage.getItem('user');
    return user && user !== 'null';
  };

  const simulateTyping = async (delay: number = 1000) => {
    setTyping(true);
    await new Promise(resolve => setTimeout(resolve, delay));
    setTyping(false);
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
          console.warn('Failed to get personalized recommendations, using popular products:', error);
          response = await getPopularProducts(6);
        }
      } else {
        response = await getPopularProducts(6);
      }

      const products = response.products || [];
      
      if (products.length > 0) {
        const recommendationType = isLoggedIn() ? "personalized recommendations" : "popular products";
        await simulateTyping(800);
        addBotMessage(
          `Here are some ${recommendationType} for you:`,
          "products",
          products
        );
      } else {
        await simulateTyping(500);
        addBotMessage("Sorry, I couldn't find any product recommendations at the moment. Please try again later or browse our catalog directly.");
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      await simulateTyping(500);
      addBotMessage("Sorry, I'm having trouble getting product recommendations right now. Please try again later or browse our products directly.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await searchProducts(query);
      const products = response.products || [];
      
      await simulateTyping(800);
      if (products.length > 0) {
        addBotMessage(
          `I found ${products.length} result(s) for "${query}":`,
          "products", 
          products.slice(0, 6)
        );
      } else {
        addBotMessage(`Sorry, I couldn't find any products matching "${query}". Try different keywords or browse our categories.`);
      }
    } catch (error) {
      console.error('Search error:', error);
      await simulateTyping(500);
      addBotMessage("Sorry, I'm having trouble with the search right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleOrderTracking = async () => {
    if (!isLoggedIn()) {
      addBotMessage("Please log in to track your orders. I can redirect you to the login page if you'd like!");
      return;
    }

    setLoading(true);
    try {
      const orders = await getMyOrders();
      
      await simulateTyping(800);
      if (Array.isArray(orders) && orders.length > 0) {
        const ordersList = (
          <div className="orders-container">
            <div className="orders-header">
              <strong>📦 Your Recent Orders:</strong>
            </div>
            <div className="orders-list">
              {orders.slice(0, 3).map((order: any, index: number) => (
                <div key={index} className="order-item">
                  <div className="order-info">
                    <span className="order-id">Order #{order.id || `ORD-${index + 1}`}</span>
                    <span className="order-status">{order.status || 'Processing'}</span>
                  </div>
                  <div className="order-amount">${order.sum || order.total || '0.00'}</div>
                </div>
              ))}
            </div>
            <div className="orders-footer">
              <small>Visit "My Orders" page for complete details</small>
            </div>
          </div>
        );
        addBotMessage(ordersList);
      } else {
        addBotMessage("You don't have any orders yet. Would you like me to show you some popular products?");
      }
    } catch (error) {
      console.error('Order tracking error:', error);
      await simulateTyping(500);
      addBotMessage("Sorry, I'm having trouble accessing your order information. Please try again later or contact support.");
    } finally {
      setLoading(false);
    }
  };

  const handleNaturalLanguageInput = async (input: string) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('search') || lowerInput.includes('find') || lowerInput.includes('looking for')) {
      const searchQuery = input.replace(/(search|find|looking for|show me|i want)/gi, '').trim();
      if (searchQuery) {
        await handleSearch(searchQuery);
      } else {
        addBotMessage("What would you like to search for? I can help you find flowers, plants, or decorations!");
      }
    } else if (lowerInput.includes('order') && (lowerInput.includes('track') || lowerInput.includes('status') || lowerInput.includes('my orders'))) {
      await handleOrderTracking();
    } else if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      await simulateTyping(500);
      addBotMessage("Hello! 👋 I'm here to help you with your flower shopping experience. What can I assist you with today?");
    } else if (lowerInput.includes('help') || lowerInput.includes('support')) {
      await simulateTyping(500);
      addBotMessage("I'm here to help! I can assist you with product recommendations, order tracking, answers to common questions, and more. What do you need help with?");
    } else {
      await simulateTyping(800);
      addBotMessage("I'm not sure I understand that exactly, but I'm here to help! You can ask me about products, orders, or use the buttons below for quick assistance. 😊");
    }
  };

  const handleOptionClick = async (option: string) => {
    addUserMessage(option);

    switch (option) {
      case "🌟 Smart Recommendations":
        if (loading) return;
        await fetchProductRecommendations();
        break;

      case "🔥 Popular Products":
        if (popularProducts.length > 0) {
          await simulateTyping(500);
          addBotMessage("Here are our most popular products:", "products", popularProducts);
        } else {
          addBotMessage("Loading popular products...");
          await fetchPopularProducts();
          setTimeout(() => {
            if (popularProducts.length > 0) {
              addBotMessage("Here are our most popular products:", "products", popularProducts);
            }
          }, 1000);
        }
        break;

      case "📦 Track My Orders":
        await handleOrderTracking();
        break;

      case "🔍 Search Products":
        setChatbotState({ isAwaitingInput: true, awaitingInputType: "product_search" });
        addBotMessage("What would you like to search for? Type your query below!");
        break;

      case "❓ Common Questions":
        const faqResponse = (
          <div className="faq-container">
            <div className="faq-header">
              <strong>🤔 Frequently Asked Questions:</strong>
            </div>
            <div className="faq-list">
              <div className="faq-item">
                <div className="faq-question">🚚 How long does delivery take?</div>
                <div className="faq-answer">Typically 1-2 business days within the city, 3-5 days nationwide.</div>
              </div>
              <div className="faq-item">
                <div className="faq-question">❌ Can I cancel an order?</div>
                <div className="faq-answer">Yes, you can cancel within 1 hour after placing your order.</div>
              </div>
              <div className="faq-item">
                <div className="faq-question">🎨 Do you offer custom bouquets?</div>
                <div className="faq-answer">Absolutely! Customize your bouquet in the cart or contact us for special requests.</div>
              </div>
              <div className="faq-item">
                <div className="faq-question">🔄 What's your return policy?</div>
                <div className="faq-answer">We accept returns within 24 hours for fresh flowers in original condition.</div>
              </div>
              <div className="faq-item">
                <div className="faq-question">📅 Weekend delivery?</div>
                <div className="faq-answer">Yes! We deliver 7 days a week, including weekends and holidays.</div>
              </div>
            </div>
          </div>
        );
        await simulateTyping(700);
        addBotMessage(faqResponse);
        break;

      case "📘 Shopping Guide":
        const guideResponse = (
          <div className="shopping-guide">
            <div className="guide-header">
              <strong>🛍️ Your Complete Shopping Guide:</strong>
            </div>
            <div className="guide-steps">
              <div className="guide-step">
                <span className="step-number">1️⃣</span>
                <span className="step-text">Browse products or use search to find what you need</span>
              </div>
              <div className="guide-step">
                <span className="step-number">2️⃣</span>
                <span className="step-text">Create account or login for personalized recommendations</span>
              </div>
              <div className="guide-step">
                <span className="step-number">3️⃣</span>
                <span className="step-text">Add items to cart and customize if available</span>
              </div>
              <div className="guide-step">
                <span className="step-number">4️⃣</span>
                <span className="step-text">Choose payment method (Card, PayPal, VNPay, COD)</span>
              </div>
              <div className="guide-step">
                <span className="step-number">5️⃣</span>
                <span className="step-text">Confirm delivery address and preferred time</span>
              </div>
              <div className="guide-step">
                <span className="step-number">6️⃣</span>
                <span className="step-text">Complete order and track progress in 'My Orders'</span>
              </div>
              <div className="guide-step">
                <span className="step-number">💬</span>
                <span className="step-text">Contact support anytime if you need assistance!</span>
              </div>
            </div>
          </div>
        );
        await simulateTyping(700);
        addBotMessage(guideResponse);
        break;

      default:
        await simulateTyping(500);
        addBotMessage("I'm not sure about that option. Please try one of the available options below! 😊");
    }
  };

  const handleInputSubmit = async () => {
    if (!inputValue.trim()) return;
    
    const userInput = inputValue.trim();
    addUserMessage(userInput);
    setInputValue("");
    
    if (chatbotState.isAwaitingInput) {
      switch (chatbotState.awaitingInputType) {
        case "product_search":
          await handleSearch(userInput);
          break;
        default:
          await handleNaturalLanguageInput(userInput);
      }
      setChatbotState({ isAwaitingInput: false });
    } else {
      await handleNaturalLanguageInput(userInput);
    }
  };

  const shouldShowChatbot = () => {
    const currentPath = location.pathname;
    
    const excludedPaths = [
      '/admin',
      '/checkout',
      '/login',
      '/register',
      '/payment'
    ];
    
    if (currentPath.startsWith('/admin')) {
      return false;
    }
    
    if (excludedPaths.some(path => currentPath.startsWith(path))) {
      return false;
    }
    
    return true;
  };

  // Close chatbot when navigating to excluded pages
  useEffect(() => {
    if (!shouldShowChatbot() && open) {
      setOpen(false);
    }
  }, [location.pathname, open]);

  // Don't render chatbot if it shouldn't be shown
  const showChatbot = shouldShowChatbot();
  
  // TEMPORARILY FORCE VISIBLE FOR DEBUGGING
  if (!showChatbot) {
    return null;
  }
// Helper component to fetch and show dynamic price for each product

// Helper component to fetch and show dynamic price for each product

const ProductRecommendations = ({ products }: { products: IProduct[] }) => (
  <ProductRecommendationsWithDynamicPrice products={products} />
);
// Helper component to fetch and show dynamic price for each product

const ProductRecommendationsWithDynamicPrice = ({ products }: { products: IProduct[] }) => {
  const [dynamicPrices, setDynamicPrices] = useState<{ [id: number]: number }>({});
  useEffect(() => {
    let isMounted = true;
    const fetchPrices = async () => {
      const prices: { [id: number]: number } = {};
      await Promise.all(products.map(async (product) => {
        try {
          const res = await getDynamicPrice(product.id);
          prices[product.id] = res?.data?.dynamicPrice ?? product.basePrice;
        } catch {
          prices[product.id] = product.basePrice;
        }
      }));
      if (isMounted) setDynamicPrices(prices);
    };
    fetchPrices();
    return () => { isMounted = false; };
  }, [products]);

  return (
    <div className="products-container">
      {products.map((product) => {
        const dynamicPrice = dynamicPrices[product.id];
        const hasDiscount = typeof dynamicPrice === 'number' && dynamicPrice < product.basePrice;
        return (
          <div 
            key={product.id} 
            className="product-recommendation-card"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <img 
              src={product.imageUrls?.[0] || '/no-image.svg'}
              alt={product.name}
              className="product-recommendation-image"
            />
            <div className="product-recommendation-details">
              <h4 className="product-recommendation-name">
                {product.name}
              </h4>
              <p className="product-recommendation-price">
                {hasDiscount ? (
                  <>
                    <span style={{ color: '#d7263d', fontWeight: 'bold' }}>
                      ${dynamicPrice.toFixed(2)}
                    </span>
                    <span style={{ textDecoration: 'line-through', color: '#888', marginLeft: 8 }}>
                      ${product.basePrice.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span style={{ fontWeight: 'bold' }}>
                    ${dynamicPrice ? dynamicPrice.toFixed(2) : product.basePrice.toFixed(2)}
                  </span>
                )}
              </p>
              <div className="product-recommendation-footer">
                <p className="product-recommendation-stock">
                  {product.stockQuantity > 0 ? (
                    <span className="in-stock">
                      {product.stockQuantity > 10 
                        ? `✅ ${product.stockQuantity} in Stock`
                        : product.stockQuantity > 0 
                        ? `⚡ Only ${product.stockQuantity} left`
                        : '❌ Out of Stock'
                      }
                    </span>
                  ) : (
                    <span className="out-of-stock">❌ Out of stock</span>
                  )}
                </p>
                {product.reviews && product.reviews.length > 0 && (
                  <div className="product-rating">
                    <Star size={12} className="star-icon" />
                    <span>
                      {(product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length).toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

  const TypingIndicator = () => (
    <div className="message-container bot">
      <div className="chatbot-msg bot typing-indicator">
        <div className="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span className="typing-text">FlowerBot is typing...</span>
      </div>
    </div>
  );

  const QuickActions = () => (
    <div className="quick-actions">
      <div 
        className={`quick-actions-header ${showQuickActions ? 'expanded' : 'collapsed'}`}
        onClick={() => setShowQuickActions(!showQuickActions)}
      >
        <div className="quick-actions-title">Quick Actions</div>
        <div className="toggle-icon">
          {showQuickActions ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </div>
      </div>
      <div className={`quick-actions-buttons ${showQuickActions ? 'show' : 'hide'}`}>
        <button 
          onClick={() => handleOptionClick("🌟 Smart Recommendations")}
          disabled={loading}
          className="quick-action-btn recommendation"
        >
          <Star size={16} />
          Smart Picks
        </button>
        <button 
          onClick={() => handleOptionClick("🔥 Popular Products")}
          className="quick-action-btn popular"
        >
          🔥 Popular
        </button>
        <button 
          onClick={() => handleOptionClick("🔍 Search Products")}
          className="quick-action-btn search"
        >
          <Search size={16} />
          Search
        </button>
        <button 
          onClick={() => handleOptionClick("📦 Track My Orders")}
          className="quick-action-btn orders"
        >
          <ShoppingCart size={16} />
          Orders
        </button>
        <button 
          onClick={() => handleOptionClick("❓ Common Questions")}
          className="quick-action-btn faq"
        >
          ❓ FAQ
        </button>
        <button 
          onClick={() => handleOptionClick("📘 Shopping Guide")}
          className="quick-action-btn guide"
        >
          📘 Guide
        </button>
      </div>
    </div>
  );

  return (
    <div className="chatbot-container">
      {/* Toggle Button with notification badge */}
      <button 
        className={`chatbot-toggle ${open ? 'chatbot-toggle-open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        <MessageCircle size={24} />
        {!open && (
          <div className="chatbot-notification-badge">
            <div className="pulse-ring"></div>
            <div className="pulse-ring delay-1"></div>
            <div className="pulse-ring delay-2"></div>
          </div>
        )}
      </button>

      {/* Chatbot Window */}
      <div className={`chatbot-window ${open ? 'chatbot-window-open' : 'chatbot-window-closed'}`}>
        {/* Header */}
        <div className="chatbot-header">
          <div className="header-info">
            <div className="header-title">
              <span>🌸 FlowerShop Assistant</span>
            </div>
            <div className="header-status">
              <div className="status-indicator online"></div>
              <span>Online</span>
            </div>
          </div>
          <button 
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="chatbot-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="chatbot-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-container ${msg.from}`}>
              <div className={`chatbot-msg ${msg.from === "user" ? "user" : "bot"}`}>
                {typeof msg.text === "string" ? (
                  <span>{msg.text}</span>
                ) : (
                  msg.text
                )}
                <div className="message-time">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {msg.type === "products" && msg.products && (
                <ProductRecommendations products={msg.products} />
              )}
            </div>
          ))}
          
          {typing && <TypingIndicator />}
          
          {loading && (
            <div className="message-container bot">
              <div className="chatbot-msg bot">
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <div className="loading-text">Searching for the perfect flowers...</div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        {!chatbotState.isAwaitingInput && <QuickActions />}

        {/* Always show input at bottom for natural conversation */}
        <div className="natural-input-section">
          <div className="chat-input-container">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // Prevent newline if using textarea
                  handleInputSubmit();
                }
              }}
              placeholder="Type your message..."
              className="chat-input"
            />
            <button 
              onClick={handleInputSubmit}
              disabled={!inputValue.trim() || loading}
              className="chat-send-button"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
