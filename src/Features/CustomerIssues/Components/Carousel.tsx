import { number } from "framer-motion";
import React,{useState,useRef,useEffect,ReactNode,useCallback} from "react";
import { Maximize2, X, Play, Pause } from "lucide-react";

interface CorouselProps{
    children:ReactNode[];
    className?:string;
    autoPlayInterval?:number;
    showDots?:boolean;
    showArrows?:boolean;
    loop?:boolean;
    showPlayPause?: boolean;
}

const clamp = (num:number,min:number,max:number) => Math.max(min,Math.min(num,max));
const Carousel:React.FC<CorouselProps> = ({

    children,
    className = "",
    autoPlayInterval,
    showDots = true,
    showArrows = true,
    loop = true,
    showPlayPause = true,
    

})=>{

    const count = children.length;
    const [index,setIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(!!autoPlayInterval); // autoplay active by default if interval provided
    const [expanded, setExpanded] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const isHovering = useRef(false);
    const startX = useRef<number | null>(null);
    const deltax = useRef(0);
    const transitioning = useRef(false);

    //advance index with bounds / looping
    const goTo = useCallback(
        (i:number)=>{
            if(transitioning.current) return;
            let next = i;
            if(loop){
                next = (i+count) % count;
            }else{
                next = clamp(i,0,count-1);
            }

            setIndex(next);

        },
        [count,loop]
    );

    const prev = () => goTo(index - 1);
    const next = () => goTo(index + 1);

    //Autoplay

    useEffect(()=>{
        if(!autoPlayInterval) return;
        if (!isPlaying) return;
        const tick = () =>{
            if(!isHovering.current) next();
        };

        const iv = setInterval(tick,autoPlayInterval);

        return () => clearInterval(iv);
    }, [autoPlayInterval,next, isPlaying]);

    useEffect(()=>{
        const onKey = (e:KeyboardEvent)=>{
            if(e.key === "ArrowLeft") prev();
            else if(e.key === "ArrowRight") next();
        };

        window.addEventListener("keydown",onKey);
        return()=>window.removeEventListener("keydown",onKey);
    },[prev,next]);

    //touch / drag handling

    const onPointerDown = (e:React.PointerEvent) =>{
        startX.current = e.clientX;
        deltax.current = 0;
        containerRef.current?.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e:React.PointerEvent) => {
        if(startX.current == null)return;
        deltax.current = e.clientX - startX.current;


    };

    const onPointerUp = (e:React.PointerEvent) => {
        if(startX.current == null)return;
        const threshold = 50;
        if(deltax.current > threshold) {
            prev();
        }else if(deltax.current < threshold){
            next();
        }

        startX.current = null;
        deltax.current = 0;
    };


const renderCarousel = (fullHeight = false) => (
    <div
      className={`relative overflow-hidden w-full ${
        fullHeight ? "h-full" : "h-64"
      } ${className}`}
      aria-roledescription="carousel"
      onMouseEnter={() => {
        isHovering.current = true;
      }}
      onMouseLeave={() => (isHovering.current = false)}
    >
      {/* Slides */}
      <div
        ref={containerRef}
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${index * 100}%)` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={() => {
          startX.current = null;
          deltax.current = 0;
        }}
        role="group"
        aria-label={`Slide ${index + 1} of ${count}`}
      >
        {children.map((child, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-full h-full"
            aria-hidden={i !== index}
            role="tabpanel"
          >
            {child}
          </div>
        ))}
      </div>

      {/* Arrows */}
      {showArrows && (
        <>
          <button
            aria-label="Previous slide"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white px-3 py-2 rounded-full shadow-md focus:outline-none"
          >
            ‹
          </button>
          <button
            aria-label="Next slide"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white px-3 py-2 rounded-full shadow-md focus:outline-none"
          >
            ›
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => goTo(i)}
              className={`
                  w-3 h-3 rounded-full focus:outline-none
                  ${i === index ? "bg-black" : "bg-black/30"}
                `}
            />
          ))}
        </div>
      )}

      {/* Expand + Play/Pause */}
      <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
        {/* Maximize / expand */}
        <button
          aria-label="Maximize carousel"
          onClick={() => setExpanded(true)}
          className="bg-white/90 backdrop-blur-sm p-1 rounded-full shadow"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Play/Pause */}
        {autoPlayInterval && showPlayPause && (
          <button
            aria-label={isPlaying ? "Pause carousel" : "Play carousel"}
            onClick={() => setIsPlaying((p) => !p)}
            className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium shadow flex items-center"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Inline carousel */}
      {renderCarousel(false)}

      {/* Expanded fullscreen overlay */}
      {expanded && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl h-full bg-white rounded-lg overflow-hidden shadow-xl">
            {/* Close button */}
            <div className="absolute top-1 right-20 z-60">
              <button
                aria-label="Close expanded view"
                onClick={() => setExpanded(false)}
                className="bg-yellow/90 p-2 rounded-full shadow"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Expanded carousel */}
            <div className="h-full">{renderCarousel(true)}</div>
            
          </div>
        </div>
      )}
    </>
  );


};

export default Carousel;