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
  let value_sidebar = useRef([])

  // Rows of table
  const [rows, setRows] = useState([])
  // Selected row from table
  let selected = useRef([])

  // Contextual data
  const allEntities = useRef(null)
  const anomTokens = useRef(null)
  const anomValues = useRef(null)

  // Index of the last chosen entitie though text manipulation
  const last_index = useRef(0)
  const last_index_backup = useRef(null)
  const last_value = useRef(null)

  // Page selected
  const page = useRef(null)

  const anom_id = useRef(0)
  const trueSourceHtml = useRef(false)

  // Current default tag (necessary for intial token annotator, it is currently ignored)
  const tag = useRef(null)

  // Changable style for menus
  const [menuStyle, setMenuStyle] = useState({
    left: 0,
    top: 0,
    showMenu: false
  })
  const [popUpMenu, setPopUpMenu] = useState({
    showMenu: false,
    entities: {
      "PES":0,
      "DAT":0,
      "ORG":0,
      "LOC":0,
      "PRO":0,
      "MAT":0
    }
  })
  
  // Force re-render on changed information
  const [renderValue, setRenderValue] = useState({
    anomTokens: null,
    anomValues: null,
    allEntities: null
  })
  
  // Editor mode
  const [mode, setMode] = useState("Anom")
  // Type of anonimization
  const [anomStyle, setAnomStyle] = useState("Type")


  const [file, setFile] = useState(null)
  let [sourceHtml, setSourceHtml] = useState(null)
  let raw_text = useRef(null)

  const [redirect, setRedirect] = useState()
  const [loading, setLoading] = useState(false)
  

  const f_value = useMemo(() => ({
    value_sidebar,
    allEntities,
    anomTokens,
    anomValues,
    last_index,
    tag,
    menuStyle,
    setMenuStyle,
    selected,
    popUpMenu,
    setPopUpMenu,
    mode,
    setMode,
    rows,
    setRows,
    raw_text,
    renderValue,
    setRenderValue,
    file,
    setFile,
    redirect,
    setRedirect,
    sourceHtml,
    setSourceHtml,
    loading,
    setLoading,
    trueSourceHtml,
    anom_id,
    anomStyle,
    setAnomStyle,
    last_value,
    last_index_backup,
    page,
  }));

  return <Context.Provider value={f_value}>{children}</Context.Provider>;
}

export function useAppContext() {
  return useContext(Context);
}