import React from 'react';
import { Link } from 'react-router-dom';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';

import RestaurantIcon from '@material-ui/icons/Restaurant';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { makeStyles, createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';

import MensaCard from '../components/MensaCard';

import * as Preferences from '../database/Preferences';
import * as notifications from '../notifications';

const useStyles = makeStyles({
  pageContent: {
    
  },
  headers: {
    textAlign: "left",
    margin: "10px 20px",
  },
  testNotification: {
    margin: "50px", 
    display: 'flex',
    justifyContent: 'center',
  },
});

const accentColor = "#70d47c";

const materialTheme = createMuiTheme({
  palette: {
    secondary: {
      main: accentColor,  
    },
  }
});

/**
 * Display the Settings page
 */
function Settings() {
  const [mensa, setMensa] = React.useState(null);
  const [notiChecked, setNotiChecked] = React.useState(false);
  const classes = useStyles();

  async function getMyMensa() {
    return new Promise(async (resolve, reject) => {
      Preferences.getMyMensa()
      .then(retMensa => {
        resolve(retMensa);
      })
    })
    .then(response => {
      setMensa(response);
    })
  }
  
  const handleNotiToggle = () => {
    try {
    Notification.requestPermission().then(function(result) {
    console.log(result);
    if (result === "granted") {
      var currentState = notiChecked;
      setNotiChecked(!currentState);
      // currentState um async Probleme zu verhindern
      //localStorage['notifications'] = String(!currentState);
    }
    });
    } catch (err) {
      console.log(err);
    }
  }
  
  React.useEffect(() => {
    getMyMensa();
    //setNotiChecked(Boolean(localStorage.getItem('notifications')));
  }, [])

  return (
    <div className={classes.pageContent}>
      <Typography variant="body1" className={classes.headers}>
      Meine Mensa
      </Typography>
      <MensaCard mensa={mensa} link="/settings/mymensa" />

      <List >
        <ListItem button component={Link} to="/settings/myspeisen" className={classes.listItem}>
          <ListItemIcon>
            <RestaurantIcon />
          </ListItemIcon>
          <ListItemText primary="Lieblingsspeisen" />
          
            <NavigateNextIcon />
          
        </ListItem>
      </List>
      
      <br/>
      <Typography variant="body1" className={classes.headers}>
      Benachrichtigungen
      </Typography>
      <List>
        <ListItem>
        <ListItemIcon>
          <NotificationsActiveIcon />
        </ListItemIcon>
        <ListItemText id="switch-list-label-wifi" primary="Lieblingsspeise in meiner Mensa" />
        <ListItemSecondaryAction>
        <ThemeProvider theme={materialTheme}>
          {mensa ? 
          <Switch
            edge="end"
            onChange={handleNotiToggle}
            checked={notiChecked}
            inputProps={{ 'aria-labelledby': 'switch-list-label-wifi' }}
          /> 
          : 
          <Switch disabled inputProps={{ 'aria-label': 'disabled checkbox' }} />
          }
          </ThemeProvider>
        </ListItemSecondaryAction>
      </ListItem>
      </List>
      <div className={classes.testNotification}>
      <Button variant="contained" onClick={()=> {notifications.notifyTodaysMeals()}}>
      TESTE BENACHRICHTIGUNGEN
      </Button>
      </div>
    </div>
  )
}

export default Settings;

