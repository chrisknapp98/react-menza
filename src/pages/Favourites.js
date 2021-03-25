import React from 'react';

import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import MensaCard from '../components/MensaCard';
import * as Preferences from '../database/Preferences'; 


const useStyles = makeStyles({
  pageContent: {

  },
  keineFavoriten: {
    margin: "10px",
  },
});


function MensaCards(props) {
  var link;
  var button;
  if (props.type === "setMyMensa") {
    console.log(props.type)
    link = "/settings";
    button = "setMyMensa"
  } else {
    link = "/mensa/";
    button = "";
  }
  return(
    <>
    {props.list ? 
      props.list.map( item => (
      <MensaCard mensa={item} link={props.type === "setMyMensa" ? link : link + item.id} 
      button={button}/>
    )) : <></>
    }
    </>
  )
}

/**
 * Displays all saved mensa objects from indexedDB but NOT MyMensa object because why should it...?
 */
function Favourites(props) {
  const [mensaList, setMensaList] = React.useState([]);

  const getMensaList = () => {
    var promise = Preferences.getFavMensen()
    .then(list => {
      setMensaList(list);
    })
  
  return promise;
  }

  React.useEffect(() => {
    getMensaList();
  }, [])
  const classes = useStyles(); 
  return (
    <div className={classes.pageContent}>

    {mensaList.length === 0 ? 
      <Typography variant="body1" className={classes.keineFavoriten}>
        Keine Favoriten gespeichert
      </Typography>
      : 
      <MensaCards list={mensaList} type={props.type === "setMyMensa" ? "setMyMensa" : "default"} />}

    </div>
  )
}

export default Favourites;