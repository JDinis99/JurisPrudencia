import * as React from 'react';

import { Link } from 'react-router-dom';
import { useAppContext } from '../context/context';
import  { Navigate } from 'react-router-dom'

const Header = () => {
  const {
    file,
    page,
  } = useAppContext()


  return (
    <div className='PageHeader'>

      <a href="./">
        <img src='./PT-logoLogo-STJ.png' style={{maxHeight:"70px", paddingRight:"20px"}} />
      </a>

      <h3 style={{fontWeight:"bold"}}>ANONIMIZADOR</h3>

      {
        page.current === "anom" && file !== null ?
        <div className='HeaderFileName'>{"Ficheiro: " + file.name}</div>
        :
        <></>
      }


    </div>
  )
}

export default Header
