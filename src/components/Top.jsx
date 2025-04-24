import TopImg from "../assets/헤롱헤롱2.gif";
import BottomImg from "../assets/헤롱헤롱3.gif";

export default function Top() {
   const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
   };

   const scrollToBottom = () => {
      window.scrollTo({
         top: document.documentElement.scrollHeight,
         behavior: "smooth",
      });
   };

   return (
      <div className="fixed z-10 right-3 bottom-6 flex flex-col items-center gap-6 sm:right-10 sm:bottom-10">
         <div
            className="w-[50px] cursor-pointer transition-transform transform hover:translate-y-[-5px]"
            onClick={scrollToTop}
         >
            <img src={TopImg} alt="Top" />
            <p className="text-center font-semibold dark:text-white">TOP</p>
         </div>

         <div
            className="w-[50px] cursor-pointer transition-transform transform hover:translate-y-[-5px]"
            onClick={scrollToBottom}
         >
            <img src={BottomImg} alt="Bottom" />
            <p className="text-center font-semibold dark:text-white">BOTTOM</p>
         </div>
      </div>
   );
}
