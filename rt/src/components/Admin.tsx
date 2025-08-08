import React, { useEffect } from "react";
import { IProduct, ICategory, IPricingRule, IOrder, IUser, IUserSummaryLoyalty } from "../types/backend";
import { Sidebar } from "./Admin/Sidebar";
import { Dashboard } from "./Admin/Dashboard/Dashboard";
import { FlowerList } from "./Admin/Flower/FlowerList";
import { FlowerForm } from "./Admin/Flower/FlowerForm";
import { PricingRuleList } from "./Admin/PricingRule/PricingRuleList";
import { PricingRuleForm } from "./Admin/PricingRule/PricingRuleForm";
import { OrderList } from "./Admin/Order/OrderList";
import { OrderForm } from "./Admin/Order/OrderForm";
import { UserList } from "./Admin/User/UserList";
import { UserForm } from "./Admin/User/UserForm";
import { CategoryList } from "./Admin/Category/CategoryList";
import { CategoryForm } from "./Admin/Category/CategoryForm";
import { Modal } from "./Modal";
import { ReportList } from "./Admin/Reports/Report";
import { createCategory, deleteCategory, getCategories, getUsers, updateCategory, deleteProduct, deletePricingRule, cancelOrder, getPricingRules } from "../config/api";
import { LoyaltyList } from "./Admin/Loyalty/LoyaltyList";
import { LoyaltyForm } from "./Admin/Loyalty/LoyaltyForm";
import { API } from "../api/api";
import "./Admin/Admin.css";

const Admin = () => {
  // Initialize activeSection from localStorage or default to "dashboard"
  const [activeSection, setActiveSection] = React.useState(() => {
    const savedSection = localStorage.getItem('adminActiveSection');
    return savedSection || "dashboard";
  });
  const [pricingRules, setPricingRules] = React.useState<IPricingRule[]>([]);
  const [orders, setOrders] = React.useState<IOrder[]>([]);
  const [users, setUsers] = React.useState<IUser[]>([]);
  const [categories, setCategories] = React.useState<ICategory[]>([]);
  const [products, setProducts] = React.useState<IProduct[]>([]);
  const [loyaltyUsers, setLoyaltyUsers] = React.useState<IUserSummaryLoyalty[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [modal, setModal] = React.useState({ isOpen: false, type: "", data: null });
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  // Create a wrapper function to save to localStorage when activeSection changes
  const handleSetActiveSection = (section: string) => {
    setActiveSection(section);
    localStorage.setItem('adminActiveSection', section);
  };

  const openModal = (type: string, data: any = null) => setModal({ isOpen: true, type, data });
  const closeModal = () => setModal({ isOpen: false, type: "", data: null });

  // Get section title for header
  const getSectionTitle = () => {
    const titles: Record<string, string> = {
      dashboard: "Dashboard",
      flowers: "Product Management",
      pricing: "Pricing Rules",
      orders: "Order Management",
      users: "User Management", 
      categories: "Category Management",
      loyalty: "Loyalty Program",
      reports: "Reports & Analytics"
    };
    return titles[activeSection] || "Dashboard";
  };

  // Get section description
  const getSectionDescription = () => {
    const descriptions: Record<string, string> = {
      dashboard: "Welcome to your admin dashboard",
      flowers: "Manage your flower inventory and product listings",
      pricing: "Configure pricing rules and discount structures",
      orders: "Monitor and manage customer orders",
      users: "Manage user accounts and permissions",
      categories: "Organize products into categories", 
      loyalty: "Manage customer loyalty points and rewards",
      reports: "View business analytics and performance metrics"
    };
    return descriptions[activeSection] || "Welcome to the admin dashboard";
  };

  useEffect(() => {
    loadCategories();
    loadUsers();
    loadPricingRules();
    loadOrders();
    loadProducts();
  }, []);

  const loadPricingRules = async () => {
    try {
      setLoading(true);
      setError(null);
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('User not found');
      const user = JSON.parse(userStr);
      if (user.role !== 'Admin') throw new Error('Admin access required');
      const rulesData = await API.Pricing.getRules();
      console.log("Fetched pricing rules:", rulesData);
      setPricingRules(rulesData.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load pricing rules');
      console.error('Error loading pricing rules:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('User not found');
      const user = JSON.parse(userStr);
      if (user.role !== 'Admin') throw new Error('Admin access required');
      //   const ordersData = await getOrders();
      //   setOrders(ordersData.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('User not found');
      const user = JSON.parse(userStr);
      if (user.role !== 'Admin') throw new Error('Admin access required');
      const productsData = await API.Product.list();
      if (productsData.data?.products) {
        setProducts(productsData.data.products);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('User not found');
      const user = JSON.parse(userStr);
      if (user.role !== 'Admin') throw new Error('Admin access required');
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (err: any) {
      setError(err.message || 'Failed to load categories');
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('User not found');
      const user = JSON.parse(userStr);
      if (user.role !== 'Admin') throw new Error('Admin access required');
      const usersData = await getUsers();
      setUsers(usersData);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type: string, id: number | string) => {
    if (type === "flowers") {
      try {
        setError(null);
        await deleteProduct(id as number);
        // No need to reload products here anymore - FlowerList handles it
      } catch (err: any) {
        setError(err.message || 'Failed to delete product');
        console.error('Error deleting product:', err);
        throw err; // Re-throw so FlowerList can handle the error
      }
      return;
    }
    if (type === "pricing") {
      try {
        setError(null);
        await deletePricingRule(id as number);
        setPricingRules(pricingRules.filter(r => r.pricingRuleId !== id));
      } catch (err: any) {
        setError(err.message || 'Failed to delete pricing rule');
        console.error('Error deleting pricing rule:', err);
      }
      return;
    }
    if (type === "orders") {
      try {
        setError(null);
        await cancelOrder(id as number);
        setOrders(orders.filter(o => o.id !== id));
      } catch (err: any) {
        setError(err.message || 'Failed to cancel order');
        console.error('Error canceling order:', err);
      }
      return;
    }
    if (type === "categories") {
      try {
        setError(null);
        await deleteCategory(id as number);
        setCategories(categories.filter(c => c.id !== id));
      } catch (err: any) {
        setError(err.message || 'Failed to delete category');
        console.error('Error deleting category:', err);
      }
    }
  };

  const handleSave = async (type: string) => {
    try {
      setError(null);
      closeModal();
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      setError(err.message || `Failed to save ${type}`);
      console.error(`Error saving ${type}:`, err);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <Dashboard 
              stats={{
                totalUsers: users.length,
                totalProducts: products.length,
                totalCategories: categories.length,
                totalPricingRules: pricingRules.length,
                totalOrders: orders.length
              }}
              onSectionChange={handleSetActiveSection}
            />
          </div>
        );
      case "flowers":
        return (
          <div className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-lg animate-fade-in">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                  <div className="ml-auto pl-3">
                    <button
                      onClick={() => setError(null)}
                      className="inline-flex text-red-400 hover:text-red-600 focus:outline-none transition-colors duration-200"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
            <FlowerList
              onAdd={() => openModal("flower")}
              onEdit={(p) => openModal("flower", p)}
              onDelete={(id) => handleDelete("flowers", id)}
              onDeleteSuccess={() => setError(null)}
              refreshTrigger={refreshTrigger}
            />
            <Modal isOpen={modal.isOpen && modal.type === "flower"} onClose={closeModal}>
              <FlowerForm
                flower={modal.data ?? undefined}
                onSave={() => handleSave("product")}
                onClose={closeModal}
              />
            </Modal>
          </div>
        );
      case "pricing":
        return (
          <div className="space-y-6">
            <PricingRuleList
              onAdd={() => openModal("pricing")}
              onEdit={(r) => openModal("pricing", r)}
              onDelete={(id) => handleDelete("pricing", id)}
              refreshTrigger={refreshTrigger}
            />
            <Modal isOpen={modal.isOpen && modal.type === "pricing"} onClose={closeModal}>
              <PricingRuleForm
                rule={modal.data ?? undefined}
                onClose={closeModal}
                onSave={() => handleSave("pricing rule")}
              />
            </Modal>
          </div>
        );
      case "orders":
        return (
          <div className="space-y-6">
            <OrderList
              onEdit={(o) => openModal("order", o)}
              onDelete={(id) => handleDelete("orders", id)}
              refreshTrigger={refreshTrigger}
            />
            <Modal isOpen={modal.isOpen && modal.type === "order"} onClose={closeModal}>
              <OrderForm
                order={modal.data ?? undefined}
                onSave={() => handleSave("order")}
                onClose={closeModal}
              />
            </Modal>
          </div>
        );
      case "users":
        return (
          <div className="space-y-6">
            <UserList
              onEdit={(u) => openModal("user", u)}
              refreshTrigger={refreshTrigger}
            />
            <Modal isOpen={modal.isOpen && modal.type === "user"} onClose={closeModal}>
              <UserForm
                user={modal.data ?? undefined}
                onSave={() => handleSave("user")}
                onClose={closeModal}
              />
            </Modal>
          </div>
        );
      case "categories":
        return (
          <div className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-lg animate-fade-in">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                  <div className="ml-auto pl-3">
                    <button
                      onClick={() => setError(null)}
                      className="inline-flex text-red-400 hover:text-red-600 focus:outline-none transition-colors duration-200"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="text-gray-600 font-medium">Loading categories...</p>
                </div>
              </div>
            ) : (
              <CategoryList
                onAdd={() => openModal("category")}
                onEdit={(c) => openModal("category", c)}
                onDelete={(id) => handleDelete("categories", id)}
                refreshTrigger={refreshTrigger}
              />
            )}
            <Modal isOpen={modal.isOpen && modal.type === "category"} onClose={closeModal}>
              <CategoryForm
                category={modal.data ?? undefined}
                onSave={() => handleSave("category")}
                onClose={closeModal}
              />
            </Modal>
          </div>
        );
      case "loyalty":
        return (
          <div className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-lg animate-fade-in">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                  <div className="ml-auto pl-3">
                    <button
                      onClick={() => setError(null)}
                      className="inline-flex text-red-400 hover:text-red-600 focus:outline-none transition-colors duration-200"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
            <LoyaltyList
              onEdit={(u) => openModal("loyalty", u)}
              refreshTrigger={refreshTrigger}
            />
            <Modal isOpen={modal.isOpen && modal.type === "loyalty"} onClose={closeModal}>
              {modal.data && (
                <LoyaltyForm
                  user={modal.data as IUserSummaryLoyalty}
                  onSave={() => handleSave("loyalty points")}
                  onClose={closeModal}
                />
              )}
            </Modal>
          </div>
        );
      case "reports":
        return (
          <div className="space-y-6">
            <ReportList />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <Sidebar setActiveSection={handleSetActiveSection} activeSection={activeSection} />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        {/* Header Section */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm sticky top-0 z-20">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{getSectionTitle()}</h1>
                  <p className="text-sm text-gray-600 mt-1">{getSectionDescription()}</p>
                  {activeSection === 'dashboard' && (
                    <p className="text-xs text-blue-600 mt-1">
                      Last updated: {new Date().toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Quick Stats */}
                <div className="hidden md:flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{users.length}</div>
                    <div className="text-xs text-gray-500">Total Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{products.length}</div>
                    <div className="text-xs text-gray-500">Products</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{categories.length}</div>
                    <div className="text-xs text-gray-500">Categories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{pricingRules.length}</div>
                    <div className="text-xs text-gray-500">Pricing Rules</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{orders.length}</div>
                    <div className="text-xs text-gray-500">Orders</div>
                  </div>
                </div>
                
                {/* Notification Bell */}
                <button className="relative p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transition-colors duration-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8 min-h-screen">
          <div className="max-w-7xl mx-auto">
            <div className="animate-fade-in">
              {renderSection()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
