import Button from "./Button";
import Header from "./Header";


export default function HomePage() {
    return (
    <div className="min-h-screen">
      <Header>
      </Header>
      <div className="relative sticky top-0 z-50 flex flex-row w-full h-[10vh] bg-white border border-gray-100" >
        <div className="w-[25%] flex flex-row  border border-gray-100">
          <button
            className="text-[clamp(0.75rem,2vw,1.25rem)] h-full w-[50%] flex items-center justify-center   text-center border border-gray-400 bg-white hover:bg-gray-200"
            onClick={() => alert("You clicked the shop button!")}
            >
            {/*Shop*/}
            Shop
          </button>
          <button
            className="text-[clamp(0.75rem,2vw,1.25rem)] h-full w-[50%] flex items-center justify-center text-center border border-gray-400 bg-white hover:bg-gray-200"
            onClick={() => alert("You clicked the Contact button!")}
            >
            {/*Contact*/}
            Contact
          </button>
        </div>

        <div className="ml-auto w-[25%] flex flex-row ">
          <button
            className="text-[clamp(0.75rem,2vw,1.25rem)] h-[100%] w-[50%] flex items-center justify-center text-center border border-gray-400 bg-white hover:bg-gray-200"
            onClick={() => alert("You clicked the Sign button!")}
            >
            {/*Sign in*/}
            Sign in
          </button>
          <button
            className="text-[clamp(0.75rem,2vw,1.25rem)] h-[100%] w-[50%] flex items-center justify-center text-center border border-gray-400 bg-white hover:bg-gray-200"
            onClick={() => alert("You clicked the Cart button!")}
            >
            {/*Cart*/}
            Cart
          </button>
        </div>
        
        
      </div>
      <div className="flex flex-col lg:flex-row w-full">
        <div className="w-full lg:w-1/2 border border-gray-400">
          <div className="aspect-square bg-gray-100 border border-gray-400">
          {/* Container: vertical split using grid */}
            <div className="grid grid-rows-2 h-full w-full divide-y divide-gray-100">
              
              {/* Top half */}
              <div className="flex flex-col items-left mt-10 ml-10 mr-10 justify-center bg-gray-100 border-b-2 border-gray-400">
                <p className="text-[clamp(1.5rem,7.5vw,4.5rem)] lg:text-[clamp(1rem,5vw,3rem)] font-bold">
                  Flower<br/>
                  Shop
                </p>
                <p className="text-[clamp(1rem,5vw,3rem)] lg:text-[clamp(0.5rem,2.5vw,1.5rem)]">
                  Where you go to buy flower: <br/>
                  Insert quote
                </p>
              </div>

              {/* Bottom half: horizontally split */}
              <div className="grid grid-cols-2 divide-x divide-gray-400 mt-5 mb-15 mx-10">
                <div className="flex items-center justify-center bg-green-100">
                  <p>Bottom Left</p>
                </div>
                <div className="flex items-end justify-center bg-gray-100 pl-5 border-l-2 border-gray-400">
                  <p className="text-[clamp(0.5rem,3vw,2rem)] lg:text-[clamp(0.25rem,1.5vw,1rem)]">Experience the joy of giving with our modern floral studio. Order online and send fresh flowers, plants and gifts today.</p>
                </div>
              </div>

            </div>
          </div>
        </div>
        <div className="w-full lg:w-[50%]">
          <div className="flex flex-row w-full">
            <div className="w-[50%] relative flex items-center justify-center aspect-square bg-gray-100 border border-gray-400">
              <div className="flex-1 flex items-center justify-center text-[clamp(1.25rem,6.25vw,3.75rem)] lg:text-[clamp(0.625rem,3.125vw,1.875rem)] text-center">
                Fresh Flowers
              </div>

              {/* Small bottom text with hyperlink */}
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[clamp(0.5rem,3vw,2rem)] lg:text-[clamp(0.25rem,1.5vw,1rem)]">
                {' '}
                <a href="#" className="text-gray-700 hover:font-bold">
                  Shop now
                  <span className="ml-1">→</span>
                </a>
              </p>
            </div>
            <div className="w-[50%] aspect-square bg-gray-500 border border-gray-400">
            </div>  
          </div>
          <div className="flex flex-row w-full">
            <div className="w-[50%] aspect-square bg-gray-500 border border-gray-400">
            </div>
            <div className="w-[50%] relative flex items-center justify-center aspect-square bg-gray-100 border border-gray-400">
              <div className="flex-1 flex items-center justify-center text-[clamp(1.25rem,6.25vw,3.75rem)] lg:text-[clamp(0.625rem,3.125vw,1.875rem)] text-center">
                Dried Flowers
              </div>

              {/* Small bottom text with hyperlink */}
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[clamp(0.5rem,3vw,2rem)] lg:text-[clamp(0.25rem,1.5vw,1rem)]">
                {' '}
                <a href="#" className="text-gray-700 hover:font-bold">
                  <span className="mr-1">←</span>
                  Shop now
                </a>
              </p>
            </div> 
          </div>
          <div className="flex flex-row w-full">
            <div className="w-[50%] relative flex items-center justify-center aspect-square bg-gray-100 border border-gray-400">
              <div className="flex-1 flex items-center justify-center text-[clamp(1.25rem,6.25vw,3.75rem)] lg:text-[clamp(0.625rem,3.125vw,1.875rem)] text-center">
                Live Plants
              </div>

              {/* Small bottom text with hyperlink */}
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[clamp(0.5rem,3vw,2rem)] lg:text-[clamp(0.25rem,1.5vw,1rem)]">
                {' '}
                <a href="#" className="text-gray-700 hover:font-bold">
                  Shop now
                  <span className="ml-1">→</span>
                </a>
              </p>
            </div>
            <div className="w-[50%] aspect-square bg-gray-500 border border-gray-400">
            </div>  
          </div>
          
          <div className="flex flex-row w-full">
            <div className="w-[50%] aspect-square bg-gray-500 border border-gray-400">
            </div>
            <div className="w-[50%] relative flex items-center justify-center aspect-square bg-gray-100 border border-gray-400">
              <div className="flex-1 flex items-center justify-center text-[clamp(1.25rem,6.25vw,3.75rem)] lg:text-[clamp(0.625rem,3.125vw,1.875rem)] text-center">
                Aroma Candles
              </div>

              {/* Small bottom text with hyperlink */}
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[clamp(0.5rem,3vw,2rem)] lg:text-[clamp(0.25rem,1.5vw,1rem)]">
                {' '}
                <a href="#" className="text-gray-700 hover:font-bold">
                  <span className="mr-1">←</span>
                  Shop now
                </a>
              </p>
            </div> 
          </div>
          
        </div>
      </div>

      <div className="flex flex-col lg:flex-row w-full">
        <div className="w-full lg:w-1/2 p-10 font-bold text-[clamp(1.5rem,4vw,2.5rem)] border border-gray-400">
          About Us
        </div>
        <div className="w-full lg:w-[50%] flex flex-col bg-gray-100 border border-gray-400 p-[clamp(1rem,9vw,4.5rem)]">
          <div className="text-[clamp(0.5rem,3vw,2rem)] lg:text-[clamp(0.25rem,1.5vw,1rem)]">OUR STORY</div>
          <div className="text-[clamp(1.25rem,6.25vw,3.75rem)] lg:text-[clamp(0.625rem,3.125vw,1.875rem)] my-3">FlowerShop</div>
          <div className="text-[clamp(0.5rem,3vw,2rem)] lg:text-[clamp(0.25rem,1.5vw,1rem)] my-3">
            We are a modern local floral studio, which specializes in the design and delivery of unique bouquets. We have the best florists who carefully select each look, our studio cooperates directly with farms for growing different flowers, so we always have fresh flowers, which are collected by our florists in exquisite bouquets. We have a collection of fresh bouquets, collections of dried bouquets, house plants, as well as fragrant candles from luxury brands to create the perfect atmosphere. Make someone's day amazing by sending flowers, plants and gifts the same or next day. Ordering flowers online has never been easier.
          </div>
          <button className="w-max text-[clamp(0.75rem,2vw,1.25rem)] py-4 px-8 border border-gray-400 mt-10 hover:bg-gray-200">
            LEARN MORE
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row w-full">
        <div className="w-full lg:w-1/2 p-10 font-bold text-[clamp(1.5rem,4vw,2.5rem)] border border-gray-400">
          Why choose us?
        </div>
        <div className="ml-auto w-full lg:w-[50%]">
          <div className="w-full h-max bg-gray-100 p-[clamp(1rem,9vw,4.5rem)] border border-gray-400">
            <div className="text-[clamp(1.25rem,6.25vw,3.75rem)] lg:text-[clamp(0.625rem,3.125vw,1.875rem)] mb-6">Stylish bouquets by florists</div>
            <div className="text-[clamp(0.5rem,3vw,2rem)] lg:text-[clamp(0.25rem,1.5vw,1rem)]">
              At our floral studio, our professional florists craft the most elegant and stylish bouquets using only the freshest and highest quality materials available. We stay up-to-date with the latest floral design trends and offer unique arrangements that are sure to impress. Let us brighten up your day with our stunning bouquets and same-day delivery service.            
            </div>
          </div>
          <div className="w-full h-max bg-gray-100 p-[clamp(1rem,9vw,4.5rem)] border border-gray-400">
            <div className="text-[clamp(1.25rem,6.25vw,3.75rem)] lg:text-[clamp(0.625rem,3.125vw,1.875rem)] mb-6">On-time delivery</div>
            <div className="text-[clamp(0.5rem,3vw,2rem)] lg:text-[clamp(0.25rem,1.5vw,1rem)]">
              Never miss a moment with our on-time flower delivery service. Our couriers will deliver your bouquet personally, without boxes, to ensure it arrives in perfect condition. Trust us to deliver your thoughtful gift reliably.
            </div>
          </div>
          <div className="w-full h-max bg-gray-100 p-[clamp(1rem,9vw,4.5rem)] border border-gray-400">
            <div className="text-[clamp(1.25rem,6.25vw,3.75rem)] lg:text-[clamp(0.625rem,3.125vw,1.875rem)] mb-6">Safe payment</div>
            <div className="text-[clamp(0.5rem,3vw,2rem)] lg:text-[clamp(0.25rem,1.5vw,1rem)]">
              You can feel secure when placing an order with us, as we use industry-standard security measures to protect your payment information. Your transaction will be safe and hassle-free, so you can shop with confidence.
            </div>
          </div>
          <div className="w-full h-max bg-gray-100 p-[clamp(1rem,9vw,4.5rem)] border border-gray-400">
            <div className="text-[clamp(1.25rem,6.25vw,3.75rem)] lg:text-[clamp(0.625rem,3.125vw,1.875rem)] mb-6">Subscription by your needs</div>
            <div className="text-[clamp(0.5rem,3vw,2rem)] lg:text-[clamp(0.25rem,1.5vw,1rem)]">
              With our subscription service tailored to your specific needs, you can enjoy the convenience of having beautiful bouquets delivered straight to your door at regular intervals. Our flexible service is perfect for busy individuals or those who want to ensure they always have fresh flowers on hand. You'll save time and money with this hassle-free solution to your floral needs.
            </div>
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