import * as React from 'react';


import ImportPage from '../ImportPage';


import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useAppContext } from '../context/context';
import  { Navigate } from 'react-router-dom'

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

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
