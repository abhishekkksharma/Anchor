import React from "react";
import community from "../../assets/community.png";
import Loader from "../../assets/Loader.mp4";
import { A, B, C } from "../../assets/about/index";

function Hero() {
  return (
    <>
      <div>
        {/* Hero Main Text */}
        <div className="flex flex-col justify-center items-center hero-animate">
          {/* Top line (light & dark mode text color) */}
          <p className="font-semibold text-3xl text-zinc-600 tracking-wider dark:text-zinc-300">
            Get your problems solved
          </p>

          {/* Main heading */}
          <div className="flex text-6xl items-center font-bold drop-shadow-lg text-zinc-800 dark:text-zinc-100">
            <p>Start connecting with</p>
            <img src={community} className="h-15 m-3" alt="logo" />
            <p className="">Anchor</p>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex justify-center relative top-2">
            <img
              src={A}
              alt="Avatar B"
              className="w-20 h-20 bg-cover rounded-full border-4 border-white shadow-lg z-10"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/80x80/F9D4D5/333333?text=B";
              }}
            />
            <img
              src={B}
              alt="Avatar C"
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg -ml-4 z-10"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/80x80/C9E5FF/333333?text=C";
              }}
            />
            <img
              src={C}
              alt="Avatar D"
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg -ml-4"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/80x80/FFF5C1/333333?text=D";
              }}
            />
          </div>
          <div className="flex justify-center items-center mt-8 hero-animate">
            <p className="tracking-widest text-xl text-zinc-600 dark:text-zinc-400">
              Connect | Collaborate | Learn
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Hero;
