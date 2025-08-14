import React from "react";

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

const PaymentFailedPage: React.FC = () => {
    return <OrderFailurePage />;
};

export default PaymentFailedPage;
