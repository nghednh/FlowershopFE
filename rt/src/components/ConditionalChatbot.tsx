import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Chatbot from "./Chatbot";

// Component to conditionally render chatbot
const ConditionalChatbot = () => {
  const location = useLocation();
  
  // Define routes where chatbot should NOT appear
  const excludedRoutes = ['/login', '/register'];
  
  // Check if current path is a 404 (not found)
  const is404 = !['/', '/home', '/login', '/register', '/payment/success', '/payment/failed', 
                  '/product', '/checkout', '/category', '/list', '/contact', '/profile', 
                  '/orderhistory', '/orders', '/review', '/admin'].some(route => {
    if (route === '/') return location.pathname === '/';
    if (route === '/product' || route === '/orders' || route === '/review') {
      return location.pathname.startsWith(route + '/');
    }
    return location.pathname === route;
  });
  
  // Don't show chatbot on excluded routes or 404 pages
  if (excludedRoutes.includes(location.pathname) || is404) {
    return null;
  }
  
  return <Chatbot />;
};

export default ConditionalChatbot;