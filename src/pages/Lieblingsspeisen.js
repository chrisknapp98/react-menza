import React from 'react';

import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import SpeisePaper from '../components/SpeisePaper';
import SpeisenStructured from '../components/SpeisenStructured';
import * as Preferences from '../database/Preferences';


const useStyles = makeStyles({
  pageContent: {
    margin: "10px 10px",
  },

});

/**
 * Display all objects stored in indexedDB for 'favSpeisen'
 */
function Lieblingsspeisen() {
  const [speisenList, setSpeisenList] = React.useState([]);

  React.useEffect(() => {
    Preferences.getFavSpeisen()
    .then(list => {
      console.log(list);
      setSpeisenList(list);
    })
  }, [])

  const classes = useStyles(); 
  return (
    <div className={classes.pageContent}>
    {(speisenList.length >= 1) ? <SpeisenStructured list={speisenList} /> 
        :
        <Typography variant="body2" >
        Keine Speisen verfügbar
        </Typography>
        }
      
    </div>
  )
}

export default Lieblingsspeisen;