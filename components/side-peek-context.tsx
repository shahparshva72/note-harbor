"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface SidePeekContextType {
  isAddNoteOpen: boolean;
  setIsAddNoteOpen: (isOpen: boolean) => void;
  isEditNoteOpen: boolean;
  setIsEditNoteOpen: (isOpen: boolean) => void;
}

const SidePeekContext = createContext<SidePeekContextType | undefined>(
  undefined
);

export function SidePeekProvider({ children }: { children: ReactNode }) {
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isEditNoteOpen, setIsEditNoteOpen] = useState(false);

  return (
    <SidePeekContext.Provider
      value={{
        isAddNoteOpen,
        setIsAddNoteOpen,
        isEditNoteOpen,
        setIsEditNoteOpen
      }}
    >
      {children}
    </SidePeekContext.Provider>
  );
}

export function useSidePeek() {
  const context = useContext(SidePeekContext);
  if (context === undefined) {
    throw new Error("useSidePeek must be used within a SidePeekProvider");
  }
  return context;
}
