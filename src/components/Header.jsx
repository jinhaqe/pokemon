import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import Img from "../assets/logo.png";
import { useTheme } from "../Context/ThemeContext";
import { useLanguage } from "../Context/LanguageContext";
import { auth } from "../firebase_config";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Header() {
   const { isDark, toggleTheme } = useTheme();
   const { language, toggleLanguage } = useLanguage();
   const [user, setUser] = useState(null);

   const texts = {
      login: language === "ko" ? "로그인" : "Login",
      join: language === "ko" ? "회원가입" : "Join",
      themeToggle: isDark ? "Light" : "Dark",
      langToggle: language === "ko" ? "영어" : "Korean",
      welcome: language === "ko" ? "환영합니다, " : "Welcome, ",
      logout: language === "ko" ? "로그아웃" : "Logout",
   };

   const navigate = useNavigate();

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (curUser) => {
         setUser(curUser);
      });

      return () => unsubscribe();
   }, []);

   const handleLogout = () => {
      signOut(auth)
         .then(() => {
            console.log("로그아웃 성공");
         })
         .catch((e) => {
            console.log("로그아웃 오류", e);
         });
   };

   const goToLogin = () => {
      navigate("/login");
   };

   const goToSignup = () => {
      navigate("/signup"); // 회원가입 페이지로 이동
   };

   return (
      <header className="fixed top-0 left-0 w-full h-20 shadow-md z-10 bg-white dark:bg-gray-800">
         <div className="max-w-screen-xl mx-auto h-full flex items-center justify-between px-4 sm:px-10">
            <img
               src={Img}
               alt="포켓몬 도감 로고"
               className="w-[120px] sm:w-[150px] h-auto"
            />
            <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
               {user ? (
                  <div className="flex items-center gap-3">
                     <span className="text-sm sm:text-base text-gray-700 dark:text-white">
                        {texts.welcome} {user.email.split("@")[0]}!
                     </span>
                     <button
                        className="min-w-[60px] text-sm sm:text-base cursor-pointer"
                        onClick={handleLogout}
                     >
                        {texts.logout}
                     </button>
                  </div>
               ) : (
                  <div className="flex gap-2">
                     <button
                        className="min-w-[60px] text-sm sm:text-base cursor-pointer"
                        onClick={goToLogin}
                     >
                        {texts.login}
                     </button>
                     <button
                        className="min-w-[60px] text-sm sm:text-base cursor-pointer"
                        onClick={goToSignup} // 회원가입 버튼 클릭 시 회원가입 페이지로 이동
                     >
                        {texts.join}
                     </button>
                  </div>
               )}

               <button
                  className="min-w-[60px] px-3 sm:px-4 py-2 rounded-md bg-gray-800 text-white text-xs sm:text-sm font-medium cursor-pointer hover:bg-gray-700 transition-transform transform hover:-translate-y-0.5 dark:bg-gray-600 dark:hover:bg-gray-500"
                  onClick={toggleTheme}
               >
                  {texts.themeToggle}
               </button>

               <button
                  onClick={toggleLanguage}
                  className="min-w-[60px] px-3 sm:px-4 py-2 rounded-md bg-red-500 text-white text-xs sm:text-sm font-medium cursor-pointer hover:bg-red-600 transition-transform transform hover:-translate-y-0.5 dark:bg-blue-600 dark:hover:bg-blue-500"
               >
                  {texts.langToggle}
               </button>
            </div>
         </div>
      </header>
   );
}
