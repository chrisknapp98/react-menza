import React from 'react';

import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import Mensa from './Mensa';

const useStyles = makeStyles({
  pageContent: {
    
  }, 
  title: {
    margin: "10px",
  },

});

/**
 * Homepage adds a headline to the page and then displays meals for MyMensa below, if defined
 */
function Home() {
  const classes = useStyles(); 
  return (
    <div className={classes.pageContent}>
      <Typography variant="h4" className={classes.title}>
      Willkommen
      </Typography>


      <Mensa type="myMensa" />
    </div>

    
  )
}

export default Home;