import Button from '@mui/material/Button';
import { useAppContext } from '../context/context';

const Header = () => {

  const {
    preview,
    setPreview
  } = useAppContext()

  function handlePreview() {
    if (preview === true) {
      setPreview(false)
    }
    else {
      setPreview(true)
    }
  }

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
          <Button variant="contained" onClick={handlePreview}>Anom Preview</Button>
        </div>
        <div className='OptionButton'>
          <Button variant="outlined" className='OptionButton'>Feature</Button>
        </div>
      </div>
    </>
  )
}

export default Header
