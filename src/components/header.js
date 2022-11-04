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

      <Link to="/">
        <img src='./PT-logoLogo-STJ.png' style={{maxHeight:"70px", paddingRight:"20px"}} />
      </Link>

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
