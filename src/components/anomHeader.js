import * as React from 'react';
import Button from '@mui/material/Button';
import { useAppContext } from '../context/context';
import materialTheme from "../utils/material_theme"

import { createTheme, ThemeProvider } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
//import { LineBreak, Document, Text } from "redocx";
import HTMLtoDOCX from 'html-to-docx';
import { Document, Packer } from 'docx';
import { saveAs } from 'file-saver';
import axios from 'axios';

var ReactDOMServer = require('react-dom/server');

const AnomHeader = (getText) => {

  const {
    mode,
    setMode,
    file,
    sourceHtml,
    setSourceHtml,
    loading,
    setLoading,
  } = useAppContext()


  const handleMode = (event, newMode) => {
    setMode(newMode);
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
    
    setLoading(true)

    await axios.post(url, formData, config).then((response) => {
      final_res = response.data.replace("<div data-from=.docx>", "<div data-from=.docx>\n")
      final_res = final_res.replace("</div>", "\n</div>\n")
      final_res = final_res.replaceAll("href=", "")
      final_res = final_res.replaceAll("PER", "PES")
      setSourceHtml(final_res)
      setLoading(false)
    });

  }

  const downloadDocx = async () => {

    let html = getText()
    console.log(html)

    let final_html = await html.replaceAll("</span>", "</span> ")
    final_html = await html.replaceAll("<!-- -->", " <!-- -->")

    console.log(final_html)

    const fileBuffer = await HTMLtoDOCX(final_html, null, {
      table: { row: { cantSplit: true } },
      footer: true,
      pageNumber: true,
    });

    saveAs(fileBuffer, 'html-to-docx.docx');
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
          <ToggleButton value="Anom" aria-label="left aligned">
            Editar
          </ToggleButton>
          <ToggleButton value="Original" aria-label="left aligned">
            Original
          </ToggleButton>
          <ToggleButton value="Preview" aria-label="left aligned">
            Anonimizado
          </ToggleButton>
        </ToggleButtonGroup>

        {
          loading ?
          <div className='OptionButton' color="secondary">
            <Button variant="contained">A Anonimizar...</Button>
          </div>
          :
          <div className='OptionButton' color="secondary" onClick={handleNER}>
            <Button variant="contained">Sugerir</Button>
          </div>
        }

        <div className='OptionButton'>
          <Button variant="contained" className='OptionButton' onClick={downloadDocx}>Guardar</Button>
        </div>

      </div>
    </ThemeProvider>
  )
}

export default AnomHeader
