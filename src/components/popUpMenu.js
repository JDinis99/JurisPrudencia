import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';

const PopUpMenu = (showMenu, handleMultipleTagChange, entities) => {
  const [value, setValue] = React.useState('Single');

  const style = () => {
    return {
      color: "FCD2D1",
      backgroundColor: "rgb(252, 210, 209)",
      alignItems: "center",
      display:"flex",
      flexDirection: "column",
      padding:10,
      top: "50%",
      left: "27%",
      position:"fixed",
      display: showMenu ? "flex" : "none",
      "border-color": "black",
      "border-width": "10px",
      "border-style": "solid"
    }
  }
  
  const handleRadioChange = (event) => {
    setValue(event.target.value)
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleMultipleTagChange(value)
  };

  const handleCancel = (event) => {
    event.preventDefault();
    handleMultipleTagChange("Cancel")
  };

  return (
    <div className='PopUp' style={style()}>
      Quer aplicar esta mudança a todas as entidades iguais?
      <br></br>
      PES: {entities.PES}, DAT: {entities.DAT}, ORG: {entities.ORG}, LOC: {entities.LOC}, PRO: {entities.PRO}, MAT: {entities.MAT},
      <br></br>

        <FormControl>
          <FormLabel id="demo-error-radios">Escolha o que quer mudar</FormLabel>
          <RadioGroup
            aria-labelledby="demo-error-radios"
            name="quiz"
            onChange={handleRadioChange}
            value={value}
          >
            <FormControlLabel value="Single" control={<Radio />} label="Apenas a esta ocorrência deste termo" />
            <FormControlLabel value="All-Equal" control={<Radio />} label="Todas as ocorrências deste termo e com este tipo" />
            <FormControlLabel value="All-All" control={<Radio />} label="Todas as ocorrências deste termo, independentemente do tipo" />
          </RadioGroup>
          <Button sx={{ mt: 1, mr: 1 }} type="submit" variant="outlined" onClick={handleSubmit}>
            Confirmar
          </Button>
          <Button sx={{ mt: 1, mr: 1 }} type="submit" variant="outlined" onClick={handleCancel}>
            Cancelar
          </Button>
        </FormControl>

    </div>
  )
}

export default PopUpMenu;