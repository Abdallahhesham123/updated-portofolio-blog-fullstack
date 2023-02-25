import React, { useEffect, useState } from 'react'
import Navbar from '../Header/Header'
import Footer from '../Footer/Footer'
import { createTheme , ThemeProvider} from '@mui/material/styles';
import { blue,  red } from '@mui/material/colors';
const Template = ({children}) => {
  const [Darkmode, setDarkmode] = useState(JSON.parse(localStorage.getItem('Darkmode'))||false);
  const theme = createTheme({

    palette: {
  
      primary: {
  
        main: blue[400]
      },
      secondary:{
  
        main :red[100]
      },
      mode :Darkmode ?"dark" :"light"
    }
  });

  useEffect(() => {
    
    localStorage.setItem('Darkmode',JSON.stringify(Darkmode))
  
  }, [Darkmode]);
  return (
    <>
    <ThemeProvider theme={theme}>
          <Navbar checked={Darkmode} onChange={()=> setDarkmode(!Darkmode)}/>
                <>

                    {children}

                </>
              
          <Footer/>

    </ThemeProvider>

    </>
  )
}

export default Template