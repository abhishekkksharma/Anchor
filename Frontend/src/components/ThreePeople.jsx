import React from "react";
import { A, B, C } from "../assets/about/index";
import { motion } from "framer-motion";

function ThreePeople() {
  return (
    <div className="mt-10 mb-10">
      {/* Avatar Group */}
      <motion.div
        className="flex justify-center relative"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.2, duration: 0.5 },
          },
        }}
      >
        {/* Avatar A — z-10 */}
        <motion.img
          src={A}
          alt="Avatar A"
          className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 
                     rounded-full border-4 border-white shadow-lg z-10"
          whileHover={{ scale: 1.1 }}
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/80x80/F9D4D5/333333?text=A";
          }}
        />

        {/* Avatar B — z-10, slight overlap preserved */}
        <motion.img
          src={B}
          alt="Avatar B"
          className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 
                     rounded-full border-4 border-white shadow-lg 
                     -ml-3 sm:-ml-4 z-10"
          whileHover={{ scale: 1.1 }}
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/80x80/C9E5FF/333333?text=B";
          }}
        />

        {/* Avatar C — no z-index (same as before), slight overlap */}
        <motion.img
          src={C}
          alt="Avatar C"
          className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 
                     rounded-full border-4 border-white shadow-lg 
                     -ml-3 sm:-ml-4"
          whileHover={{ scale: 1.1 }}
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/80x80/FFF5C1/333333?text=C";
          }}
        />
      </motion.div>

      {/* Bottom Text */}
      <motion.div
        className="flex justify-center items-center mt-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <motion.p
          className="tracking-widest text-sm sm:text-base md:text-lg lg:text-xl 
                     text-zinc-600 dark:text-zinc-400 text-center"
          animate={{
            y: [0, -4, 0],
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          Please share your location to proceed
        </motion.p>
      </motion.div>
    </div>
  );
}

export default ThreePeople;