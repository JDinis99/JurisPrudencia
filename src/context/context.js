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
  let rows = useRef(null)
  const [allEntities, setAllEntites] = useState(null)
  const [anomTokens, setAnomTokens] = useState(null)
  const [anomValues, setAnomValues] = useState(null)
  const last_index = useRef(0)
  const tag = useRef(null)
  const [menuStyle, setMenuStyle] = useState({
    left: 0,
    top: 0,
    showMenu: false
  })
  let selected = useRef([])

  const [popUpMenu, setPopUpMenu] = useState({
    showMenu: false,
    entities: {
      "PER":0,
      "DAT":0,
      "ORG":0,
      "LOC":0,
      "PRO":0,
      "MAT":0
    }
  })

  const [preview, setPreview] = useState(false)

  const f_value = useMemo(() => ({
    value_sidebar,
    allEntities,
    setAllEntites,
    anomTokens,
    setAnomTokens,
    anomValues,
    setAnomValues,
    last_index,
    tag,
    menuStyle,
    setMenuStyle,
    selected,
    popUpMenu,
    setPopUpMenu,
    preview,
    setPreview,
    rows
  }));

  return <Context.Provider value={f_value}>{children}</Context.Provider>;
}

export function useAppContext() {
  return useContext(Context);
}