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
var ReactDOMServer = require('react-dom/server');

const AnomHeader = () => {

  const {
    mode,
    setMode,
    sourceHtml
  } = useAppContext()


  const handleMode = (event, newMode) => {
    setMode(newMode);
  };

  const downloadDocx = async () => {

    const fileBuffer = await HTMLtoDOCX(sourceHtml, null, {
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
        >
          <ToggleButton disabled="false" aria-label="left aligned" color="error">
            Ver:
          </ToggleButton>
          <ToggleButton value="Original" aria-label="left aligned">
            Original
          </ToggleButton>
          <ToggleButton value="Anom" aria-label="left aligned">
            Anom
          </ToggleButton>
          <ToggleButton value="Preview" aria-label="left aligned">
            Preview
          </ToggleButton>
        </ToggleButtonGroup>

        <div className='OptionButton' color="secondary" >
          <Button variant="outlined">NER</Button>
        </div>

        <div className='OptionButton'>
          <Button variant="contained" className='OptionButton' onClick={downloadDocx}>Download</Button>
        </div>

      </div>
    </ThemeProvider>
  )
}

export default AnomHeader
