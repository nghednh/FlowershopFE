import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ProductPage from "./components/ProductPage";
import HomePage from "./components/HomePage";
import CategoryPage from "./components/CategoryPage";
import CheckoutPage from "./components/CheckoutPage";
import ContactPage from "./components/ContactPage";
import Admin from "./components/Admin";
import ProductListingsPage from "./components/ProductListing";
import OrderHistoryPage from "./components/OrderHistoryPage";
import OrderTracking from "./components/OrderListing/OrderTracking";
import ProtectedRoute from "./components/ProtectedRoute";
import { CartProvider } from "./contexts/CartContext";
import Chatbot from "./components/Chatbot";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            element={
              <CartProvider>
                <Layout />
              </CartProvider>
            }
          >
            <Route path="/home" element={<HomePage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/products/:id" element={<ProductPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Route>
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="Admin">
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/list" element={<ProductListingsPage />} />
          <Route path="/orderhistory" element={<OrderHistoryPage />} />
          <Route path="/orders/:orderId" element={<OrderTracking />} />
        </Routes>
            
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
