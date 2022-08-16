import * as React from 'react';
import Button from '@mui/material/Button';
import { useAppContext } from '../context/context';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const Header = () => {

  const {
    mode,
    setMode,
  } = useAppContext()


  const handleMode = (event, newMode) => {
    setMode(newMode);
  };
  return (
    <>
      <header className='PageHeader'>
        Header
      </header>

      <div className='FlexButtonContainer'>
        <div className='OptionButton'>
          <Button variant="contained">Zoom</Button>
        </div>
        <div className='OptionButton'>
          <Button variant="outlined" className='OptionButton'>Feature</Button>
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

export default Header
