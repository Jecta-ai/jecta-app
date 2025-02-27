"use client";
import { createContext, useContext, useState } from "react";

const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <MenuContext.Provider value={{ isCollapsed, setIsCollapsed }}>{children}</MenuContext.Provider>
  );
};

const MenuContext = createContext({
  isCollapsed: false,
  setIsCollapsed: (collapsed: boolean) => {},
});

export const useMenu = () => {
  return useContext(MenuContext);
};

export default MenuProvider;
