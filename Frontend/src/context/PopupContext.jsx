import { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import Popup from "@/components/Popup";

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [popups, setPopups] = useState([]);

  const showPopup = useCallback((message, type = "info") => {
    const id = Date.now();

    setPopups((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removePopup(id);
    }, 4000);
  }, []);

  const removePopup = (id) => {
    setPopups((prev) => prev.filter((popup) => popup.id !== id));
  };

  return (
    <PopupContext.Provider value={{ showPopup }}>
      {children}

      <div className="fixed top-5 right-5 z-50 flex flex-col gap-4">
        <AnimatePresence>
          {popups.map((popup) => (
            <Popup
              key={popup.id}
              message={popup.message}
              type={popup.type}
              onClose={() => removePopup(popup.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </PopupContext.Provider>
  );
};

export const usePopup = () => useContext(PopupContext);
