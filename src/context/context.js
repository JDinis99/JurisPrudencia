import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";

const Context = createContext();

export function AppContext({ children }) {
  let value_sidebar = useRef(null)

  const value = useMemo(() => ({
    value_sidebar,
  }));

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useAppContext() {
  return useContext(Context);
}