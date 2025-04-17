import Header from "./components/Header";
import Main from "./components/Main";

function App() {
   return (
      <div className="w-full min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
         <Header />
         <Main />
      </div>
   );
}

export default App;
