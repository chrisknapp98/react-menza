import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import FavoriteIcon from '@material-ui/icons/Favorite';
import SettingsIcon from '@material-ui/icons/Settings';

const useStyles = makeStyles({
  bottomMenu: {
    width: "100%",
    position: "fixed",
    bottom: 0,
    justifyContent: "center",
    display: "flex",
    justify: "center",
    alignItems: "center",
  },
  action: {
    "&$selected": {
      color: "#70d47c",
    }
  },
  selected: {
    
  },
});


/**
 * Creates a BottomNavigation component at the bottom of the page
 * @param selection Set the initial selection
 */
function BottomNavbar(props) {
  const [value, setValue] = React.useState(props.selection);
  const classes = useStyles();


  const handleSelectionChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="bottomNavbar">
      <BottomNavigation
        value={value}
        onChange={handleSelectionChange}
        showLabels
        className={classes.bottomMenu}
      >
        <BottomNavigationAction classes={{
      root: classes.action,
      selected: classes.selected
    }} label="Home" value="home" icon={<HomeIcon />} component={Link} to="/home" />
        <BottomNavigationAction classes={{
      root: classes.action,
      selected: classes.selected
    }} label="Suchen" value="search" icon={<SearchIcon />} component={Link} to="/search" />
        <BottomNavigationAction classes={{
      root: classes.action,
      selected: classes.selected
    }} label="Favoriten" value="favourites" icon={<FavoriteIcon />} component={Link} to="/favourites" />
        <BottomNavigationAction classes={{
      root: classes.action,
      selected: classes.selected
    }} label="Einstellungen" value="settings" icon={<SettingsIcon />} component={Link} to="/settings" />
      </BottomNavigation>
    </div>
  )
}

export default BottomNavbar;