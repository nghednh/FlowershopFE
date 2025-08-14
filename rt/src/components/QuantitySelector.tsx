import React from 'react';

interface QuantitySelectorProps {
    quantity: number;
    onQuantityChange: (newQuantity: number) => void;
    min?: number;
    max?: number;
    disabled?: boolean;
    label?: string;
    className?: string;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
    quantity,
    onQuantityChange,
    min = 1,
    max = 999,
    disabled = false,
    label = "Quantity",
    className = ""
}) => {
    const handleDecrease = () => {
        const newQuantity = Math.max(min, quantity - 1);
        onQuantityChange(newQuantity);
    };

    const handleIncrease = () => {
        const newQuantity = Math.min(max, quantity + 1);
        onQuantityChange(newQuantity);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || min;
        const newQuantity = Math.min(max, Math.max(min, value));
        onQuantityChange(newQuantity);
    };

    return (
        <div className={`quantity-selector ${className}`}>
            {label && <label htmlFor="quantity" className="quantity-label">{label}</label>}
            <div className="quantity-input">
                <button
                    className="quantity-button"
                    onClick={handleDecrease}
                    disabled={disabled || quantity <= min}
                    type="button"
                >
                    <img src="/button-minus.svg" alt="Decrease quantity" />
                </button>
                <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    min={min}
                    max={max}
                    onChange={handleInputChange}
                    className="quantity-field"
                    disabled={disabled}
                />
                <button
                    className="quantity-button"
                    onClick={handleIncrease}
                    disabled={disabled || quantity >= max}
                    type="button"
                >
                    <img src="/button-plus.svg" alt="Increase quantity" />
                </button>
            </div>
        </div>
    );
};

export default QuantitySelector;