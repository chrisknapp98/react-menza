
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import './App.css';
import { makeStyles } from '@material-ui/core/styles';

import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import BottomNavbar from './components/BottomNavbar';
import TopAppBar from './components/TopAppBar';

import Home from './pages/Home';
import Search from './pages/Search';
import Settings from './pages/Settings';
import Mensa from './pages/Mensa';
import Favourites from './pages/Favourites';
import Lieblingsspeisen from './pages/Lieblingsspeisen';

import * as DatabaseAPI from './database/DatabaseAPI';

const useStyles = makeStyles((theme) => ({

  appbar: {
    //"text-align": "center",
    backgroundColor: "#FFFFFF", //"#ecf0f1", // Creme white
    display: "flex",
    alignItems: "center",
  },
  pageContent: {
    marginTop: "70px",
    marginBottom: "65px",
  },
  snackbar: {
    [theme.breakpoints.down('xs')]: {
      bottom: 90,
    },
  },
}));

export const accentColor = "#70d47c";

export const SearchContext = React.createContext("");
export const SelectedMensaContext = React.createContext(null);

function App() {
  //const [value, setValue] = React.useState(0);
  const classes = useStyles();

  //const [selection, setSelection] = React.useState("");
  //const { searchText } = React.useContext(SearchContext);
  const [searchText, setSearchText] = React.useState("");
  const [selectedMensa, setSelectedMensa] = React.useState(null);
  const [online, setOnline] = React.useState(navigator.onLine);
  const [displayOffline, setDisplayOffline] = React.useState(false);

  const getMensaDB = async () => {
    let db = await DatabaseAPI.initMensaDB();
  }

  const handleCloseOfflineAlert = () => {
    setDisplayOffline(!displayOffline);
  }

  React.useEffect(() => {
    getMensaDB();
    setDisplayOffline(!online);
    if (localStorage.getItem('notifications') === undefined) {
      localStorage['notifications'] = "false";
    }
  }, []);

  return (

    <div className="App">
      <header className="App-header">
        
        <Router>

          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <SearchContext.Provider value={{searchText, setSearchText}}>
            <SelectedMensaContext.Provider value={{selectedMensa, setSelectedMensa}}>
            {/* Automatisch auf /home weiterleiten */}
            <Route exact path="/" render={() => {
              return(
                <Redirect to="/home" />
              )
            }} />
              
            <Route path="/home">
              <TopAppBar bartype="logo" titleName="Home" />
              <div className={classes.pageContent}>
                <Home />
              </div>
              <BottomNavbar selection="home" />
            </Route>
              
            <Route path="/search" >
              <TopAppBar bartype="search" titleName="Suchen" />
              <div className={classes.pageContent}>
                <Search />
              </div>
              <BottomNavbar selection="search" />
            </Route>

            <Route path="/mensa" >
              
              <TopAppBar titleName="Mensa" back="true" fav="true" />
              <div className={classes.pageContent}>
                <Mensa />
              </div>
              
              <BottomNavbar />
            </Route>

            <Route exact path="/favourites" >
              <TopAppBar titleName="Lieblingsmensen" />
              <div className={classes.pageContent}>
                <Favourites />
              </div>
              <BottomNavbar selection="favourites" />
            </Route>
              
            <Route exact path="/settings" >
              <TopAppBar titleName="Einstellungen" />
              <div className={classes.pageContent}>
                <Settings />
              </div>
              <BottomNavbar selection="settings" />
            </Route>

            <Route path="/settings/mymensa" >
              <TopAppBar bartype="search" back="true" />
              <div className={classes.pageContent}>
                <Search type="setMyMensa" />
              </div>
              <BottomNavbar selection="settings" />
            </Route>

            <Route path="/settings/myspeisen" >
              <TopAppBar titleName="Lieblingsspeisen" back="true" />
              <div className={classes.pageContent}>
                <Lieblingsspeisen />
              </div>
              <BottomNavbar selection="settings" />
            </Route>
            </SelectedMensaContext.Provider>
            </SearchContext.Provider>
             
          </Switch>
          
          
        </Router>

        <Snackbar
          open={displayOffline}
          message="Keine Internetverbindung"
          action={
            <IconButton color="inherit" size="small" onClick={handleCloseOfflineAlert}>
              <CloseIcon />
            </IconButton>
          }
          className={classes.snackbar}
        />

      </header>
    </div>




  );
}

export default App;
