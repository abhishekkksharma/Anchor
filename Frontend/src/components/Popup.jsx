import { motion } from "framer-motion";
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";

const typeConfigs = {
  success: {
    icon: <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />,
    accent: "bg-emerald-500",
    bg: "bg-emerald-50/50 dark:bg-emerald-500/10",
  },
  error: {
    icon: <AlertCircle size={16} className="text-rose-600 dark:text-rose-400" />,
    accent: "bg-rose-500",
    bg: "bg-rose-50/50 dark:bg-rose-500/10",
  },
  warning: {
    icon: <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400" />,
    accent: "bg-amber-500",
    bg: "bg-amber-50/50 dark:bg-amber-500/10",
  },
  info: {
    icon: <Info size={16} className="text-blue-600 dark:text-blue-400" />,
    accent: "bg-blue-500",
    bg: "bg-blue-50/50 dark:bg-blue-500/10",
  },
};

const Popup = ({ message, type = "info", onClose }) => {
  const config = typeConfigs[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.1 } }}
      className="relative group overflow-hidden flex items-center gap-3 px-3 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md min-w-[280px] max-w-[320px]"
    >
      {/* Small Inner Rounded Icon Box */}
      <div className={`flex-shrink-0 p-1.5 rounded-xl ${config.bg}`}>
        {config.icon}
      </div>

      {/* Message Text */}
      <div className="flex-1 overflow-hidden">
        <p className="text-[13px] font-medium text-zinc-700 dark:text-zinc-200 truncate">
          {message}
        </p>
      </div>

      {/* Close Button - Only shows full opacity on hover for a cleaner look */}
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all opacity-40 group-hover:opacity-100"
      >
        <X size={14} className="text-zinc-500" />
      </button>

      {/* Ultra-thin Progress Bar */}
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 4, ease: "linear" }}
        className={`absolute bottom-0 left-0 h-[1.5px] ${config.accent} opacity-40`}
      />
    </motion.div>
  );
};

export default Popup;