import Carousel from "../Components/Carousel";

const slides = [
  <div className="h-64 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-pink-500 text-white text-xl">
    Slide One
  </div>,
  <div className="h-64 flex items-center justify-center bg-green-500 text-white text-xl">
    Slide Two
  </div>,
  <div className="h-64 flex items-center justify-center bg-yellow-500 text-black text-xl">
    Slide Three
  </div>,
];

export default function ScreenShot() {
  return (
    <div className="max-w-3xl mx-auto my-8">
      <Carousel autoPlayInterval={4000} loop showArrows showDots>
        {slides}
      </Carousel>
    </div>
  );
}