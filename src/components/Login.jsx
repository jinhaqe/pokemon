import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase_config";
import FormHeader from "./FormHeader";
import { useLanguage } from "../Context/LanguageContext";

export default function Login() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();
   const { language } = useLanguage();

   const texts = {
      login: language === "ko" ? "로그인" : "Login",
      join: language === "ko" ? "회원가입" : "Join",
      emailLabel: language === "ko" ? "이메일" : "Email",
      emailPlaceholder:
         language === "ko" ? "이메일을 입력해주세요" : "Enter your email",
      pwLabel: language === "ko" ? "비밀번호" : "Password",
      pwPlaceholder:
         language === "ko" ? "비밀번호를 입력해주세요" : "Enter your password",
      noAccount:
         language === "ko" ? "계정이 없으신가요?" : "Don't have an account?",
      loginError:
         language === "ko"
            ? "이메일과 비밀번호를 모두 입력해주세요."
            : "Please enter both email and password.",
      loginFailed: language === "ko" ? "로그인 오류: " : "Login error: ",
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!email || !password) {
         alert(texts.loginError);
         return;
      }

      setLoading(true);
      try {
         const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
         );
         console.log("로그인 성공", userCredential.user);
         navigate("/"); // 로그인 성공 후 홈으로 이동
      } catch (error) {
         console.log("오류", error.message);
         alert(texts.loginFailed + error.message);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="flex justify-center items-center h-screen bg-cover bg-center bg-no-repeat dark:bg-gray-900">
         <div className="w-full max-w-md p-8 bg-white bg-opacity-70 rounded-2xl shadow-lg space-y-6 dark:bg-gray-700">
            <FormHeader />

            <div className="text-center mb-6">
               <h2 className="text-4xl font-semibold text-sky-500 font-pokemon dark:text-white">
                  {texts.login}
               </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label
                     htmlFor="email"
                     className="block text-sm font-medium text-gray-700 dark:text-white"
                  >
                     {texts.emailLabel}
                  </label>
                  <input
                     type="email"
                     placeholder={texts.emailPlaceholder}
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="w-full p-4 mt-2 border border-sky-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 transition duration-300 ease-in-out dark:bg-gray-900 dark:text-white"
                  />
               </div>

               <div>
                  <label
                     htmlFor="password"
                     className="block text-sm font-medium text-gray-700 dark:text-white"
                  >
                     {texts.pwLabel}
                  </label>
                  <input
                     type="password"
                     placeholder={texts.pwPlaceholder}
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="w-full p-4 mt-2 border border-sky-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 transition duration-300 ease-in-out dark:bg-gray-900 dark:text-white"
                  />
               </div>

               <button
                  type="submit"
                  className="w-full p-4 mt-6 bg-sky-500 text-white font-semibold rounded-xl hover:bg-sky-600 transition-all ease-in-out"
                  disabled={loading}
               >
                  {loading ? (
                     <div className="flex justify-center items-center">
                        <div className="spinner-border animate-spin w-5 h-5 border-4 border-white border-t-transparent rounded-full"></div>
                     </div>
                  ) : (
                     texts.login
                  )}
               </button>
            </form>

            <div className="text-center text-sm text-gray-600 mt-4 dark:text-white">
               <span>{texts.noAccount} </span>
               <Link
                  to="/signup"
                  className="font-semibold text-sky-500 hover:text-sky-600"
               >
                  {texts.join}
               </Link>
            </div>
         </div>
      </div>
   );
}
