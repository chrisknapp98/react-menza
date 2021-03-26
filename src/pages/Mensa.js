import React from 'react';
//import logo from '../logo.svg';

//import TopAppBar from '../components/TopAppBar';
import { makeStyles, createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import 'date-fns';
import deLocale from "date-fns/locale/de";
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { Link } from 'react-router-dom';

import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import { fetchSpeisenForDay } from '../logic/Data';
import * as DatabaseAPI from '../database/DatabaseAPI';
import * as Preferences from '../database/Preferences';
import SpeisenStructured from '../components/SpeisenStructured';


const useStyles = makeStyles((theme) => ({
  pageContent: {
    marginLeft: "10px",
    marginRight: "10px",
  },
  headers: {
    textAlign: "left",
  },
  keineSpeisen: {
    fontSize: "14pt",
  },
  container: {
    height: "50px",
    display: 'flex',
    alignItems: "flex-start",
  },
  todayButton: {
    padding: "5px 10px",
  },
  today: {
    width: "30%",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  dateButtons: {
    height: "34px",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    width: "70%",
  },
  dateBar: {
    width: "100%",
    display: "flex",
  },
  dateInput: {
    display: "flex",
    alignItems: "flex-start",
  },
  datePicker: {
    width: "175px",
  },
  selectMyMensaButton: {
    margin: "50px", 
    display: 'flex',
    justifyContent: 'center',
  },
}));

const materialTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#70d47c",  
    },
  }
  
});

function Mensa(props) {
  const [selectedDate, setSelectedDate] = React.useState(new Date("2019-11-18"));
  
  const [mensa, setMensa] = React.useState(null);
  const [speisen, setSpeisen] = React.useState([]);

  var getMensaFromUrl = async () => {
    var url = window.location.href;
    var urlListSplitted = url.split("/");
    var index = urlListSplitted.length - 1; // letztes Item des Arrays

    var promise = DatabaseAPI.getFromDatabase("mensaDB", urlListSplitted[index], "id")
    .then(list => {
      setMensa(list[0]);
      return list[0];
    })
    return promise;
  }

  var getSpeisenList = async (inpMensa) => {
    if (mensa) {
      var tempSpeisen = await fetchSpeisenForDay(mensa.id, selectedDate);
      setSpeisen(tempSpeisen);
    } else if (inpMensa) {
      var tempSpeisen2 = await fetchSpeisenForDay(inpMensa.id, selectedDate);
      setSpeisen(tempSpeisen2);
    }
  }

  React.useEffect(() => {
    if (props.type === "myMensa") {
      //setSelectedDate(new Date());  // Standardmaessig heute
      Preferences.getMyMensa()
      .then(item => {
        if (item !== null) { 
        setMensa(item);
        getSpeisenList(item); 
        } 
      })
    } else {
      getMensaFromUrl()
      .then(item => {
        getSpeisenList(item);
      })
    }
  }, []);

  React.useEffect(() => {
    getSpeisenList();
  }, [selectedDate]);


  const classes = useStyles(); 

  const handleDateChange = date => {
    setSelectedDate(date);
  };

  const handleBeforeButton = () => {
    var yesterday = new Date(selectedDate.getTime());
    yesterday.setDate(selectedDate.getDate() - 1); 
    setSelectedDate(yesterday); 
  };

  const handleAfterButton = () => {
    var tomorrow = new Date(selectedDate.getTime());
    tomorrow.setDate(selectedDate.getDate() + 1); 
    setSelectedDate(tomorrow); 
  };

  return (
    <div className={classes.pageContent}>
    
        {mensa ? <>
        <div className={classes.headers}>
        <Typography variant="h5">
        {mensa.name}
        </Typography> 
        <Typography variant="body1">
        {mensa.address}
        </Typography>
        <br />
        <Divider />
        <br />
        <Typography variant="h5">
        Speiseplan
        </Typography>
        <br />
        </div>
        <div className={classes.dateBar}>
        <div className={classes.today}>
            <Button 
              variant="contained" 
              onClick={() => {handleDateChange(new Date())}}
              className={classes.todayButton}>
                heute
            </Button>
            </div>
            <div className={classes.dateButtons} >
                <IconButton size="small"
                  onClick={handleBeforeButton}>
                    <NavigateBeforeIcon size="small"/> 
                </IconButton>
              <div className={classes.dateInput}>
              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={deLocale}>
              
                <form className={classes.container}>
                <ThemeProvider theme={materialTheme}>
                  <KeyboardDatePicker
                    className={`${classes.datePicker} without-padding`}
                    margin="normal"
                    id="date-picker-dialog"
                    label=""
                    format="dd.MM.yyyy"
                    inputVariant="outlined"
                    value={selectedDate}
                    cancelLabel="Abbrechen"
                    showTodayButton={true}
                    todayLabel="heute"
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                  </ThemeProvider>
                </form>
              </MuiPickersUtilsProvider>
                </div>
              <IconButton size="small"
                onClick={handleAfterButton}>
                  <NavigateNextIcon size="small" /> 
              </IconButton>
           </div>
        </div>

        <br />

        <div className={classes.speisen}>
        {(speisen.length >= 1) ? <SpeisenStructured list={speisen} /> 
        :
        <Typography variant="body2" className={classes.keineSpeisen}>
        Keine Speisen verfügbar
        </Typography>
        }
        </div>
        
        </> : <>
        {props.type === "myMensa" ? 
    	  <>
        <Typography variant="h6">
        Du hast deine Mensa noch nicht festgelegt
        </Typography>
        <div className={classes.selectMyMensaButton}>
        <Button variant="contained" component={Link} to="/settings/mymensa">
          Jetzt auswählen
        </Button>
        </div>
        </>
        :
        <Typography variant="h5">
        Mensa nicht gefunden
        </Typography>
        }
        </>}
    </div>
  )
}

export default Mensa;
