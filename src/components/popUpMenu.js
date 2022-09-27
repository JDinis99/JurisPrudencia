import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import materialTheme from "../utils/material_theme"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAppContext } from '../context/context'
import parse from 'html-react-parser';
import TAG_COLORS from '../utils/tag_colors';
import { renderToString } from 'react-dom/server';


const PopUpMenu = (showMenu, handleMultipleTagChange, entities) => {
  const [value, setValue] = React.useState('Single');

  const {
    value_sidebar,
    allEntities,
    anomTokens,
    anomValues,
    last_index,
    tag,
    menuStyle,
    setMenuStyle,
    popUpMenu,
    setPopUpMenu,
    mode,
    setMode,
    rows,
    setRows,
    raw_text,
    renderValue,
    setRenderValue,
    sourceHtml,
    setSourceHtml,
  } = useAppContext()

  const style = () => {
    return {
      color: "FCD2D1",
      backgroundColor: "rgba(244,236,206,255)",
      alignItems: "center",
      display:"flex",
      flexDirection: "column",
      padding:10,
      top: "50%",
      left: "27%",
      position:"fixed",
      display: showMenu ? "flex" : "none",
      "border-color": "rgba(224, 193, 128 ,255)",
      "border-width": "3px",
      "border-style": "solid",
      "border-radius": "25px"
    }
  }
  
  const handleRadioChange = (event) => {
    console.log(anomValues.current.value[last_index.current])
    console.log(tag.current)
    setValue(event.target.value)
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleMultipleTagChange(value)
  };

  const handleCancel = (event) => {
    event.preventDefault();
    handleMultipleTagChange("Cancel")
  };

  let change_string = <></>
  if (last_index.current !== null && tag.current !== null) {
    change_string = 
      <span>
        Mudar <b> {anomValues.current.value[last_index.current].text} </b> de
        <mark
          style={{backgroundColor: TAG_COLORS[anomValues.current.value[last_index.current].tag] || '#84d2ff', padding: ".2em .3em", margin: "0 .25em", lineHeight: "1", display: "inline-block", borderRadius: ".25em"}}
        >
          {anomValues.current.value[last_index.current].tag}
        </mark>
        para
        <mark
          style={{backgroundColor: TAG_COLORS[tag.current] || '#84d2ff', padding: ".2em .3em", margin: "0 .25em", lineHeight: "1", display: "inline-block", borderRadius: ".25em"}}
        >
          {tag.current}
        </mark>
      </span>
  }

  let count_string = ""
  let type_count = 0
  let total_count = 0

  for (let ent_count in entities) {
    if (entities[ent_count] !== 0) {
      let ent_comp = 
        <mark
          style={{backgroundColor: TAG_COLORS[ent_count] || '#84d2ff', padding: ".2em .3em", margin: "0 .25em", lineHeight: "1", display: "inline-block", borderRadius: ".25em"}}
        >
          {ent_count} :
          {entities[ent_count]}
        </mark>

      type_count += 1
      total_count += entities[ent_count]
      count_string += renderToString(ent_comp)
    }
  }

  let disable_equal = true
  if (total_count > 1) {
    disable_equal = false
  }
  
  let disable_all = true
  if (type_count > 1) {
    disable_all = false
  }
  

  return (
    <ThemeProvider theme={materialTheme}>
      <div className='PopUp' style={style()}>
        {change_string}
        <br></br>
        Occurência deste termo:
        <br></br>
        <span>
          {parse(count_string)}
        </span>
        <br></br>

          <FormControl>
            <RadioGroup
              aria-labelledby="demo-error-radios"
              name="quiz"
              onChange={handleRadioChange}
              value={value}
            >
              <FormControlLabel value="Single" control={<Radio />} label="Apenas a esta ocorrência deste termo" />
              <FormControlLabel  disabled={disable_equal} value="All-Equal" control={<Radio />} label="Todas as ocorrências deste termo e com este tipo" />
              <FormControlLabel disabled={disable_all} value="All-All" control={<Radio />} label="Todas as ocorrências deste termo, independentemente do tipo" />
            </RadioGroup>
            <Button sx={{ mt: 1, mr: 1 }} type="submit" variant="outlined" onClick={handleSubmit}>
              Confirmar
            </Button>
            <Button sx={{ mt: 1, mr: 1 }} type="submit" variant="outlined" onClick={handleCancel}>
              Cancelar
            </Button>
          </FormControl>

      </div>
    </ThemeProvider>
  )
}

export default PopUpMenu;