import React from 'react';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';

import { makeStyles, createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

import * as Preferences from '../database/Preferences';

const useStyles = makeStyles({
  paperDiv: {
    width: "100%",
  },
  root: {
    margin: "10px 0px",
    width: "100%",
  },
  paperContent: {
    padding: "5px",
  },
  speiseName: {
    fontSize: "15pt",
  },
  favIcon: {
    padding: "5px",
  },
  row1: {
    display: "flex",
    justifyContent: "space-between",
  },
  tag: {
    margin: "3px",
  },
  prices: {
    display: "flex",
    //flexDirection: 'row',
    width: "100%",
  },
  pricesLeft: {
    display: "flex",
    width: "50%",
  },
  pricesRight: {
    display: "flex",
    justifyContent: "space-between",
    hyphens: "auto",
    width: "50%",
    fontSize: "12pt",
  },
  priceString: {
    flexGrow: 1,
    textAlign: "justify",
  },
  listItem: {
    padding: 0,
  },
  flexContainer: {
    width: "100%",
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
  },
});

const heartColor = "#70d47c";

const materialTheme = createMuiTheme({
  palette: {
    primary: {
      main: heartColor,  
    },
  }
});



function checkIfInFavList(speise) {
  return Preferences.getFavSpeisen()
  .then(list => {
    var found = false;
    for(var i = 0; i < list.length; i++) {
    if (list[i].id === speise.id) {
        found = true;
        break;
    }
  }
  return found;
  })
}

function Tags(props) {
  return(
    <>
    {props.list.map(item => (
      <Chip size="small" label={item} className={props.className} />
    ))}
    </>
  );
}


function SpeisePaper(props) {
  const [favButton, setFavButton] = React.useState(false);
  const classes = useStyles();

  React.useEffect(() => {
    Preferences.getFavSpeisen()
    .then(list => {
      var speisenID = list.map(item => {
        return item.id;
      })
      var bool = speisenID.includes(props.speise.id);
      setFavButton(bool);
    })
  }, [])

  const handleFavButtonClick = (event, speise) => {
    return checkIfInFavList(speise)
    .then(bool => {
      if (bool) {
        Preferences.removeSpeiseFromFavs(speise);
      } else {
        Preferences.addSpeiseToFavs(speise);
      }
      setFavButton(!favButton);
    })
  }
  return (
    <div className={classes.paperDiv}>
      <Paper className={classes.root}>
        <div className={classes.paperContent}>
        
        <div className={classes.row1}>
        <Typography variant="subtitle1" className={classes.speiseName}>
        {props.speise.name}
        </Typography>
          <ThemeProvider theme={materialTheme}>
          <IconButton className={classes.favIcon}
            onClick={event => {handleFavButtonClick(event, props.speise)}}>
            {favButton ? 
            <FavoriteIcon color="primary" />
            : 
            <FavoriteBorderIcon color="primary" />}
          </IconButton>
          </ThemeProvider>
        </div>
        <div className={classes.tags}>
        <Tags list={props.speise.notes} className={classes.tag} />
        </div>
        <div className={classes.prices}>
        <List className={classes.flexContainer}>
          {Object.keys(props.speise.prices).map((role, index) => {
            var firString = (role === "students") ? "Studenten" : 
                            (role === "employees") ? "Mitarbeiter" :
                            (role === "pupils") ? "Schüler" : 
                            "Andere";
            
            var secString = props.speise.prices[role] ? String(props.speise.prices[role]) + "€" : "k.A."
            return(
            <ListItem className={classes.listItem}>
              <ListItemText primary={firString} secondary={secString}/>
            </ListItem>  
          )})}
          </List>
        </div>
        
        </div>
      </Paper>
    </div>
  )
}

export default SpeisePaper;