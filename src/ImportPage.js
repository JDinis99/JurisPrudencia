import { useAppContext } from './context/context';
import axios from 'axios';
import  { Navigate } from 'react-router-dom'
import React, { useEffect, useRef } from 'react';

const ImportPage = () => {

  const {
    redirect,
    setRedirect,
    setSourceHtml,
    setFile,
    page
  } = useAppContext()

  const hiddenFileInput = useRef(null);
  let storedFileName = localStorage.getItem("ANOM_FILE_NAME")

  const handleClick = event => {
    hiddenFileInput.current.click();
  };

  useEffect(() => {
    page.current = "import"
  }, [])

  const redirectComponent = () => {
    if (redirect === true) {
      return (
        <Navigate push to="./anom"/>
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

      localStorage.setItem("ANOM_FILE_NAME", file.name)
      localStorage.setItem("ANOM_SOURCE_HTML", final_res)

      localStorage.setItem("ANOM_VALUES", null)
      localStorage.setItem("ANOM_ALL_ENTITIES", null)
      localStorage.setItem("ANOM_TOKENS", null)

      setSourceHtml(final_res)
    }).catch(err => {
      console.log(err);
    });

    setRedirect(true)

  }

  const handleContinue = event => {
    setRedirect(true)
  };

  console.log(storedFileName)


  return (
    <div className="ImportPage">
      {redirectComponent()}

      <h1 style={{marginBottom:"50px"}}>Importe um ficheiro docx para começar o processo</h1>

      <button onClick={handleClick}>
        Escolher Ficheiro
      </button>
      <input type="file" ref={hiddenFileInput} onChange={handleChange} style={{display: 'none'}} />

      {
        storedFileName === null ?
        <div className='ImportSaved'>
          Não tem nenhum ficheiro guardado
        </div>
        :
        <>
          <div className='ImportSaved'>
            Tem o ficheiro {storedFileName} guardado. Clique aqui para continuar a editar 
          </div>
          <button onClick={handleContinue}>
            Continuar a editar
          </button>
        </>

      }

    </div>
  )
}

export default ImportPage;
