import * as React from 'react';
import Button from '@mui/material/Button';
import { useAppContext } from '../context/context';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
//import { LineBreak, Document, Text } from "redocx";
import HTMLtoDOCX from 'html-to-docx';
import { Document, Packer } from 'docx';
import { saveAs } from 'file-saver';

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
    // console.log("Docx start")
    // let doc = <Document>
    //   sourceHtml
    // </Document>

    // console.log(doc)

    // let doc = new Document();
    // const packer = new Packer();
    // const mimeType =
    //   "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    // packer.toBlob(doc).then(blob => {
    //   const docblob = blob.slice(0, blob.size, mimeType);
    //   saveAs(docblob, "test.docx");
    // });

    let htmlString = "<p>Test <b>Bold</b> Test </p> <p>Test <b>Bold</b> Test </p>"

    const fileBuffer = await HTMLtoDOCX(htmlString, null, {
      table: { row: { cantSplit: true } },
      footer: true,
      pageNumber: true,
    });

    saveAs(fileBuffer, 'html-to-docx.docx');
  }


  return (
    <>
      <div className='FlexButtonContainer'>
        <div className='OptionButton'>
          <Button variant="contained">Zoom</Button>
        </div>
        <div className='OptionButton'>
          <Button variant="outlined" className='OptionButton' onClick={downloadDocx}>Download</Button>
        </div>

        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleMode}
          aria-label="text alignment"
        >
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
      </div>
    </>
  )
}

export default AnomHeader
