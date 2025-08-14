import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PaymentMethod } from "../types/backend.d";

const OrderSuccessPage = ({ orderDetails, paymentMethod, addressData, totalAmount }: {
    orderDetails: any,
    paymentMethod: PaymentMethod,
    addressData: any,
    totalAmount: number
}) => (
    <div className="checkout-page enhanced-checkout" style={{ background: 'linear-gradient(90deg, #f3e8ff 0%, #fff1f2 100%)' }}>
        <div className="contact-info">
            <div className="order-success" style={{ background: 'linear-gradient(90deg, #f3e8ff 0%, #fff1f2 100%)', borderRadius: 18, padding: 40, textAlign: 'center' }}>
                <div className="success-icon" style={{ fontSize: 64, marginBottom: 16, color: '#db2777' }}>✅</div>
                <h2 className="success-title" style={{ background: 'linear-gradient(90deg, #db2777 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800, fontSize: '2rem', marginBottom: 24 }}>Order Placed Successfully!</h2>
                <div className="success-details" style={{ background: '#fff1f2', padding: 24, borderRadius: 18, border: '1px solid #db2777', textAlign: 'left', width: '100%', maxWidth: 500, margin: '0 auto' }}>
                    <p><strong>Order ID:</strong> {orderDetails?.id}</p>
                    <p><strong>Total Amount:</strong> <span style={{ color: '#db2777', fontWeight: 700 }}>
                        {orderDetails && orderDetails.totalAmount
                            ? `$${orderDetails.totalAmount.toFixed(2)}`
                            : `$${(totalAmount).toFixed(2)}`}
                    </span></p>
                    <p><strong>Payment Method:</strong> {
                        paymentMethod === PaymentMethod.COD ? 'Cash on Delivery' :
                            paymentMethod === PaymentMethod.PayPal ? 'PayPal' :
                                paymentMethod === PaymentMethod.VNPay ? 'VNPay' : 'Unknown'
                    }</p>
                    <p><strong>Delivery Address:</strong> {addressData.fullName}, {addressData.streetAddress}, {addressData.city}</p>
                    {paymentMethod === PaymentMethod.COD && (
                        <p className="cod-note" style={{ background: 'linear-gradient(90deg, #e8f5e8 60%, #db2777 100%)', padding: 12, borderRadius: 4, marginTop: 16, fontWeight: 500 }}>💰 You will pay when your order is delivered.</p>
                    )}
                    {paymentMethod !== PaymentMethod.COD && (
                        <p className="payment-note" style={{ background: 'linear-gradient(90deg, #e8f5e8 60%, #db2777 100%)', padding: 12, borderRadius: 4, marginTop: 16, fontWeight: 500 }}>💳 Payment has been processed successfully.</p>
                    )}
                </div>
                <div className="success-actions" style={{ display: 'flex', gap: 16, marginTop: 24, justifyContent: 'center' }}>
                    <button
                        className="track-order-btn"
                        style={{ padding: '16px 24px', fontSize: 16, fontWeight: 500, borderRadius: 10, cursor: 'pointer', textTransform: 'uppercase', background: 'linear-gradient(90deg, #db2777 60%, #7c3aed 100%)', color: 'white', border: 'none', boxShadow: '0 2px 12px #db277744' }}
                        onClick={() => window.location.href = `/orders/${orderDetails?.id}`}
                    >
                        <span role="img" aria-label="track">📦</span> Track Your Order
                    </button>
                    <button
                        className="continue-shopping-btn"
                        style={{ padding: '16px 24px', fontSize: 16, fontWeight: 500, borderRadius: 10, cursor: 'pointer', textTransform: 'uppercase', background: 'linear-gradient(90deg, #10B981 60%, #db2777 100%)', color: 'white', border: 'none', boxShadow: '0 2px 12px #db277744' }}
                        onClick={() => window.location.href = '/home'}
                    >
                        <span role="img" aria-label="shop">🌸</span> Continue Shopping
                    </button>
                </div>
            </div>
        </div>
        <div className="order-summary">
            <h2 className="breadcrumb" style={{ background: 'linear-gradient(90deg, #db2777 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800, fontSize: '2rem', marginBottom: 24 }}>Order Confirmation</h2>
            <div className="order-summary-section">
                <div className="confirmation-message" style={{ background: 'linear-gradient(90deg, #e8f5e8 0%, #fff1f2 100%)', borderRadius: 18, padding: 40, textAlign: 'center' }}>
                    <h3 style={{ background: 'linear-gradient(90deg, #27ae60 0%, #db2777 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800, fontSize: '1.5rem', marginBottom: 16 }}>Thank you for your purchase!</h3>
                    <p style={{ color: '#7c3aed', fontWeight: 600 }}>Your order has been successfully placed and will be processed shortly.</p>
                    {paymentMethod === PaymentMethod.COD ? (
                        <p style={{ color: '#db2777', fontWeight: 600 }}>Please have the exact amount ready when your order arrives.</p>
                    ) : (
                        <p style={{ color: '#db2777', fontWeight: 600 }}>Payment confirmation will be sent to your email.</p>
                    )}
                </div>
            </div>
        </div>
    </div>
);

const OrderFailurePage = () => (
    <div className="checkout-page enhanced-checkout" style={{ background: 'linear-gradient(90deg, #fff1f2 0%, #f3e8ff 100%)', borderRadius: 18, padding: 40, textAlign: 'center' }}>
        <div className="order-failure" style={{ color: '#dc2626', fontWeight: 700, fontSize: '2rem', marginBottom: 24 }}>
            ❌ Order Failed
        </div>
        <div className="failure-details" style={{ background: '#fde7e7', padding: 24, borderRadius: 18, border: '1px solid #dc2626', textAlign: 'center', width: '100%', maxWidth: 500, margin: '0 auto' }}>
            <p>We're sorry, but your order could not be processed.</p>
            <p>Please try again or contact support if the issue persists.</p>
        </div>
        <button
            className="continue-shopping-btn"
            style={{ marginTop: 24, padding: '16px 24px', fontSize: 16, fontWeight: 500, borderRadius: 10, cursor: 'pointer', textTransform: 'uppercase', background: 'linear-gradient(90deg, #10B981 60%, #db2777 100%)', color: 'white', border: 'none', boxShadow: '0 2px 12px #db277744' }}
            onClick={() => window.location.href = '/home'}
        >
            <span role="img" aria-label="shop">🌸</span> Continue Shopping
        </button>
    </div>
);

const PaymentSuccessPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const paymentId = Number(searchParams.get("paymentId"));
    const [orderDetails, setOrderDetails] = useState<any>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.COD);
    const [addressData, setAddressData] = useState<any>({});
    const [totalAmount, setTotalAmount] = useState<number>(0);

    useEffect(() => {
        async function fetchOrder() {
            try {
                if (!paymentId) return;
                const paymentRes = await import('../api/payment.api').then(mod => mod.PaymentService.getPaymentStatus(paymentId));
                const orderRes = await import('../api/order.api').then(mod => mod.OrderService.getOrderDetails(paymentRes.data.orderId));
                setOrderDetails("orderRes.data: " + JSON.stringify(orderRes));
                setPaymentMethod(paymentRes.data.method);
                setTotalAmount(paymentRes.data.amount);
                setAddressData({
                    fullName: orderRes.data.address.fullName,
                    streetAddress: orderRes.data.address.streetAddress,
                    city: orderRes.data.address.city,
                });
                console.log("addressData", addressData);
            } catch (error) {
                console.error("Error fetching payment or order details:", error);
            }
        }
        fetchOrder();
    }, [paymentId]);

    return (
        <OrderSuccessPage
            orderDetails={orderDetails}
            paymentMethod={paymentMethod}
            addressData={addressData}
            totalAmount={totalAmount}
        />
    );
};

export default PaymentSuccessPage;