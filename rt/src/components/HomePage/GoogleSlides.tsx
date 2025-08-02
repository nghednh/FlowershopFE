import { useState, useEffect, useRef } from "react";
import Chatbot from "../Chatbot";

const rawSlides = [
  <div className="bg-white w-full h-fit flex flex-col items-center justify-center">
    <div className="text-[clamp(0.5rem,3vw,2rem)] text-center">
      <span>"</span>
      Ordered flowers online and they were the best bouquet! Impressed everyone around. Highly recommend this flower shop!
      <span>"</span>
    </div>
    <div className="text-[clamp(0.25rem,1.5vw,1rem)] text-center my-[clamp(0.25rem,1.5vw,1rem)]">
      <span>-</span>Person
    </div>
  </div>,
  <div className="bg-white w-full h-fit flex flex-col items-center justify-center">
    <div className="text-[clamp(0.5rem,3vw,2rem)] text-center">
      <span>"</span>
        Ordered flowers online and they were the best bouquet! Impressed everyone around. Highly recommend this flower shop!
      <span>"</span>
    </div>
    <div className="text-[clamp(0.25rem,1.5vw,1rem)] text-center my-[clamp(0.25rem,1.5vw,1rem)]">
      <span>-</span>Person
    </div>
  </div>,
  <div className="bg-white w-full h-fit flex flex-col items-center justify-center">
    <div className="text-[clamp(0.5rem,3vw,2rem)] text-center">
      <span>"</span>
        Ordered flowers online and they were the best bouquet! Impressed everyone around. Highly recommend this flower shop!
      <span>"</span>
    </div>
    <div className="text-[clamp(0.25rem,1.5vw,1rem)] text-center my-[clamp(0.25rem,1.5vw,1rem)]">
      <span>-</span>Person
    </div>
  </div>,
];

const CLONE_OFFSET = 1; // number of cloned slides on each side

export default function LoopingCarousel() {
  const [current, setCurrent] = useState(CLONE_OFFSET); // start at first real slide
  const [isTransitioning, setIsTransitioning] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);

  const slides = [
    rawSlides[rawSlides.length - 1], // clone last slide at the beginning
    ...rawSlides,
    rawSlides[0], // clone first slide at the end
  ];

  const slideCount = rawSlides.length;

  const goTo = (index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrent(index);
      setIsTransitioning(true);
    }
  };

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [current]);

  // Handle seamless looping
  useEffect(() => {
    const handleTransitionEnd = () => {
      if (current === slides.length - 1) {
        // jumped to clone of first, reset to real first
        setIsTransitioning(false);
        setCurrent(CLONE_OFFSET);
      } else if (current === 0) {
        // jumped to clone of last, reset to real last
        setIsTransitioning(false);
        setCurrent(slideCount);
      }
    };

    const track = trackRef.current;
    track?.addEventListener("transitionend", handleTransitionEnd);
    return () => track?.removeEventListener("transitionend", handleTransitionEnd);
  }, [current]);

  return (
    <div className="relative w-4/5 mx-auto rounded-lg border border-gray-300">
      {/* Slide Track */}
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className={`flex ${isTransitioning ? "transition-transform duration-700 ease-in-out" : ""}`}
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div key={i} className="w-full shrink-0">
              {slide}
            </div>
          ))}
        </div>
      </div>

      
      <img 
        src="/left-arrow.svg" 
        alt="leftarrow" 
        className="w-0 h-0 md:w-8 md:h-8 m-3 cursor-pointer absolute top-1/2 left-0 -translate-y-1/2 -translate-x-16"
        onClick={prev}>
      </img>
      <img 
        src="/right-arrow.svg" 
        alt="rightarrow" 
        className="w-0 h-0 md:w-8 md:h-8 m-3 cursor-pointer absolute top-1/2 right-0 -translate-y-1/2 translate-x-16"
        onClick={next}>
      </img>
      {/* Dots */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {rawSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index + CLONE_OFFSET)}
            className={`w-1 h-1 rounded-full transition-all ${
              current === index + CLONE_OFFSET ? "bg-blue-500 scale-110" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
      <Chatbot />
    </div>
  );
}