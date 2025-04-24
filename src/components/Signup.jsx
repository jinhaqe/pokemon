import { useState } from "react";
import { useNavigate } from "react-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase_config";
import { Link } from "react-router";
import lastB from "../assets/lastB.png";
import FormHeader from "./FormHeader";
import { useLanguage } from "../Context/LanguageContext";
import { useTheme } from "../Context/ThemeContext";
import lastBg2 from "../assets/lastBg2.png";

export default function Signup() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [loading, setLoading] = useState(false);
   const { isDark } = useTheme();
   const navigate = useNavigate();
   const { language } = useLanguage();

   const texts = {
      signup: language === "ko" ? "회원가입" : "Sign Up",
      login: language === "ko" ? "로그인" : "Login",
      emailLabel: language === "ko" ? "이메일" : "Email",
      emailPlaceholder:
         language === "ko" ? "이메일을 입력해주세요" : "Enter your email",
      pwLabel: language === "ko" ? "비밀번호" : "Password",
      pwPlaceholder:
         language === "ko" ? "비밀번호를 입력해주세요" : "Enter your password",
      confirmPwLabel: language === "ko" ? "비밀번호 확인" : "Confirm Password",
      confirmPwPlaceholder:
         language === "ko"
            ? "비밀번호를 다시 입력해주세요"
            : "Confirm your password",
      noAccount:
         language === "ko" ? "계정이 있으신가요?" : "Already have an account?",
      signupError:
         language === "ko"
            ? "모든 필드를 입력해주세요."
            : "Please fill out all fields.",
      passwordMismatch:
         language === "ko"
            ? "비밀번호가 일치하지 않습니다."
            : "Passwords do not match.",
      signupFailed: language === "ko" ? "회원가입 오류: " : "Sign up error: ",
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!email || !password || !confirmPassword) {
         alert(texts.signupError);
         return;
      }

      if (password !== confirmPassword) {
         alert(texts.passwordMismatch);
         return;
      }

      setLoading(true);
      try {
         const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
         );
         console.log("회원가입 성공", userCredential.user);
         navigate("/"); // 회원가입 성공 후 홈 화면으로 이동
      } catch (error) {
         console.log("회원가입 오류", error.message);
         alert(texts.signupFailed + error.message);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div
         className="flex justify-center items-center h-screen bg-cover bg-center"
         style={{
            backgroundImage: `url(${isDark ? lastBg2 : lastB})`,
         }}
      >
         <div
            className="w-full max-w-md p-8 bg-white bg-opacity-80 rounded-lg shadow-lg space-y-6
                dark:bg-gray-800/90 transition-colors duration-300"
         >
            <FormHeader />

            <div className="text-center mb-6">
               <h2 className="text-4xl font-semibold text-sky-500 dark:text-sky-300 font-pokemon">
                  {texts.signup}
               </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label
                     htmlFor="email"
                     className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                     {texts.emailLabel}
                  </label>
                  <input
                     type="email"
                     placeholder={texts.emailPlaceholder}
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="w-full p-4 mt-2 border border-sky-500 rounded-xl 
                          focus:outline-none focus:ring-2 focus:ring-sky-300 
                          bg-white dark:bg-gray-700 text-gray-800 dark:text-white 
                          placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                  />
               </div>

               <div>
                  <label
                     htmlFor="password"
                     className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                     {texts.pwLabel}
                  </label>
                  <input
                     type="password"
                     placeholder={texts.pwPlaceholder}
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="w-full p-4 mt-2 border border-sky-500 rounded-xl 
                          focus:outline-none focus:ring-2 focus:ring-sky-300 
                          bg-white dark:bg-gray-700 text-gray-800 dark:text-white 
                          placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                  />
               </div>

               <div>
                  <label
                     htmlFor="confirmPassword"
                     className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                     {texts.confirmPwLabel}
                  </label>
                  <input
                     type="password"
                     placeholder={texts.confirmPwPlaceholder}
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                     className="w-full p-4 mt-2 border border-sky-500 rounded-xl 
                          focus:outline-none focus:ring-2 focus:ring-sky-300 
                          bg-white dark:bg-gray-700 text-gray-800 dark:text-white 
                          placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                  />
               </div>

               <button
                  type="submit"
                  className="w-full p-4 mt-6 bg-sky-500 text-white font-semibold 
                       rounded-xl hover:bg-sky-600 transition-all ease-in-out 
                       disabled:opacity-50"
                  disabled={loading}
               >
                  {loading ? (
                     <div className="flex justify-center items-center">
                        <div className="spinner-border animate-spin w-5 h-5 border-4 border-white border-t-transparent rounded-full"></div>
                     </div>
                  ) : (
                     texts.signup
                  )}
               </button>
            </form>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
               <span>{texts.noAccount}</span>{" "}
               <Link
                  to="/login"
                  className="font-semibold text-sky-500 hover:text-sky-600"
               >
                  {texts.login}
               </Link>
            </div>
         </div>
      </div>
   );
}
