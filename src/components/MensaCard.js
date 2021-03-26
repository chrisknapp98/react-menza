import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';

import LocationOnIcon from '@material-ui/icons/LocationOn';

import * as Preferences from '../database/Preferences';

// LocationIcon

const useStyles = makeStyles({
  root: {
    height: "120px",
    margin: "10px",
  },
  contentLeft: {
    width: "100%",
    alignItems: "flex-start",
    textAlign: "left",
  },
  contentRight: {
  },
  distance: {
    right: "30px",
  },
  text: {
    alignItems: "left",
  },
  button: {
    height: "100%",
    width: "100%",
  },
});

/**
 * Creates a MUI Card component with the title, address and an optional distance for a given mensa object
 * @param mensa Mensa object
 * @param button Only use for setting MyMensa object, type 'setMyMensa'
 * @param distance Distance in km to be displayed
 */
function MensaCard(props) {
  const [distanceLabel, setDistanceLabel] = React.useState(false);
  const classes = useStyles();

  function handleCardClick(mensa) {
    if (props.button === "setMyMensa") {
      Preferences.setMyMensa(mensa);
    }
  }

  React.useEffect(() => {
    if (props.distance != null) {
      setDistanceLabel(Boolean(props.distance));
    } else {
      setDistanceLabel(false);
    }
    //console.log(props.distance);
  }, [])

  return (
    <div className="mensaCard">
      <Card className={classes.root}>
      <ButtonBase
          onClick={() => handleCardClick(props.mensa)}
          className={classes.button}
          component={Link}
          to={props.link}
      >
      <CardContent className={classes.contentLeft}>
        <div className={classes.text}>
        <Typography variant="h6" component="h2" className={classes.contentLeft}>
          {props.mensa ? props.mensa.name : "Nicht festgelegt"}
        </Typography>
        <Typography variant="body2" component="p" className={classes.contentLeft}>
          {props.mensa ? props.mensa.address : "Mensa auswählen"}
        </Typography>
        </div>
        </CardContent>
        {(distanceLabel === true) && (!isNaN(props.mensa.distance)) && 
        <CardContent className={classes.contentRight}>
        <div className={classes.distance}>
          <LocationOnIcon />

          <Typography variant="body2" component="p">
          {distanceLabel ? props.mensa.distance + "km" : ""}
          </Typography>
        </div>
      </CardContent>}
      
      </ButtonBase>
    </Card>
    </div>
  )
}

export default MensaCard;


