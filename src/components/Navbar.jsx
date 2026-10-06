"use client";

import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";

function Navbar({ onSearch }){
    const [darkMode, setDarkMode] = useState(true);

    useEffect(() => {
        if(darkMode){
            document.documentElement.classList.add("dark");
        }else{
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    return (
        <div className="sticky top-0 z-50 bg-gray-100 dark:bg-gray-950 border-b border-gray-300 dark:border-gray-800 shadow-lg transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 gap-2 sm:gap-3">
  <h1 className="text-indigo-600 dark:text-indigo-400 text-xl sm:text-2xl font-bold shrink-0">
    Cine-Stream
  </h1>
  <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto sm:flex-1 sm:justify-end">
    <SearchBar onSearch={onSearch} />
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="shrink-0 text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 px-3 py-2 rounded-lg text-lg sm:text-xl transition-colors"
    >
      {darkMode ? "☀️" : "🌙"}
    </button>
  </div>
</div>
    </div>
    );
}
export default Navbar;
