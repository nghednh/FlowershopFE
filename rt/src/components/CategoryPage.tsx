import Header from "./Header";
import Footer from "./Footer";

export default function CategoryPage() {
    return (
        <div className="min-h-screen">
            <div className="sticky top-0 z-50 bg-gray-100">
                <Header />
            </div>
            <div className="w-full flex flex-col lg:flex-row">
                <div className="w-full lg:w-1/2 aspect-square bg-red-200 border border-gray-400">
                    Flower Placeholder
                </div>
                <div className="w-full md:grid md:grid-cols-2 lg:w-1/2 ">
                    <div className="aspect-square bg-blue-100 border border-gray-400">Flower 1</div>
                    <div className="aspect-square bg-green-100 border border-gray-400">Flower 2</div>
                    <div className="aspect-square bg-yellow-100 border border-gray-400">Flower 3</div>
                    <div className="aspect-square bg-orange-100 border border-gray-400">Flower 4</div>
                    <div className="aspect-square bg-purple-100 border border-gray-400">Flower 5</div>
                    <div className="aspect-square bg-pink-100 border border-gray-400">Flower 6</div>
                    <div className="aspect-square bg-gray-100 border border-gray-400">Flower 7</div>
                    <div className="aspect-square bg-cyan-100 border border-gray-400">Flower 8</div>
                    <div className="aspect-square bg-red-100 border border-gray-400">Flower 9</div>
                    <div className="aspect-square bg-blue-100 border border-gray-400">Flower 10</div>
                </div>
            </div>
            <div className="w-full md:grid md:grid-cols-2 lg:flex lg:flex-row">
                <div className="lg:flex-1 aspect-square bg-orange-100 border border-gray-400">Email reminder placeholder</div>
                <div className="lg:flex-1 aspect-square bg-purple-100 border border-gray-400">Contact us placeholder</div>
                <div className="lg:flex-1 aspect-square bg-pink-100 border border-gray-400">Shops placeholder</div>
                <div className="lg:flex-1 aspect-square bg-gray-100 border border-gray-400">About us placehodler</div>
            </div>
            <section className="h-[15vh] bg-gray-100">
                {/* More scrollable content */}
            </section>
            <Footer />
        </div>
    )
}