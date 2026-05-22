import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  
  // Дополнительная оптимизация для скролл-анимаций
  ScrollTrigger.config({
    limitCallbacks: true,
  });
}

export * from "gsap";
export { ScrollTrigger };
export default gsap;
