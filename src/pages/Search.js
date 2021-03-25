import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import MensaCard from '../components/MensaCard';

import { distance } from '../utils/DistCalculator';
import * as DatabaseAPI from '../database/DatabaseAPI';
import { SearchContext, SelectedMensaContext } from '../App';

const useStyles = makeStyles((theme) => ({
  root: {

  },
  headers: {
    textAlign: "left",
    marginLeft: "20px",
    marginRight: "20px",
  },
  mensaCards: {
   
  },
  filterSort: {
    marginLeft: "20px",
    marginRight: "20px",
  },
   button: {
    display: 'flex',
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));


/**
 * Creates multiple MensaCards. One for each element in list array passed as argument 
 * @param list the list of mensa objects
 * @param type Only use for setting MyMensa 'setMyMensa'
 * @param text the searchText 
 * @param distance boolean to decide whether distanceLabel and Icon are shown
 */
function MensaCards(props) {
  var link;
  var button;
  if (props.type === "setMyMensa") {
    link = "/settings";
    button = "setMyMensa"
  } else {
    link = "/mensa/";
    button = "";
  }
  var coordsAsArr = [];
  //var distance = [];
  if (props.distance) {
    var tempArr = props.text.split(",");
    coordsAsArr.push(tempArr[0]);
    coordsAsArr.push(tempArr[1]);
    
    if (props.list) {
      props.list.forEach(item => {
        if (item.coordinates != null) {
          var dist = distance(coordsAsArr[0], coordsAsArr[1], item.coordinates[0], item.coordinates[1]);
          item.distance = dist.toFixed(1);
        } 
      })
    }
    props.list.sort((a, b) => {
      return a.distance - b.distance;
    })
  }
  return(
    <>
    {props.list ? 
      props.list.map( item => (
      <MensaCard mensa={item} link={props.type === "setMyMensa" ? link : link + item.id} 
      button={button} distance={props.distance}/>
    )) : <></>
    }
    </>
  )
}

function isFloat(n){
    return n % 1 !== 0;
}
/**
 * Creates the search page including the logic behind the inputField in TopAppBar using Context. Also has filter dropdown button to filter searchText by all, name, address, city
 * @param type Only use if search result should set MyMensa. Use 'setMyMensa'
 */
function Search(props) {
  const {searchText, setSearchText} = React.useContext(SearchContext);
  const [mensaList, setMensaList] = React.useState([]);
  const [coords, setCoords] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [filter, setFilter] = React.useState("all");
  const [timeoutRunning, setTimeoutRunning] = React.useState(false);
  const classes = useStyles();


  const searchAllMensen = async () => {
    var fullList = [];
    var categories = ["name", "city", "address", "coordinates"];

    // Iteration - Ueberpruefe, ob Mensa bereits verhanden und fuege hinzu wenn nicht 
    const checkAndPush = mensen => {
      var idList = fullList.map(item => {
        return item.id;
      })
      var listLength = fullList.length
      var mensa;
      for (mensa of mensen) {
        if (!idList.includes(mensa.id)) {
          fullList.push(mensa);
        }
      }
    }
    var promise = 
      DatabaseAPI.getFromDatabase("mensaDB", searchText, categories[0])
      .then(mensen => {
        fullList = fullList.concat(mensen);
      })
      .then(() => {
        return DatabaseAPI.getFromDatabase("mensaDB", searchText, categories[1])
        .then(mensen => {
          return mensen;
        })
      })
      .then(cityMensen => {
        checkAndPush(cityMensen);
      })
      .then(() => {
        return DatabaseAPI.getFromDatabase("mensaDB", searchText, categories[2])
        .then(mensen => {
          return mensen;
        })
      })
      .then(addressMensen => {
        checkAndPush(addressMensen);
      })
    .then(() => {
      return fullList;
    })
    return promise;
  }


  const getMensaList = async () => {
    var tempMensaList = [];
    var coordsInput = false;
    var splittedSearchText = searchText.split(","); 
    if (splittedSearchText.length === 2) {
      if (isFloat(Number(splittedSearchText[0])) && isFloat(Number(splittedSearchText[1])) ) {
        coordsInput = true;
        setCoords(true);
      } else {
        setCoords(false);
      }
    }

    var searchLength = searchText.length;
    let states = ["all", "name", "city", "address", "coordinates"];

    const searchMensenFiltered = selState => {
      return new Promise(async (resolve, reject) => {
          resolve(await DatabaseAPI.getFromDatabase("mensaDB", searchText, selState));
        })
        .then(response => {
          setMensaList(response);
          return response;
        })
        .catch(err => {console.log("failed")})
    }

    if (searchLength > 1) {
      if (coordsInput) {
        // Coordinates
        searchMensenFiltered(states[4]);
        return
      }
    
      switch (filter) {
        case states[0]:
        // Alle
          return new Promise(async (resolve, reject) => {
            resolve(await searchAllMensen());
          })
          .then(response => {
            setMensaList(response);
            return response;
          })
          .catch(err => {console.log("failed")})
          break;
        case states[1]:
        // Name
          searchMensenFiltered(states[1]);
          break;
        case states[2]:
        // City
          searchMensenFiltered(states[2]);
          break;
        case states[3]:
        // Adresse
          searchMensenFiltered(states[3]);
          break; 
        default: 
          console.log("no match");
      }
    }
  }
  
  React.useEffect( () => {
    // Fuehre Methode jedes mal aus, wenn sich searchText aendert
    const textLength = searchText.length;
    if (textLength > 0) {
      setMensaList([]);
      // Warte 1 Sekunde bis User zuende getippt hat
    const timer = setTimeout(async () => {
      var mensaListNew = await getMensaList();
    }, 1000)
    return () => clearTimeout(timer);
    }
  }, [searchText]);

  React.useEffect(() => {
    getMensaList();
  }, [filter])

  const handleChange = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEntering = () => {
    setOpen(true);
  };

  const handleFilterChange = (event, value) => {
    setFilter(value)
    handleClose();
  }

  return (
    <div className={classes.root}>
    <div className={classes.filterSort}>
      <Button className={classes.button} onClick={handleChange}>
        Filter
        <ArrowDropDownIcon />
      </Button>
      <Menu
        id="demo-controlled-open-select"
        anchorEl={open}
        keepMounted
        open={Boolean(open)}
        onClose={handleClose}
      >
        <MenuItem 
          onClick={(e) => {handleFilterChange(e, "all")}} 
          value="all" 
          selected={filter === "all"}>
          <em>Alle</em>
        </MenuItem>
        <MenuItem 
          onClick={(e) => {handleFilterChange(e, "name")}} 
          value="name" 
          selected={filter === "name"}>
          Name
        </MenuItem>
        <MenuItem 
          onClick={(e) => {handleFilterChange(e, "city")}} 
          value="city"
          selected={filter === "city"}>
          Stadt
        </MenuItem>
        <MenuItem 
          onClick={(e) => {handleFilterChange(e, "address")}} value="address"
          selected={filter === "address"}>
          Adresse
        </MenuItem>
      </Menu>
   
    </div>

      <div className={classes.headers}>
        <Typography variant="body1">
        Durchsuche die Datenbank nach Name, Stadt, Adresse oder Positionsdaten im Radius von 20km
        </Typography>
      </div>
      <div className={classes.mensaCards}>
        <SelectedMensaContext.Provider>
        <MensaCards list={mensaList} type={props.type === "setMyMensa" ? "setMyMensa" : "default"} text={searchText} distance={coords} />
        </SelectedMensaContext.Provider>
      </div>
    </div>
  )
}

export default Search;