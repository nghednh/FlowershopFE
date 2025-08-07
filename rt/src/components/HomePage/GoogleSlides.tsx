import { useState, useEffect, useRef } from "react";

const reviewsData = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    review: "Absolutely stunning bouquet! The flowers were fresh and beautifully arranged. Perfect for my anniversary dinner. Will definitely order again!",
    avatar: "SJ",
    date: "2 weeks ago"
  },
  {
    id: 2,
    name: "Michael Chen",
    rating: 5,
    review: "Outstanding service! Same-day delivery and the arrangement exceeded my expectations. My wife was thrilled with the Valentine's surprise.",
    avatar: "MC",
    date: "1 month ago"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    rating: 5,
    review: "Best flower shop in town! Their subscription service is amazing - fresh flowers delivered weekly at a great price. Highly recommend!",
    avatar: "ER",
    date: "3 weeks ago"
  },
  {
    id: 4,
    name: "David Thompson",
    rating: 5,
    review: "Professional and reliable. Used them for our wedding decorations and they transformed the venue into a floral paradise. Incredible work!",
    avatar: "DT",
    date: "2 months ago"
  },
  {
    id: 5,
    name: "Lisa Wang",
    rating: 5,
    review: "The live plants I ordered are thriving! Great quality and the care instructions were very helpful. Perfect addition to my home office.",
    avatar: "LW",
    date: "1 week ago"
  }
];

const CLONE_OFFSET = 1;

const ReviewCard = ({ review }: { review: typeof reviewsData[0] }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mx-4 my-6 min-h-[300px] flex flex-col justify-between border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
          {review.avatar}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 text-lg">{review.name}</h4>
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(review.rating)}</div>
            <span className="text-sm text-gray-500">{review.date}</span>
          </div>
        </div>
      </div>

      {/* Review Text */}
      <div className="flex-1">
        <p className="text-gray-600 leading-relaxed text-lg italic">
          "{review.review}"
        </p>
      </div>

      {/* Google Badge */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
          <span className="text-sm text-gray-500 font-medium">Google Review</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Verified
        </div>
      </div>
    </div>
  );
};

export default function GoogleSlides() {
  const [current, setCurrent] = useState(CLONE_OFFSET);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const slides = [
    reviewsData[reviewsData.length - 1], // clone last slide at the beginning
    ...reviewsData,
    reviewsData[0], // clone first slide at the end
  ];

  const slideCount = reviewsData.length;

  const goTo = (index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrent(index);
      setIsTransitioning(true);
    }
  };

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  // Auto slide (pause on hover)
  useEffect(() => {
    if (isHovered) return;
    
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [current, isHovered]);

  // Handle seamless looping
  useEffect(() => {
    const handleTransitionEnd = () => {
      if (current === slides.length - 1) {
        setIsTransitioning(false);
        setCurrent(CLONE_OFFSET);
      } else if (current === 0) {
        setIsTransitioning(false);
        setCurrent(slideCount);
      }
    };

    const track = trackRef.current;
    track?.addEventListener("transitionend", handleTransitionEnd);
    return () => track?.removeEventListener("transitionend", handleTransitionEnd);
  }, [current, slideCount, slides.length]);

  return (
    <div 
      className="relative w-full max-w-4xl mx-auto my-12"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Carousel */}
      <div className="overflow-hidden rounded-2xl">
        <div
          ref={trackRef}
          className={`flex ${isTransitioning ? "transition-transform duration-700 ease-in-out" : ""}`}
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((review, i) => (
            <div key={`${review.id}-${i}`} className="w-full flex-shrink-0">
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-pink-500 group"
        aria-label="Previous review"
      >
        <svg className="w-5 h-5 text-gray-600 group-hover:text-pink-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-pink-500 group"
        aria-label="Next review"
      >
        <svg className="w-5 h-5 text-gray-600 group-hover:text-pink-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-3 mt-8">
        {reviewsData.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index + CLONE_OFFSET)}
            className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none ${
              current === index + CLONE_OFFSET 
                ? "bg-gradient-to-r from-pink-500 to-purple-600 scale-110" 
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to review ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}