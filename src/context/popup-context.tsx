import { ReactNode, createContext, useState, useCallback } from "react";

interface Popup {
  popupMenuVisibility: { songId: string; show: boolean };
  onToggleMenu: (_id: string) => void;
  onHideMenu: () => void;
}

export const PopupContext = createContext<Popup>({
  popupMenuVisibility: { songId: "", show: false },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onToggleMenu: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onHideMenu: () => {},
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

  const onHideMenu = useCallback(() => {
    setPopupMenuVisibility({ songId: "", show: false });
  }, []);

  const value = {
    popupMenuVisibility,
    onToggleMenu,
    onHideMenu,
  };

  return <PopupContext.Provider value={value}>{children}</PopupContext.Provider>;
};
