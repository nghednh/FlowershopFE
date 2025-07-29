import React from "react";
import { IProduct, ICategory, IPricingRule, IOrder, IUser } from "../types/backend"
import { Button } from "./Button";
import {Sidebar } from "./Admin/Sidebar";
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

// Mock data
const mockCategories: ICategory[] = [
    { id: 1, name: "Roses", description: "Classic romantic flowers" },
    { id: 2, name: "Tulips", description: "Spring favorites" },
    { id: 3, name: "Lilies", description: "Elegant and fragrant" },
];

const mockProducts: IProduct[] = [
    {
        id: 1,
        name: "Red Rose Bouquet",
        flowerStatus: 1,
        description: "A bouquet of fresh red roses.",
        basePrice: 29.99,
        condition: "Fresh",
        stockQuantity: 15,
        isActive: true,
        images: ["rose1.jpg"],
        categoryIds: [1],
    },
    {
        id: 2,
        name: "White Lily Arrangement",
        flowerStatus: 1,
        description: "Elegant white lilies in a vase.",
        basePrice: 34.99,
        condition: "Fresh",
        stockQuantity: 10,
        isActive: true,
        images: ["lily1.jpg"],
        categoryIds: [3],
    },
    {
        id: 3,
        name: "Mixed Tulip Bunch",
        flowerStatus: 1,
        description: "Colorful tulips for spring.",
        basePrice: 19.99,
        condition: "Fresh",
        stockQuantity: 20,
        isActive: true,
        images: ["tulip1.jpg"],
        categoryIds: [2],
    },
];

const mockPricingRules: IPricingRule[] = [
    {
        id: 1,
        description: "Valentine's Day Special",
        condition: "date",
        specialDay: "Valentine's Day",
        startTime: "08:00",
        endTime: "20:00",
        startDate: "2024-02-14T00:00:00Z",
        endDate: "2024-02-14T23:59:59Z",
        priceMultiplier: 1.2,
        fixedPrice: null,
        priority: 1,
        productIds: [1],
    },
    {
        id: 2,
        description: "Spring Discount",
        condition: "season",
        specialDay: null,
        startTime: null,
        endTime: null,
        startDate: "2024-03-01T00:00:00Z",
        endDate: "2024-05-31T23:59:59Z",
        priceMultiplier: 0.9,
        fixedPrice: null,
        priority: 2,
        productIds: [2, 3],
    },
];

const mockOrders: IOrder[] = [
    {
        id: 1,
        userId: 1,
        cartId: 101,
        addressId: 201,
        paymentMethod: 0,
        totalAmount: 59.98,
        status: "Completed",
        createdAt: "2024-06-01T10:30:00Z",
        updatedAt: "2024-06-01T12:00:00Z",
    },
    {
        id: 2,
        userId: 2,
        cartId: 102,
        addressId: 202,
        paymentMethod: 1,
        totalAmount: 34.99,
        status: "Pending",
        createdAt: "2024-06-02T14:15:00Z",
        updatedAt: undefined,
    },
];

const mockUsers: IUser[] = [
    {
        firstName: "Alice",
        lastName: "Smith",
        email: "alice@example.com",
        userName: "alice",
        roleName: "admin",
        isActive: true,
        createdAt: "2024-01-10T09:00:00Z",
        updatedAt: "2024-05-01T08:00:00Z",
    },
    {
        firstName: "Bob",
        lastName: "Johnson",
        email: "bob@example.com",
        userName: "bobby",
        roleName: "user",
        isActive: true,
        createdAt: "2024-02-15T11:30:00Z",
        updatedAt: undefined,
    },
];

const Admin = () => {
    const [activeSection, setActiveSection] = React.useState("flowers");
    const [products, setProducts] = React.useState(mockProducts);
    const [pricingRules, setPricingRules] = React.useState(mockPricingRules);
    const [orders, setOrders] = React.useState(mockOrders);
    const [users, setUsers] = React.useState(mockUsers);
    const [categories, setCategories] = React.useState(mockCategories);
    const [modal, setModal] = React.useState({ isOpen: false, type: "", data: null });

    const openModal = (type: string, data: any = null) => setModal({ isOpen: true, type, data });
    const closeModal = () => setModal({ isOpen: false, type: "", data: null });

    const handleDelete = (type: string, id: number | string) => {
        if (type === "flowers") setProducts(products.filter(p => p.id !== id));
        if (type === "pricing") setPricingRules(pricingRules.filter(r => r.id !== id));
        if (type === "orders") setOrders(orders.filter(o => o.id !== id));
        if (type === "users") setUsers(users.filter(u => u.userName !== id));
        if (type === "categories") setCategories(categories.filter(c => c.id !== id));
    };

    const renderSection = () => {
        switch (activeSection) {
            case "flowers":
                return (
                    <>
                        <FlowerList
                            products={products}
                            onAdd={() => openModal("flower")}
                            onEdit={(p) => openModal("flower", p)}
                            onDelete={(id) => handleDelete("flowers", id)}
                        />
                        <Modal isOpen={modal.isOpen && modal.type === "flower"} onClose={closeModal}>
                            <FlowerForm
                                flower={modal.data ?? undefined}
                                onSave={(data) => setProducts(modal.data ? products.map(p => p.id === data.id ? data : p) : [...products, data])}
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
                                onSave={(data) => setPricingRules(modal.data ? pricingRules.map(r => r.id === data.id ? data : r) : [...pricingRules, data])}
                                products={products}
                                onClose={closeModal}
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
                                onSave={(data) => setOrders(modal.data  ? orders.map(o => o.id === data.id ? data : o) : [...orders, data])}
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
                            onAdd={() => openModal("user")}
                            onEdit={(u) => openModal("user", u)}
                            onDelete={(id) => handleDelete("users", id)}
                        />
                        <Modal isOpen={modal.isOpen && modal.type === "user"} onClose={closeModal}>
                            <UserForm
                                user={modal.data ?? undefined}
                                onSave={(data) => setUsers(modal.data ? users.map(u => u.userName === data.userName ? data : u) : [...users, data])}
                                onClose={closeModal}
                            />
                        </Modal>
                    </>
                );
            case "categories":
                return (
                    <>
                        <CategoryList
                            categories={categories}
                            onAdd={() => openModal("category")}
                            onEdit={(c) => openModal("category", c)}
                            onDelete={(id) => handleDelete("categories", id)}
                        />
                        <Modal isOpen={modal.isOpen && modal.type === "category"} onClose={closeModal}>
                            <CategoryForm
                                category={modal.data ?? undefined}
                                onSave={(data) => setCategories(modal.data ? categories.map(c => c.id === data.id ? data : c) : [...categories, data])}
                                onClose={closeModal}
                            />
                        </Modal>
                    </>
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
