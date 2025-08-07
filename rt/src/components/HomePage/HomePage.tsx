import GoogleSlides from "./GoogleSlides";
import { useState, useEffect } from "react";
import './HomePage.css';

export default function HomePage() {
    const [isVisible, setIsVisible] = useState(false);
    const [currentSlogan, setCurrentSlogan] = useState(0);
    
    const slogans = [
        "Where beauty blooms and memories are made.",
        "Crafting moments that last forever.",
        "Your story, beautifully told through flowers."
    ];

    useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
            setCurrentSlogan((prev) => (prev + 1) % slogans.length);
        }, 4000);
        
        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Hero Section */}
      <section className="hero-section relative overflow-hidden min-h-screen">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-32 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-pink-400/40 rounded-full animate-bounce delay-500"></div>
          <div className="absolute top-2/3 right-1/3 w-3 h-3 bg-purple-400/40 rounded-full animate-bounce delay-1000"></div>
          <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-pink-300/60 rounded-full animate-ping delay-2000"></div>
        </div>
        
        <div className="flex flex-col lg:flex-row w-full min-h-screen relative z-10">
          {/* Left Hero Content - Enhanced */}
          <div className="w-full lg:w-1/2 bg-gradient-to-br from-pink-50/80 via-purple-50/60 to-pink-50/80 backdrop-blur-sm border border-gray-200/50 relative">
            <div className="h-full flex flex-col justify-start p-8 lg:p-16 pt-16 lg:pt-24 relative space-y-8">
              
              {/* FlowerShop Text - Centered within Left Section */}
              <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-0 opacity-0'}`}>
                <div className="animate-breathe">
                  <h1 className="text-center text-5xl lg:text-8xl xl:text-9xl font-bold leading-tight tracking-tight">
                    <span className="inline-block transform hover:scale-105 transition-transform duration-300 cursor-default text-gray-800 animate-text-glow">
                      <span className="inline-block animate-float" style={{animationDelay: '100ms'}}>F</span>
                      <span className="inline-block animate-float" style={{animationDelay: '200ms'}}>l</span>
                      <span className="inline-block animate-float" style={{animationDelay: '300ms'}}>o</span>
                      <span className="inline-block animate-float" style={{animationDelay: '400ms'}}>w</span>
                      <span className="inline-block animate-float" style={{animationDelay: '500ms'}}>e</span>
                      <span className="inline-block animate-float" style={{animationDelay: '600ms'}}>r</span>
                    </span>
                    <br/>
                    <span className="inline-block transform hover:scale-105 transition-transform duration-300 cursor-default font-bold">
                      <span className="inline-block animate-float animate-color-shift bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent" style={{animationDelay: '700ms', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>S</span>
                      <span className="inline-block animate-float animate-color-shift bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent" style={{animationDelay: '800ms', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>h</span>
                      <span className="inline-block animate-float animate-color-shift bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent" style={{animationDelay: '900ms', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>o</span>
                      <span className="inline-block animate-float animate-color-shift bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent" style={{animationDelay: '1000ms', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>p</span>
                    </span>
                  </h1>
                </div>
              </div>
              
              {/* Slogan */}
              <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="relative h-32 lg:h-40 overflow-hidden text-center">
                  {slogans.map((slogan, index) => (
                    <p key={index} className={`absolute inset-0 text-xl lg:text-2xl text-gray-600 leading-relaxed transform transition-all duration-700 flex flex-col items-center justify-center ${
                      currentSlogan === index 
                        ? 'translate-y-0 opacity-100' 
                        : index < currentSlogan 
                          ? '-translate-y-full opacity-0' 
                          : 'translate-y-full opacity-0'
                    }`}>
                      <span>{slogan}</span>
                      <span className="text-lg font-medium text-pink-500 italic mt-2">"Every flower speaks a language of love"</span>
                    </p>
                  ))}
                </div>
              </div>
              
              {/* Call-to-Action Buttons */}
              <div className={`transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => window.location.href = '/list'}
                    className="group px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden w-[180px] h-[56px] flex items-center justify-center"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Shop Now
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </button>
                  <button 
                    onClick={() => window.location.href = '/contact'}
                    className="group px-8 py-4 border-2 border-pink-500 text-pink-500 font-semibold rounded-full hover:bg-pink-500 hover:text-white hover:border-pink-600 transition-all duration-300 hover:shadow-lg relative overflow-hidden w-[180px] h-[56px] flex items-center justify-center"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      Contact Us
                    </span>
                  </button>
                </div>
              </div>  
                          
              {/* Enhanced Bottom Image Section */}
              <div className={`mt-8 lg:mt-0 transform transition-all duration-1000 delay-900 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="grid grid-cols-2 gap-6">
                  <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer">
                    <img
                      src="/images/floral_studio.jpg"
                      alt="Floral Studio"
                      className="w-full h-32 lg:h-40 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="text-white font-semibold text-lg mb-1 transform group-hover:translate-y-0 translate-y-2 transition-transform duration-300">
                        Our Studio
                      </div>
                      <div className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300 delay-100">
                        Visit our beautiful space
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group bg-white rounded-2xl p-6 shadow-lg border hover:shadow-xl transition-all duration-500 hover:border-pink-200 relative overflow-hidden cursor-pointer">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="text-sm text-gray-600 font-medium">Our Promise</div>
                      </div>
                      <p className="text-gray-800 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                        Professional floral arrangements crafted with love and delivered fresh to your door with a smile.
                      </p>
                      <div className="mt-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-2 transition-all duration-300">
                        <div className="text-xs text-pink-500 font-medium flex items-center gap-1">
                          Learn more 
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Statistics Bar */}
                <div className={`mt-6 transform transition-all duration-1000 delay-1100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="group cursor-pointer">
                        <div className="text-lg font-bold text-gray-800 group-hover:text-pink-500 transition-colors duration-300">500+</div>
                        <div className="text-xs text-gray-600">Happy Customers</div>
                      </div>
                      <div className="group cursor-pointer border-x border-gray-200">
                        <div className="text-lg font-bold text-gray-800 group-hover:text-pink-500 transition-colors duration-300">5⭐</div>
                        <div className="text-xs text-gray-600">Rating</div>
                      </div>
                      <div className="group cursor-pointer">
                        <div className="text-lg font-bold text-gray-800 group-hover:text-pink-500 transition-colors duration-300">24/7</div>
                        <div className="text-xs text-gray-600">Support</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Enhanced Right Hero Grid */}
          <div className="w-full lg:w-1/2 relative">
            {/* Floating decoration elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              <div className="absolute top-20 right-16 w-6 h-6 bg-pink-400/20 rounded-full animate-float delay-500"></div>
              <div className="absolute bottom-32 left-12 w-4 h-4 bg-purple-400/30 rounded-full animate-bounce-slow delay-1000"></div>
              <div className="absolute top-1/3 right-8 w-2 h-2 bg-green-400/40 rounded-full animate-ping-slow delay-1500"></div>
            </div>
            
            <div className="grid grid-cols-2 h-full relative z-10">
              
              {/* Fresh Flowers - Enhanced */}
              <div className={`relative group cursor-pointer overflow-hidden aspect-square transform transition-all duration-800 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'} delay-300`}>
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/90 to-emerald-100/90 backdrop-blur-sm flex items-center justify-center border border-gray-200/50 z-10 group-hover:from-green-100/95 group-hover:to-emerald-200/95 transition-all duration-500">
                  <div className="text-center transform group-hover:scale-105 transition-transform duration-300">
                    <div className="mb-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300">
                      <div className="w-12 h-12 mx-auto bg-white/80 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 tracking-tight">
                      Fresh<br/>Flowers
                    </h3>
                    <div className="opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300 delay-100">
                      <a href="/list?categories=1" className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 bg-white/80 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
                        Shop now 
                        <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                <img
                  src="/images/fresh_flower.jpg"
                  alt="Fresh Flowers"
                  className="absolute inset-0 w-full h-full object-cover opacity-15 group-hover:opacity-25 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
                    Popular
                  </div>
                </div>
              </div>

              {/* Fresh Flowers Image - Enhanced */}
              <div className={`relative overflow-hidden group cursor-pointer aspect-square transform transition-all duration-800 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'} delay-400`}>
                <img
                  src="/images/fresh_flower.jpg"
                  alt="Fresh Flowers"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:from-black/30 transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4 right-4 transform group-hover:translate-y-0 translate-y-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                    <div className="text-sm font-semibold text-gray-800">Premium Collection</div>
                    <div className="text-xs text-gray-600">Hand-picked daily</div>
                  </div>
                </div>
              </div>

              {/* Dried Flowers Image - Enhanced */}
              <div className={`relative overflow-hidden group cursor-pointer aspect-square transform transition-all duration-800 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'} delay-500`}>
                <img
                  src="/images/dried_flower.jpg"
                  alt="Dried Flowers"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:from-black/30 transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4 right-4 transform group-hover:translate-y-0 translate-y-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                    <div className="text-sm font-semibold text-gray-800">Lasting Beauty</div>
                    <div className="text-xs text-gray-600">Eternal elegance</div>
                  </div>
                </div>
              </div>

              {/* Dried Flowers - Enhanced */}
              <div className={`relative group cursor-pointer overflow-hidden aspect-square transform transition-all duration-800 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'} delay-600`}>
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/90 to-orange-100/90 backdrop-blur-sm flex items-center justify-center border border-gray-200/50 z-10 group-hover:from-amber-100/95 group-hover:to-orange-200/95 transition-all duration-500">
                  <div className="text-center transform group-hover:scale-105 transition-transform duration-300">
                    <div className="mb-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300">
                      <div className="w-12 h-12 mx-auto bg-white/80 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 tracking-tight">
                      Dried<br/>Flowers
                    </h3>
                    <div className="opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300 delay-100">
                      <a href="/list?categories=2" className="inline-flex items-center text-orange-600 font-semibold hover:text-orange-700 bg-white/80 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
                        <svg className="mr-2 w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Shop now
                      </a>
                    </div>
                  </div>
                </div>
                <img
                  src="/images/dried_flower.jpg"
                  alt="Dried Flowers"
                  className="absolute inset-0 w-full h-full object-cover opacity-15 group-hover:opacity-25 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="px-3 py-1 bg-orange-600 text-white text-xs font-medium rounded-full">
                    Trending
                  </div>
                </div>
              </div>

              {/* Live Plants - Enhanced */}
              <div className={`relative group cursor-pointer overflow-hidden aspect-square transform transition-all duration-800 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'} delay-700`}>
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/90 to-teal-100/90 backdrop-blur-sm flex items-center justify-center border border-gray-200/50 z-10 group-hover:from-green-100/95 group-hover:to-teal-200/95 transition-all duration-500">
                  <div className="text-center transform group-hover:scale-105 transition-transform duration-300">
                    <div className="mb-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300">
                      <div className="w-12 h-12 mx-auto bg-white/80 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 tracking-tight">
                      Live<br/>Plants
                    </h3>
                    <div className="opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300 delay-100">
                      <a href="/list?categories=3" className="inline-flex items-center text-teal-600 font-semibold hover:text-teal-700 bg-white/80 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
                        Shop now 
                        <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                <img
                  src="/images/live_plant.jpg"
                  alt="Live Plants"
                  className="absolute inset-0 w-full h-full object-cover opacity-15 group-hover:opacity-25 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="px-3 py-1 bg-teal-600 text-white text-xs font-medium rounded-full">
                    Eco-Friendly
                  </div>
                </div>
              </div>

              {/* Live Plants Image - Enhanced */}
              <div className={`relative overflow-hidden group cursor-pointer aspect-square transform transition-all duration-800 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'} delay-800`}>
                <img
                  src="/images/live_plant.jpg"
                  alt="Live Plants"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:from-black/30 transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4 right-4 transform group-hover:translate-y-0 translate-y-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                    <div className="text-sm font-semibold text-gray-800">Green Living</div>
                    <div className="text-xs text-gray-600">Purify your space</div>
                  </div>
                </div>
              </div>

              {/* Aroma Candles Image - Enhanced */}
              <div className={`relative overflow-hidden group cursor-pointer aspect-square transform transition-all duration-800 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'} delay-900`}>
                <img
                  src="/images/aroma_candle.png"
                  alt="Aroma Candles"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:from-black/30 transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4 right-4 transform group-hover:translate-y-0 translate-y-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                    <div className="text-sm font-semibold text-gray-800">Ambient Scents</div>
                    <div className="text-xs text-gray-600">Create the mood</div>
                  </div>
                </div>
              </div>

              {/* Aroma Candles - Enhanced */}
              <div className={`relative group cursor-pointer overflow-hidden aspect-square transform transition-all duration-800 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'} delay-1000`}>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/90 to-pink-100/90 backdrop-blur-sm flex items-center justify-center border border-gray-200/50 z-10 group-hover:from-purple-100/95 group-hover:to-pink-200/95 transition-all duration-500">
                  <div className="text-center transform group-hover:scale-105 transition-transform duration-300">
                    <div className="mb-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300">
                      <div className="w-12 h-12 mx-auto bg-white/80 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M11 3a1 1 0 10-2 0v1a1 1 0 10-2 0V3a3 3 0 106 0zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 11a1 1 0 100-2H4a1 1 0 100 2h1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.477.859h4z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 tracking-tight">
                      Aroma<br/>Candles
                    </h3>
                    <div className="opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300 delay-100">
                      <a href="/list?categories=4" className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700 bg-white/80 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
                        <svg className="mr-2 w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Shop now
                      </a>
                    </div>
                  </div>
                </div>
                <img
                  src="/images/aroma_candle.png"
                  alt="Aroma Candles"
                  className="absolute inset-0 w-full h-full object-cover opacity-15 group-hover:opacity-25 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded-full">
                    Luxury
                  </div>
                </div>
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