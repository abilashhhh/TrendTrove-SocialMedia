import React, { createContext, useState, useContext, ReactNode, FC } from "react";

interface ActiveSectionContextType {
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
}

const ActiveSectionContext = createContext<ActiveSectionContextType | undefined>(undefined);

export const useActiveSection = (): ActiveSectionContextType => {
  const context = useContext(ActiveSectionContext);
  if (!context) {
    throw new Error("useActiveSection must be used within an ActiveSectionProvider");
  }
  return context;
};

export const ActiveSectionProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <ActiveSectionContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </ActiveSectionContext.Provider>
  );
};
