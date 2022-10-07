import { useAppContext } from './context/context';
import axios from 'axios';
import  { Navigate } from 'react-router-dom'
import React, { useEffect, useRef } from 'react';

const ImportPage = () => {

  const {
    redirect,
    setRedirect,
    sourceHtml,
    setSourceHtml,
    file,
    setFile,
  } = useAppContext()

  const hiddenFileInput = useRef(null);

  const handleClick = event => {
    hiddenFileInput.current.click();
  };

  const redirectComponent = () => {
    if (redirect === true) {
      return (
        <Navigate push to="/anom" />
      )
    }
  }

  function handleChange(event) {
    setFile(event.target.files[0])
    handleSubmit(event.target.files[0])
  }

  async function handleSubmit(file) {
    let final_res = null

    const url = './html';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    await axios.post(url, formData, config).then((response) => {
      final_res = response.data.replace("<div data-from=.docx>", "<div data-from=.docx>\n")
      final_res = final_res.replace("</div>", "\n</div>\n")
      final_res = final_res.replaceAll("href=", "")

      setSourceHtml(final_res)
    });

    setRedirect(true)

  }

  return (
    <div className="ImportPage">
      {redirectComponent()}

      <h1 style={{marginBottom:"50px"}}>Bem vindo ao anonimizador, importe um ficheiro para começar o processo</h1>

      <button onClick={handleClick}>
        Escolher Ficheiro
      </button>
      <input type="file" ref={hiddenFileInput} onChange={handleChange} style={{display: 'none'}} />
    </div>
  )
}

export default ImportPage;
