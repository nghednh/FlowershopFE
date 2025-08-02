import React, { useEffect } from "react";
import { IProduct, ICategory, IPricingRule, IOrder, IUser } from "../types/backend";
import { Sidebar } from "./Admin/Sidebar";
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
import { ReportList } from "./Admin/Reports/ReportList";
import { createCategory, deleteCategory, getCategories, getUsers, updateCategory, updateUserRole, getProducts, createProduct, updateProduct, deleteProduct, deletePricingRule, cancelOrder, getPricingRules } from "../config/api";

const Admin = () => {
  const [activeSection, setActiveSection] = React.useState("flowers");
  const [products, setProducts] = React.useState<IProduct[]>([]);
  const [totalProducts, setTotalProducts] = React.useState(0);
  const [pricingRules, setPricingRules] = React.useState<IPricingRule[]>([]);
  const [orders, setOrders] = React.useState<IOrder[]>([]);
  const [users, setUsers] = React.useState<IUser[]>([]);
  const [categories, setCategories] = React.useState<ICategory[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [modal, setModal] = React.useState({ isOpen: false, type: "", data: null });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilters, setStatusFilters] = React.useState<{ [key: string]: boolean }>({
    New: false,
    Old: false,
    "Low Stock": false,
  });

  const openModal = (type: string, data: any = null) => setModal({ isOpen: true, type, data });
  const closeModal = () => setModal({ isOpen: false, type: "", data: null });

  useEffect(() => {
    loadProducts();
    loadCategories();
    loadUsers();
    loadPricingRules();
    loadOrders();
  }, []);

  const loadPricingRules = async () => {
    try {
      setLoading(true);
      setError(null);
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('User not found');
      const user = JSON.parse(userStr);
      if (user.role !== 'Admin') throw new Error('Admin access required');
      const rulesData = await getPricingRules();
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

  const loadProducts = async (page: number = 1, pageSize: number = 20, search: string = searchTerm, filters: { [key: string]: boolean } = statusFilters) => {
    try {
      console.log('Loading products with:', { page, pageSize, search, filters });
      setLoading(true);
      setError(null);
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('User not found');
      const user = JSON.parse(userStr);
      if (user.role !== 'Admin') throw new Error('Admin access required');
      const productsData = await getProducts({ page, pageSize, search, statusFilters: filters });
      setProducts(productsData.data.products);
      setTotalProducts(productsData.data.pagination.totalItems);
      setCurrentPage(page);
      setPageSize(pageSize);
      setSearchTerm(search);
      setStatusFilters(filters);
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
        await loadProducts(currentPage, pageSize, searchTerm, statusFilters);
      } catch (err: any) {
        setError(err.message || 'Failed to delete product');
        console.error('Error deleting product:', err);
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

  const handleProductSave = async (data: IProduct) => {
    try {
      setError(null);
      closeModal();
      await loadProducts(currentPage, pageSize, searchTerm, statusFilters);
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
      console.error('Error saving product:', err);
    }
  };

  const handleCategorySave = async (data: ICategory) => {
    try {
      setError(null);
      if (modal.data) {
        await updateCategory(data.id, data);
        setCategories(categories.map(c => c.id === data.id ? data : c));
      } else {
        const newCategory = await createCategory(data);
        setCategories([...categories, newCategory]);
      }
      closeModal();
    } catch (err: any) {
      setError(err.message || 'Failed to save category');
      console.error('Error saving category:', err);
    }
  };

  const handleUserRoleChange = async (user: IUser) => {
    try {
      setError(null);
      await updateUserRole(user.id.toString(), user.roles);
      setUsers(users.map(u => u.id === user.id ? user : u));
    } catch (err: any) {
      setError(err.message || 'Failed to update user role');
      console.error('Error updating user role:', err);
    } finally {
      closeModal();
    }
  };

  const handleRuleChange = (data: IPricingRule) => {
    try {
      setError(null);
      if (modal.data) {
        setPricingRules(pricingRules.map(r => r.pricingRuleId === data.pricingRuleId ? data : r));
      } else {
        setPricingRules([...pricingRules, data]);
      }
      closeModal();
    } catch (err: any) {
      setError(err.message || 'Failed to save pricing rule');
      console.error('Error saving pricing rule:', err);
    }
  };

  const handlePageChange = async (page: number, newPageSize: number) => {
    console.log('Admin handlePageChange called:', { page, newPageSize });
    await loadProducts(page, newPageSize, searchTerm, statusFilters);
  };

  const handleFilterChange = async (search: string, filters: { [key: string]: boolean }) => {
    setSearchTerm(search);
    setStatusFilters(filters);
    await loadProducts(1, pageSize, search, filters);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "flowers":
        return (
          <>
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
                <button
                  onClick={() => setError(null)}
                  className="ml-2 text-red-900 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            )}
            {loading ? (
              <div className="text-center py-8">Loading products...</div>
            ) : (
              <FlowerList
                products={products}
                onAdd={() => openModal("flower")}
                onEdit={(p) => openModal("flower", p)}
                onDelete={(id) => handleDelete("flowers", id)}
                totalProducts={totalProducts}
                onPageChange={handlePageChange}
                currentPage={currentPage}
                pageSize={pageSize}
                onFilterChange={handleFilterChange}
                searchTerm={searchTerm}
                statusFilters={statusFilters}
              />
            )}
            <Modal isOpen={modal.isOpen && modal.type === "flower"} onClose={closeModal}>
              <FlowerForm
                flower={modal.data ?? undefined}
                onSave={handleProductSave}
                categories={categories}
                onClose={closeModal}
              />
            </Modal>
          </>
        );
      case "pricing":
        return (
          <>
            <PricingRuleList
              rules={pricingRules}
              onAdd={() => openModal("pricing")}
              onEdit={(r) => openModal("pricing", r)}
              onDelete={(id) => handleDelete("pricing", id)}
            />
            <Modal isOpen={modal.isOpen && modal.type === "pricing"} onClose={closeModal}>
              <PricingRuleForm
                rule={modal.data ?? undefined}
                products={products}
                onClose={closeModal}
                onSave={handleRuleChange}
              />
            </Modal>
          </>
        );
      case "orders":
        return (
          <>
            <OrderList
              orders={orders}
              onAdd={() => openModal("order")}
              onEdit={(o) => openModal("order", o)}
              onDelete={(id) => handleDelete("orders", id)}
            />
            <Modal isOpen={modal.isOpen && modal.type === "order"} onClose={closeModal}>
              <OrderForm
                order={modal.data ?? undefined}
                onSave={(data) => setOrders(modal.data ? orders.map(o => o.id === data.id ? data : o) : [...orders, data])}
                onClose={closeModal}
              />
            </Modal>
          </>
        );
      case "users":
        return (
          <>
            <UserList
              users={users}
              onEdit={(u) => openModal("user", u)}
            />
            <Modal isOpen={modal.isOpen && modal.type === "user"} onClose={closeModal}>
              <UserForm
                user={modal.data ?? undefined}
                onSave={handleUserRoleChange}
                onClose={closeModal}
              />
            </Modal>
          </>
        );
      case "categories":
        return (
          <>
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
                <button
                  onClick={() => setError(null)}
                  className="ml-2 text-red-900 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            )}
            {loading ? (
              <div className="text-center py-8">Loading categories...</div>
            ) : (
              <CategoryList
                categories={categories}
                onAdd={() => openModal("category")}
                onEdit={(c) => openModal("category", c)}
                onDelete={(id) => handleDelete("categories", id)}
              />
            )}
            <Modal isOpen={modal.isOpen && modal.type === "category"} onClose={closeModal}>
              <CategoryForm
                category={modal.data ?? undefined}
                onSave={handleCategorySave}
                onClose={closeModal}
              />
            </Modal>
          </>
        );
      case "reports":
        return (
            <ReportList />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex">
      <Sidebar setActiveSection={setActiveSection} />
      <div className="flex-1 p-6 bg-white">{renderSection()}</div>
    </div>
  );
};

export default Admin;
