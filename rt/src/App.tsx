import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ProductPage from "./components/ProductPage";
import HomePage from "./components/HomePage/HomePage";
import CategoryPage from "./components/CategoryPage";
import CheckoutPage from "./components/CheckoutPage";
import ContactPage from "./components/ContactPage";
import Admin from "./components/Admin";
import ProductListingsPage from "./components/ProductListing";
import OrderHistoryPage from "./components/OrderHistoryPage";
import OrderTracking from "./components/OrderListing/OrderTracking";
import UserProfile from "./components/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFoundPage from "./components/NotFoundPage";
import { CartProvider } from "./contexts/CartContext";
import ReviewPage from "./components/ReviewPage";
import PaymentSuccessPage from "./components/PaymentSuccessPage";
import PaymentFailedPage from "./components/PaymentFailedPage";
import ConditionalChatbot from "./components/ConditionalChatbot";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            element={
              <CartProvider>
                <Layout />
              </CartProvider>
            }
          >
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/payment/failed" element={<PaymentFailedPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/category" element={<CategoryPage />} />
            <Route path="/list" element={<ProductListingsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/orderhistory" element={<OrderHistoryPage />} />
            <Route path="/orders/:orderId" element={<OrderTracking />} />
            <Route path="/review/:productId" element={<ReviewPage />} />
          </Route>
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="Admin">
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        
        <ConditionalChatbot />
      </div>
    </Router>
  );
}

export default App;