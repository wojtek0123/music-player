import { ReactNode, createContext, useState } from "react";

interface Popup {
  popupMenuVisibility: { songId: string; show: boolean };
  onToggleMenu: (_id: string) => void;
}

export const PopupContext = createContext<Popup>({
  popupMenuVisibility: { songId: "", show: false },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onToggleMenu: () => {},
});

interface PopupProps {
  children: ReactNode;
}

export const PopupContextProvider = ({ children }: PopupProps) => {
  const [popupMenuVisibility, setPopupMenuVisibility] = useState<{ songId: string; show: boolean }>({
    songId: "",
    show: false,
  });

  const onToggleMenu = (id: string) => {
    if (id === popupMenuVisibility.songId && popupMenuVisibility.show) {
      setPopupMenuVisibility({ songId: "", show: false });
      return;
    }

    if (id !== popupMenuVisibility.songId && popupMenuVisibility.show) {
      setPopupMenuVisibility({ songId: id, show: true });
      return;
    }

    setPopupMenuVisibility({ songId: id, show: true });
  };

  const value = {
    popupMenuVisibility,
    onToggleMenu,
  };

  return <PopupContext.Provider value={value}>{children}</PopupContext.Provider>;
};
