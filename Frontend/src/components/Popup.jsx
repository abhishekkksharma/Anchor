import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const typeStyles = {
  success: "bg-emerald-500",
  error: "bg-rose-500",
  warning: "bg-amber-500",
  info: "bg-blue-500",
};

const Popup = ({ message, type = "info", onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden text-white px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-lg ${typeStyles[type]} min-w-[300px]`}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium leading-relaxed">{message}</p>
        <button
          onClick={onClose}
          className="opacity-80 hover:opacity-100 transition"
        >
          <X size={18} />
        </button>
      </div>

      {/* Animated Progress Bar */}
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 4, ease: "linear" }}
        className="absolute bottom-0 left-0 h-1 bg-white/40"
      />
    </motion.div>
  );
};

export default Popup;
