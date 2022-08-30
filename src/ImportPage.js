import { useAppContext } from './context/context';
import axios from 'axios';
import  { Navigate } from 'react-router-dom'
import React, { useEffect } from 'react';

const ImportPage = () => {

  const {
    file,
    setFile,
    redirect,
    setRedirect,
    sourceHtml,
    setSourceHtml,
  } = useAppContext()


  const redirectComponent = () => {
    if (redirect === true) {
      return (
        <Navigate push to="/anom" />
      )
    }
  }

  function handleChange(event) {
    setFile(event.target.files[0])
  }

  async function handleSubmit(event) {
    let final_res = null
    event.preventDefault()

    const url = 'https://pe.inesc-id.pt/python/';
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
      setSourceHtml(final_res)
    });

    setRedirect(true)

  }

  return (
    <div className="ImportPage">
      {redirectComponent()}

      <h1>Bem vindo ao anonimizador, importe um ficheiro para começar o processo</h1>

      <form onSubmit={handleSubmit}>
          <h1>Escolha o Ficheiro</h1>
          <input type="file" onChange={handleChange}/>
          <button type="submit">Upload</button>
      </form>
    </div>
  )
}

export default ImportPage;
