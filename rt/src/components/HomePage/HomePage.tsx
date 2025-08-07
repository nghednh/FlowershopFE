import GoogleSlides from "./GoogleSlides";

export default function HomePage() {
    return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative">
        <div className="flex flex-col lg:flex-row w-full min-h-screen">
          {/* Left Hero Content */}
          <div className="w-full lg:w-1/2 bg-gradient-to-br from-pink-50 to-purple-50 border border-gray-200">
            <div className="h-full flex flex-col justify-between p-8 lg:p-16">
              
              {/* Main Hero Text */}
              <div className="flex-1 flex flex-col justify-top">
                <div className="space-y-6">
                  <h1 className="text-5xl lg:text-7xl font-bold text-gray-800 leading-tight">
                    Flower<br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Shop</span>
                  </h1>
                  <p className="text-xl lg:text-2xl text-gray-600 max-w-lg leading-relaxed">
                    Where beauty blooms and memories are made.<br/>
                    <span className="text-lg font-medium text-pink-500">"Every flower speaks a language of love"</span>
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <button 
                      onClick={() => window.location.href = '/list'}
                      className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                      Shop Now
                    </button>
                    <button 
                      onClick={() => window.location.href = '/contact'}
                      className="px-8 py-4 border-2 border-pink-500 text-pink-500 font-semibold rounded-full hover:bg-pink-500 hover:text-white transition-all duration-200"
                    >
                      Contact Us
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Image Section */}
              <div className="mt-8 lg:mt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative overflow-hidden rounded-2xl shadow-lg">
                    <img
                      src="/images/floral_studio.jpg"
                      alt="Floral Studio"
                      className="w-full h-32 lg:h-40 object-cover hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 text-white font-medium">Studio</div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg border">
                    <div className="text-sm text-gray-600 mb-2">Experience</div>
                    <p className="text-gray-800 text-sm leading-relaxed">
                      Professional floral arrangements crafted with love and delivered fresh to your door.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Hero Grid */}
          <div className="w-full lg:w-1/2">
            <div className="grid grid-cols-2 h-full">
              
              {/* Fresh Flowers */}
              <div className="relative group cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center border border-gray-200 z-10">
                  <div className="text-center">
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
                      Fresh<br/>Flowers
                    </h3>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <a href="/list?categories=1" className="inline-flex items-center text-green-600 font-semibold hover:text-green-700">
                        Shop now <span className="ml-2">→</span>
                      </a>
                    </div>
                  </div>
                </div>
                <img
                  src="/images/fresh_flower.jpg"
                  alt="Fresh Flowers"
                  className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                />
              </div>

              {/* Fresh Flowers Image */}
              <div className="relative overflow-hidden">
                <img
                  src="/images/fresh_flower.jpg"
                  alt="Fresh Flowers"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>

              {/* Dried Flowers Image */}
              <div className="relative overflow-hidden">
                <img
                  src="/images/dried_flower.jpg"
                  alt="Dried Flowers"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>

              {/* Dried Flowers */}
              <div className="relative group cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center border border-gray-200 z-10">
                  <div className="text-center">
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
                      Dried<br/>Flowers
                    </h3>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <a href="/list?categories=2" className="inline-flex items-center text-orange-600 font-semibold hover:text-orange-700">
                        <span className="mr-2">←</span> Shop now
                      </a>
                    </div>
                  </div>
                </div>
                <img
                  src="/images/dried_flower.jpg"
                  alt="Dried Flowers"
                  className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                />
              </div>

              {/* Live Plants */}
              <div className="relative group cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center border border-gray-200 z-10">
                  <div className="text-center">
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
                      Live<br/>Plants
                    </h3>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <a href="/list?categories=3" className="inline-flex items-center text-teal-600 font-semibold hover:text-teal-700">
                        Shop now <span className="ml-2">→</span>
                      </a>
                    </div>
                  </div>
                </div>
                <img
                  src="/images/live_plant.jpg"
                  alt="Live Plants"
                  className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                />
              </div>

              {/* Live Plants Image */}
              <div className="relative overflow-hidden">
                <img
                  src="/images/live_plant.jpg"
                  alt="Live Plants"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>

              {/* Aroma Candles Image */}
              <div className="relative overflow-hidden">
                <img
                  src="/images/aroma_candle.png"
                  alt="Aroma Candles"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>

              {/* Aroma Candles */}
              <div className="relative group cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center border border-gray-200 z-10">
                  <div className="text-center">
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
                      Aroma<br/>Candles
                    </h3>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <a href="/list?categories=4" className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700">
                        <span className="mr-2">←</span> Shop now
                      </a>
                    </div>
                  </div>
                </div>
                <img
                  src="/images/aroma_candle.png"
                  alt="Aroma Candles"
                  className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-8">
                About Us
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                We are passionate about bringing beauty into your life through our carefully curated selection of fresh flowers, plants, and unique gifts.
              </p>
            </div>
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg border">
                <div className="text-pink-500 text-sm font-semibold tracking-wider uppercase mb-3">
                  OUR STORY
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-6">
                  FlowerShop
                </h3>
                <p className="text-gray-600 leading-relaxed mb-8">
                  We are a modern local floral studio, which specializes in the design and delivery of unique bouquets. We have the best florists who carefully select each look, our studio cooperates directly with farms for growing different flowers, so we always have fresh flowers, which are collected by our florists in exquisite bouquets.
                </p>
                <button className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
                  LEARN MORE
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="flex items-center">
              <h2 className="text-5xl lg:text-6xl font-bold text-gray-800">
                Why choose us?
              </h2>
            </div>
            <div className="space-y-6">
              {[
                {
                  title: "Stylish bouquets by florists",
                  description: "At our floral studio, our professional florists craft the most elegant and stylish bouquets using only the freshest and highest quality materials available."
                },
                {
                  title: "On-time delivery",
                  description: "Never miss a moment with our on-time flower delivery service. Our couriers will deliver your bouquet personally, without boxes, to ensure it arrives in perfect condition."
                },
                {
                  title: "Safe payment",
                  description: "You can feel secure when placing an order with us, as we use industry-standard security measures to protect your payment information."
                },
                {
                  title: "Subscription by your needs",
                  description: "With our subscription service tailored to your specific needs, you can enjoy the convenience of having beautiful bouquets delivered straight to your door at regular intervals."
                }
              ].map((item, index) => (
                <div key={index} className="bg-gradient-to-r from-gray-50 to-white p-8 rounded-2xl shadow-lg border hover:shadow-xl transition-all duration-300">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row-reverse w-full">
        <div className="w-full lg:w-1/2">
          <div className="w-full h-[75vh] md:h-screen lg:aspect-square lg:h-auto bg-pink-500 border border-gray-400">
            <img
              src="/images/front_door.png"
              alt="Example"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col md:flex-row w-full">
            <div className="w-full md:w-1/2 text-center p-2 text-gray-800 text-[clamp(1rem,3vw,2rem)]  border border-gray-400">
              Follow us
            </div>
            <div className="ml-auto w-full md:w-1/2 bg-gray-100 border border-gray-400">
              <div className="flex flex-row items-center justify-center w-max md:w-full h-full">
                <img src="/Instagram.svg" alt="instagram" className="flex-1 w-7 h-7 m-3 cursor-pointer" onClick={() => alert("You clicked the Instagram button!")}/>
                <img src="/Pinterest.svg" alt="pinterest" className="flex-1 w-7 h-7 m-3 cursor-pointer" onClick={() => alert("You clicked the Pinterest button!")}/>
                <img src="/Facebook.svg" alt="facebook" className="flex-1 w-7 h-7 m-3 cursor-pointer" onClick={() => alert("You clicked the Facebook button!")}/>
                <img src="/Twitter.svg" alt="twitter" className="flex-1 w-7 h-7 m-3 cursor-pointer" onClick={() => alert("You clicked the Twitter button!")}/>
                <img src="/Telegram.svg" alt="telegram" className="flex-1 w-7 h-7 m-3 cursor-pointer" onClick={() => alert("You clicked the Telegram button!")}/>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full lg:w-1/2">
          <div className="w-full h-max lg:h-1/2 bg-white border border-gray-400" id="contact">
            <div className="pt-10 pl-10 font-bold text-[clamp(1.5rem,4vw,2.5rem)]">
              To Contact Us
            </div>
            <div className="pt-3 pl-10 text-[clamp(0.5rem,3vw,2rem)] lg:text-[clamp(0.25rem,1.5vw,1rem)]">
              We will call you back
            </div>
            <div className="my-[clamp(0.5rem,3vw,1.5rem)] mx-auto w-7/9 flex flex-col md:flex-row">
              <input
                type="text"
                placeholder="+84 XXX XXX XX XX"
                className="w-full md:w-1/2 border border-gray-300 md:-translate-x-3 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
              </input>
              <button className="w-full md:w-1/2 bg-black text-white md:translate-x-3 p-2 mt-3 md:my-0 hover:bg-gray-800 cursor-pointer">
                BOOK A CALL
              </button>
            </div>
          </div>
          <div className="w-full lg:h-1/2 flex flex-col md:flex-row">
            <div className="flex flex-col w-full md:w-1/2">
              <div className="text-center p-2 text-gray-800 text-[clamp(1rem,3vw,2rem)]  border border-gray-400">
                Phone
              </div>
              <div className="flex flex-col flex-1 item:left md:items-center justify-center bg-gray-100 border border-gray-400">
                <p className="m-3">
                  <img src="/phone.svg" alt="phonecall" className="mr-1 w-7 h-7 inline-block cursor-pointer" onClick={() => alert("You clicked the Phone1 button!")}>
                  </img>
                    <span className="font-bold">+0123456789</span>
                </p>
                <a className="m-3">
                 <img src="/phone.svg" alt="phonecall" className="mr-1 w-7 h-7 inline-block cursor-pointer" onClick={() => alert("You clicked the Phone2 button!")}>
                  </img>
                    <span className="font-bold">+0123456789</span>
                </a>
              </div>
            </div>
            <div className="flex flex-col w-full md:w-1/2">
              <div className="text-center p-2 text-gray-800 text-[clamp(1rem,3vw,2rem)]  border border-gray-400">
                Address
              </div>
              <div className="flex flex-col flex-1 item:left md:items-center justify-center bg-gray-100 border border-gray-400">
                <p className="m-3">
                  OPENING HOURS: 8 A.M. TO 11 P.M.
                </p>
                <a className="m-3">
                 <img src="/address.svg" alt="address" className="mr-1 w-7 h-7 inline-block cursor-pointer" onClick={() => alert("You clicked the Address button!")}>
                  </img>
                    <span className="font-bold">Somewhere on earth</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section Header */}
      <section className="py-16 bg-white">
        <div className="text-center">
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From subscriptions to special events, we're here to make every moment beautiful
          </p>
        </div>
      </section>

      {/* Flower Subscription Service */}
      <section className="relative">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 relative overflow-hidden">
            <img
              src="/images/subscription_flower.jpg"
              alt="Flower Subscription Service"
              className="w-full h-[75vh] lg:h-screen object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          </div>
          <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="max-w-lg p-12 text-center lg:text-left">
              <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
                💐 SUBSCRIPTION SERVICE
              </div>
              <h3 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
                Fresh Flowers, Delivered Weekly
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Experience the convenience and savings of regular flower deliveries with our flexible subscription service. Save up to 30% compared to one-time purchases and never miss a moment to brighten your space.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Weekly, bi-weekly, or monthly delivery</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Cancel or pause anytime</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Curated seasonal selections</span>
                </div>
              </div>
              <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-full hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* Wedding & Events Service */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="/images/wedding_decor.jpg"
            alt="Wedding & Event Decorations"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-8">
          <div className="inline-block px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white text-sm font-medium mb-8">
            💒 EVENT SERVICES
          </div>
          
          <h3 className="text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
            Wedding & Event
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
              Decorations
            </span>
          </h3>
          
          <p className="text-xl text-white/90 leading-relaxed mb-12 max-w-2xl mx-auto">
            Let our team of expert florists and designers create stunning, on-trend floral décor for your special day. We bring your vision to life with unmatched artistry and attention to detail.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-3xl mb-3">🎨</div>
              <h4 className="text-white font-semibold mb-2">Custom Design</h4>
              <p className="text-white/80 text-sm">Personalized floral arrangements tailored to your style</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-3xl mb-3">⚡</div>
              <h4 className="text-white font-semibold mb-2">Full Setup</h4>
              <p className="text-white/80 text-sm">Complete venue transformation with professional installation</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-3xl mb-3">💎</div>
              <h4 className="text-white font-semibold mb-2">Premium Quality</h4>
              <p className="text-white/80 text-sm">Only the finest flowers and materials for your special day</p>
            </div>
          </div>
          
          <button className="px-10 py-5 bg-white text-gray-800 font-semibold rounded-full hover:bg-white/90 transform hover:scale-105 transition-all duration-200 shadow-2xl text-lg">
            Get Your Quote Today
          </button>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src="./google-full-logo.svg" alt="Google Reviews" className="h-8" />
              <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">Verified Reviews</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Don't just take our word for it. See what our happy customers have to say about their FlowerShop experience.
            </p>
          </div>
          
          <GoogleSlides />
          
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-lg border">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <span className="font-semibold text-gray-800">4.9 out of 5</span>
              <span className="text-gray-600">• Based on 500+ reviews</span>
            </div>
            <div className="mt-6">
              <button 
                onClick={() => window.open('https://google.com/search?q=flowershop+reviews', '_blank')}
                className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
              >
                Read All Reviews on Google
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="h-[20vh] bg-gray-100">
        {/* More scrollable content */}
      </section>
    </div>
    );
}