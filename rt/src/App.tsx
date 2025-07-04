import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ProductPage from "./components/ProductPage";
import HomePage from "./components/HomePage";
import CategoryPage from "./components/CategoryPage";
import CheckoutPage from "./components/CheckoutPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<Layout />}>
          <Route path="/products" element={<ProductPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>
        <Route path="/home" element={<HomePage />} />
        <Route path="/category" element={<CategoryPage/> } />
      </Routes>
    </Router>
  );
}

export default App;
