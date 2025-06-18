export default function HomePage() {
    return (
    <div className="min-h-screen overflow-y-auto">

      <div className="relative flex flex-row w-full h-[10vh] bg-gray-100">
        <div className="w-[25%] flex flex-row">
          <button
            className="text-[clamp(0.75rem,2vw,1.25rem)] h-full w-[50%] flex items-center justify-center   text-center border border-gray-400 bg-white hover:border-blue-500"
            onClick={() => alert("You clicked the shop button!")}
            >
            {/*Shop*/}
            Shop
          </button>
          <button
            className="text-[clamp(0.75rem,2vw,1.25rem)] h-full w-[50%] flex items-center justify-center text-center border border-gray-400 bg-white hover:border-blue-500"
            onClick={() => alert("You clicked the Contact button!")}
            >
            {/*Contact*/}
            Contact
          </button>
        </div>

        <div className="ml-auto w-[25%] flex flex-row ">
          <button
            className="text-[clamp(0.75rem,2vw,1.25rem)] h-[100%] w-[50%] flex items-center justify-center text-center border border-gray-400 bg-white hover:border-blue-500"
            onClick={() => alert("You clicked the Sign button!")}
            >
            {/*Sign in*/}
            Sign in
          </button>
          <button
            className="text-[clamp(0.75rem,2vw,1.25rem)] h-[100%] w-[50%] flex items-center justify-center text-center border border-gray-400 bg-white hover:border-blue-500"
            onClick={() => alert("You clicked the Cart button!")}
            >
            {/*Cart*/}
            Cart
          </button>
        </div>
        
        
      </div>
      <div className="flex flex-col lg:flex-row w-full">
        <div className="w-full lg:w-1/2 lg:aspect-square bg-red-500 border border-gray-400">
          FlowerShopPlaceholder
        </div>
        <div className="w-full lg:w-[50%]">
          <div className="flex flex-row w-full">
            <div className="w-[50%] aspect-square bg-green-500 border border-gray-400">
            </div>
            <div className="w-[50%] aspect-square bg-gray-500 border border-gray-400">
            </div>  
          </div>
          <div className="flex flex-row w-full">
            <div className="w-[50%] aspect-square bg-gray-500 border border-gray-400">
            </div>
            <div className="w-[50%] aspect-square bg-green-500 border border-gray-400">
            </div>  
          </div>
          <div className="flex flex-row w-full">
            <div className="w-[50%] aspect-square bg-green-500 border border-gray-400">
            </div>
            <div className="w-[50%] aspect-square bg-gray-500 border border-gray-400">
            </div>  
          </div>
          
          <div className="flex flex-row w-full">
            <div className="w-[50%] aspect-square bg-gray-500 border border-gray-400">
            </div>
            <div className="w-[50%] aspect-square bg-green-500 border border-gray-400">
            </div>  
          </div>
          
        </div>
      </div>

      <div className="flex flex-col lg:flex-row w-full">
        <div className="w-full lg:w-1/2 p-10 font-bold text-[clamp(1.5rem,4vw,2.5rem)] border border-gray-400">
          About Us
        </div>
        <div className="ml-auto w-full lg:w-[50%] aspect-square bg-red-500 border border-gray-400">
          AboutUsPlaceholder
        </div>
      </div>

      <div className="flex flex-col lg:flex-row w-full">
        <div className="w-full lg:w-1/2 p-10 font-bold text-[clamp(1.5rem,4vw,2.5rem)] border border-gray-400">
          Why choose us?
        </div>
        <div className="ml-auto w-full lg:w-[50%]">
          <div className="w-full lg:aspect-[5/1] bg-yellow-500 p-6 border border-gray-400">
            <h1 className="font-bold text-gray-800 text-[clamp(1rem,3vw,2rem)]">
              Reason 1
            </h1>
            <h2 className="text-gray-600 mt-2 text-[clamp(0.75rem,2vw,1.25rem)]">
              Explanation 1
            </h2>
          </div>
          <div className="w-full lg:aspect-[5/1] bg-yellow-500 p-6 border border-gray-400">
            <h1 className="font-bold text-gray-800 text-[clamp(1rem,3vw,2rem)]">
              Reason 2
            </h1>
            <h2 className="text-gray-600 mt-2 text-[clamp(0.75rem,2vw,1.25rem)]">
              Explanation 2
            </h2>
          </div>
          <div className="w-full lg:aspect-[5/1] bg-yellow-500 p-6 border border-gray-400">
            <h1 className="font-bold text-gray-800 text-[clamp(1rem,3vw,2rem)]">
              Reason 3
            </h1>
            <h2 className="text-gray-600 mt-2 text-[clamp(0.75rem,2vw,1.25rem)]">
              Explanation 3
            </h2>
          </div>
          <div className="w-full lg:aspect-[5/1] bg-yellow-500 p-6 border border-gray-400">
            <h1 className="font-bold text-gray-800 text-[clamp(1rem,3vw,2rem)]">
              Reason 4
            </h1>
            <h2 className="text-gray-600 mt-2 text-[clamp(0.75rem,2vw,1.25rem)]">
              Explanation 4
            </h2>
          </div>
          <div className="w-full lg:aspect-[5/1] bg-yellow-500 p-6 border border-gray-400">
            <h1 className="font-bold text-gray-800 text-[clamp(1rem,3vw,2rem)]">
              Reason 5
            </h1>
            <h2 className="text-gray-600 mt-2 text-[clamp(0.75rem,2vw,1.25rem)]">
              Explanation 5
            </h2>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row-reverse w-full">
        <div className="w-full lg:w-1/2">
          <div className="w-full h-[75vh] md:h-screen lg:aspect-square lg:h-auto bg-pink-500 border border-gray-400">
          </div>
          <div className="flex flex-col md:flex-row w-full">
            <div className="w-full md:w-1/2 text-center p-2 text-gray-800 text-[clamp(1rem,3vw,2rem)]  border border-gray-400">
              Follow us
            </div>
            <div className="ml-auto w-full md:w-1/2 bg-orange-500 border border-gray-400">
              Placeholder for icon
            </div>
          </div>
        </div>
        
        <div className="w-full lg:w-1/2">
          <div className="w-full aspect-2/1 lg:h-1/2 bg-cyan-500">
          </div>
          <div className="w-full lg:h-1/2 flex flex-col md:flex-row">
            <div className="flex flex-col w-full md:w-1/2">
              <div className="text-center p-2 text-gray-800 text-[clamp(1rem,3vw,2rem)]  border border-gray-400">
                Phone
              </div>
              <div className="lg:flex-1 bg-green-500 border border-gray-400">
                PhonePlaceholder
              </div>
            </div>
            <div className="flex flex-col w-full md:w-1/2">
              <div className="text-center p-2 text-gray-800 text-[clamp(1rem,3vw,2rem)]  border border-gray-400">
                Address
              </div>
              <div className="lg:flex-1 bg-purple-500 border border-gray-400">
                AddressPlaceholder
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full p-10 font-bold text-center text-[clamp(1.5rem,4vw,2.5rem)] border border-gray-400">
        Our Service
      </div>
      <div className="w-full flex flex-col lg:flex-row">
        <div className="w-full h-[75vh] md:h-screen lg:w-1/2 lg:h-auto lg:aspect-square bg-pink-500 border border-gray-400">
          Pic placeholder
        </div>
        <div className="w-full h-screen lg:w-1/2 lg:h-auto lg:aspect-square bg-blue-500 border border-gray-400">
          Flower description placeholder
        </div>
      </div>
      <div className="w-full h-[75vh] md:h-screen lg:h-auto lg:aspect-[2/1] bg-green-200 border border-gray-400">
        Wedding & Event Decor Placeholder
      </div>

      <div className="w-full h-[75vh] lg:h-[50vh] bg-purple-300 border border-gray-400"> 
        Google placeholder
      </div>
      <div className="w-full flex flex-col md:grid md:grid-cols-2 lg:flex lg:flex-row">
        <div className="flex-1 md:grid lg:flex-1 aspect-square bg-yellow-200 border border-gray-400"/> 
        <div className="flex-1 md:grid lg:flex-1 aspect-square bg-orange-200 border border-gray-400"/>
        <div className="flex-1 md:grid lg:flex-1 aspect-square bg-green-200 border border-gray-400"/>
        <div className="flex-1 md:grid lg:flex-1 aspect-square bg-blue-200 border border-gray-400"/>
      </div>

      <section className="h-[20vh] bg-gray-100">
        {/* More scrollable content */}
      </section>
    </div>
    );
}