import React from 'react';

import { makeStyles } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


import SpeisePaper from './SpeisePaper';

const useStyles = makeStyles({
  pageContent: {

  },
  speisePaper: {
    flexBasis: "100%",
  },
  paperList: {
    listStyleType: "none",
    paddingLeft: 0,
  },
  list: {
    width: "100%"
  },
});

function AccordionAndSpeisen(props) {
  const classes = useStyles();
  return(
    <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>{props.heading}</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <div className={classes.paperList}>
        <ul className={classes.list}>
          {props.list.map(item => (
            <div className={classes.speisePaper}>
            <li className={classes.list}>
            <SpeisePaper speise={item} />
            </li>
            </div>
          ))}

        </ul>
        </div>
        </AccordionDetails>
      </Accordion>
  )
}
/* 
function AccordionDisabled(props) {
  const classes = useStyles();
  return(
    <Accordion disabled>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel3a-content"
        id="panel3a-header"
      >
        <Typography className={classes.heading}>{props.heading}</Typography>
      </AccordionSummary>
    </Accordion>
  )
}
 */
function SpeisenStructured(props) {
  //const classes = useStyles(); 
  const dict = {};
  props.list.forEach(item => {
    if (dict[item.category] === undefined) {
      dict[item.category] = [item];
    } else {
      dict[item.category].push(item);
    }
  })

  return(
    <>
    {Object.keys(dict).map(category => (
      <AccordionAndSpeisen heading={category} list={dict[category]} />
    ))}
    </>
  );
}

export default SpeisenStructured;
