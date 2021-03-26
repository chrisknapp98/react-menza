import React from 'react';
import { useHistory } from 'react-router-dom';
import appLogo from '../appLogo.png'
import { fade, makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import Divider from '@material-ui/core/Divider';

import * as DatabaseAPI from '../database/DatabaseAPI';
import * as Preferences from '../database/Preferences';

import { SearchContext } from '../App';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appbar: {
    backgroundColor: "#FFFFFF", //"#ecf0f1", // Creme white
    display: "flex",
    position: "fixed",
    left: 0,
    right: 0,
    top: 0,
    flexGrow: 1,
  }, 
  appbarLogo: {
    alignItems: "center",
  },
  appbarTitle: {
    color: "black", //"#34495e",
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    flexGrow: 1,
  },
  appBarBackTitleFav: {
    flexGrow: 1,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  backIcon: {
    position: "relative",
    alignItems: "left",
    color: "black",
    left: "0px",
  },
  favIcon: {
    display: "flex",
    justifyContent: "flex-end",
    color: "black",
    right: "0px",
  },
  placeHolder: {
    height: "48px",
    width: "48px",
  },
  search: {
    display: "flex",
    alignItems: "center",
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.black, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.black, 0.25),
    },
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationIcon: {
    paddingRight: "0px",
    height: '100%',
    position: 'relative',
    display: 'flex',
  },
  inputRoot: {
    color: 'inherit',
    width: "100%",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%', //'250px',
    [theme.breakpoints.up('sm')]: {
      width: '40ch',
      '&:focus': {
        width: '50ch',
      },
    },
  },
}));

const heartColor = "#70d47c";

const materialTheme = createMuiTheme({
  palette: {
    primary: {
      main: heartColor,  
    },
  }
});

/**
 * Creates a AppBar on top of the page
 * @param bartype Can be logo, search, default or anything else (default)
 * @param titleName String to be displayed 
 * @param back show backButton (bool), does NOT apply to bartype = 'logo'
 * @param fav show favButton (bool), only applies when bartype = 'default'
 */
function TopAppBar(props) {
  const { searchText, setSearchText } = React.useContext(SearchContext);
  //setSearchText(""); // SearchText zuruecksetzen
  const [mensa, setMensa] = React.useState(null);
  const [favButton, setFavButton] = React.useState(false);
  const classes = useStyles();

  let history = useHistory();

  async function getFavMensen() {
    return new Promise(async (resolve, reject) => {
      Preferences.getFavMensen()
      .then(retMensa => {
        resolve(retMensa);
      })
    })
    .then(response => {
      //setMensa(response);
      return response;
    })
  }

  const getMensaFromUrl = async () => {
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

  const checkIfInFavMensen = () => {
    return new Promise(async (resolve, reject) => {
      return getMensaFromUrl()
      .then(retMensa => {
        setMensa(retMensa)
        resolve(retMensa);
      })
    })
    .then(async (tempMensa) => {
      var mensaList = await getFavMensen();
      return [tempMensa, mensaList];
    }) 
    .then(list => {
      var tempMensa = list[0];
      var mensaList = list[1];
      var foundInList = false;
      if (mensaList.length !== 0) {
      for (var obj of mensaList) {
        if (obj.id === tempMensa.id) {
          foundInList = true;
          break;
        }
      }
      }
      return [tempMensa, foundInList];
    })
  }

  const handleOnChangeSearch = event => {
    setSearchText(event.target.value);
  };

  const handleLocationButtonClick = event => {
    navigator.geolocation.getCurrentPosition( position => {
      var coordsFormated = position.coords.latitude + ", " + position.coords.longitude;
      setSearchText(coordsFormated);
      document.getElementById('searchField').value = coordsFormated;
    });
  }

  const handleFavouriteButton = async () => {
 
    checkIfInFavMensen().then(list => {
      var tempMensa = list[0];
      var bool = list[1]; 
      console.log(bool);
      
      if (bool) {
        Preferences.removeMensaFromFavs(tempMensa);
      } else {
        Preferences.addMensaToFavs(tempMensa);
      }
      setFavButton(!bool);
    })

  }


  React.useEffect(() => {
    const checkFavButton = async () => {
    if (props.fav) {
    checkIfInFavMensen()
    .then(list => {
      var tempMensa = list[0];
      var bool = list[1];
      if (bool) {
        setFavButton(true);
      }
    });

    } 
    
    }
    checkFavButton();
  }, [])


  if (props.bartype === "logo") {
    // nur Logo
    return(
      <AppBar position="static" className={`${classes.appbar} ${classes.appbarLogo}`}>
      
        <Toolbar>
        
          <img src={appLogo} className="AppLogo" alt="appLogo" />
        
        </Toolbar>
        
      </AppBar>
    )
  }
  else if (props.bartype === "search") {
    // Suchleiste ggfs mit Back Button
    return(
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          { props.back ? (
            <div className={classes.backIcon}>
            <IconButton onClick={() => {history.goBack()}}>
              <ArrowBackIosIcon />
            </IconButton>
            </div>
          ) : <></> }
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              id="searchField"
              placeholder="Nach Mensa suchen..."
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              onChange={handleOnChangeSearch}
            />
            <div className={classes.locationIcon}>
              <Divider color="primary" orientation="vertical" flexItem />
              <IconButton onClick={handleLocationButtonClick}>
                <MyLocationIcon />
              </IconButton>
            </div>
          </div>
        </Toolbar>
      </AppBar>
    )
    
  }
  else { 
    // Leiste mit festegelegtem Titel 'titleName' und ggfs. Back Button und Fav Button
    return(
      
      <AppBar position="static" className={classes.appbar}> 
        <Toolbar>
          
          { props.back ? (
            <div className={classes.backIcon}>
            <IconButton onClick={() => {history.goBack()}}>
            <ArrowBackIosIcon />
            </IconButton>
            </div>
          ) : <div className={classes.placeHolder}></div> }
          
          <Typography variant="h5" className={classes.appbarTitle}>
            {props.titleName}
          </Typography>
          
          {props.fav ? (
            <div className={classes.favIcon}>
            <ThemeProvider theme={materialTheme}>
            <IconButton onClick={() => {handleFavouriteButton()}}>
            {favButton ? <FavoriteIcon color="primary" />
            : 
            <FavoriteBorderIcon color="primary"/>}
            </IconButton>
            </ThemeProvider>
            </div>
          ) : <div className={classes.placeHolder}></div>}
         
        </Toolbar>
      </AppBar>
    )
  }
}


export default TopAppBar;