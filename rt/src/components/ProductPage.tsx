export default function ProductPage() {
    // Example product data (replace with real data/fetch logic)
    const products = [
        { id: 1, name: "Rose Bouquet", price: 29.99, description: "A beautiful bouquet of roses." },
        { id: 2, name: "Tulip Arrangement", price: 19.99, description: "Colorful tulip arrangement." },
    ];

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6">Products</h1>
            <div className="grid gap-6 md:grid-cols-2">
                {products.map((product) => (
                    <div key={product.id} className="border rounded p-4 shadow">
                        <h2 className="text-xl font-semibold">{product.name}</h2>
                        <p className="text-gray-600 mb-2">{product.description}</p>
                        <div className="font-bold mb-2">${product.price.toFixed(2)}</div>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}