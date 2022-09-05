import * as React from 'react';
import Button from '@mui/material/Button';
import { useAppContext } from '../context/context';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const Header = () => {
  return (
    <div className='PageHeader'>
      <img src='./stj-logo.png' style={{maxHeight:"70px", paddingRight:"20px"}}/>

      <div>
        <h2>ANONIMIZADOR</h2>
        <h4 style={{opacity:"0.5"}}>SUPREMO TRIBUNAL DE JUSTIÇA</h4>
      </div>

    </div>
  )
}

export default Header
