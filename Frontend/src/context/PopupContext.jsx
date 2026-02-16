import { createContext, useContext, useState } from "react";
import Popup from "../components/Popup";

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [popup, setPopup] = useState({
    message: "",
    type: "info",
    isOpen: false,
  });

  const showPopup = (message, type = "info") => {
    setPopup({ message, type, isOpen: true });

    setTimeout(() => {
      setPopup(prev => ({ ...prev, isOpen: false }));
    }, 3000);
  };

  const closePopup = () => {
    setPopup(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <PopupContext.Provider value={{ showPopup }}>
      {children}
      <Popup
        isOpen={popup.isOpen}
        message={popup.message}
        type={popup.type}
        onClose={closePopup}
      />
    </PopupContext.Provider>
  );
};

export const usePopup = () => useContext(PopupContext);
