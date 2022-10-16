import Button from '@mui/material/Button';
import { useAppContext } from '../context/context';
import materialTheme from "../utils/material_theme"
import {FormControl, NativeSelect } from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

//import { LineBreak, Document, Text } from "redocx";
import HTMLtoDOCX from 'html-to-docx';
import { saveAs } from 'file-saver';
import axios from 'axios';

import {
  useRef,
} from "react";


const AnomHeader = (getText) => {

  const {
    mode,
    setMode,
    file,
    setSourceHtml,
    loading,
    setLoading,
    setAnomStyle,
  } = useAppContext()

  const firstSuggest = useRef(true)


  const handleMode = (event, newMode) => {
    setMode(newMode);
  };

  const handlStyle = (e) => {
    setAnomStyle(e.target.value);
  };


  async function handleNER() {
    let final_res = null

    const url = 'https://pe.inesc-id.pt/python/';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    firstSuggest.current = false
    setLoading(true)

    await axios.post(url, formData, config).then((response) => {
      final_res = response.data.replace("<div data-from=.docx>", "<div data-from=.docx>\n")
      final_res = final_res.replace("</div>", "\n</div>\n")
      final_res = final_res.replaceAll("href=", "")
      final_res = final_res.replaceAll("PER", "PES")

      localStorage.setItem("ANOM_SOURCE_HTML", final_res)

      setSourceHtml(final_res)
      setLoading(false)
    });

  }

  const redirectHelp = async () => {
    var win = window.open("https://docs.google.com/document/d/1yfMYeehjUpf7xJiSYZAVUpdCd5UlQDswt7bOUONwi3E/edit#heading=h.cbjxa1ox4xfc'", '_blank');
    win.focus();
  }

  const downloadDocx = async () => {

    let html = getText()

    let final_html = await html.replaceAll("</span>", "</span> ")
    final_html = await html.replaceAll("<!-- -->", " <!-- -->")

    const fileBuffer = await HTMLtoDOCX(final_html, null, {
      table: { row: { cantSplit: true } },
      footer: true,
      pageNumber: true,
    });

    let filnename = "example.docx"
    if (file !== null) {
      filnename = file.name.split(".docx")[0] + "_final.docx"
    }

    saveAs(fileBuffer, filnename);
  }

  let suggestDisable = false
  if (firstSuggest.current === false || file === null) {
    suggestDisable = true
  }
  else if (file.complete !== undefined) {
    suggestDisable = true
  }

  let saveDisable = false
  if (mode !== "Preview") {
    saveDisable = true
  }


  return (
    <ThemeProvider theme={materialTheme}>
      <div className='FlexButtonContainer'>

        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleMode}
          aria-label="text alignment"
          className='ToggleButton'
        >
          <ToggleButton value="Original" aria-label="left aligned">
            Original
          </ToggleButton>
          <ToggleButton value="Preview" aria-label="left aligned">
            Anonimizado
          </ToggleButton>
          <ToggleButton value="Anom" aria-label="left aligned">
            Editar
          </ToggleButton>
        </ToggleButtonGroup>



        {
          mode == "Anom" ?
          <>
            Mostrar:
            <div className='ControlSpacer'>
              <FormControl>
                <NativeSelect
                  defaultValue={"Type"}
                  inputProps={{
                    name: 'type',
                    id: 'uncontrolled-native',
                  }}
                  onChange={handlStyle}
                >
                  <option value={"Type"}>Tipo</option>
                  <option value={"Anom"}>Código</option>
                </NativeSelect>
              </FormControl>
            </div>
          </>
          :
          <></>
        }

        {
          loading ?
          <div className='OptionButton' color="secondary">
            <Button variant="contained">A Anonimizar...</Button>
          </div>
          :
          <div className='OptionButton' color="secondary" onClick={handleNER}>
            <Button variant="contained" disabled={suggestDisable}>Sugerir</Button>
          </div>
        }

        <div className='OptionButton'>
          <Button variant="contained" className='OptionButton' onClick={downloadDocx} disabled={saveDisable}>Guardar</Button>
        </div>

        <div className='OptionButton'>
          <Button variant="contained" className='OptionButton' onClick={redirectHelp}>Ajuda</Button>
        </div>

        </div>
    </ThemeProvider>
  )
}

export default AnomHeader
