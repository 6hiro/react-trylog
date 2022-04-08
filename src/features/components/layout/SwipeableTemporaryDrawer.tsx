import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
// import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Link, useNavigate } from "react-router-dom";

import styles from "./Layout.module.css";


type Anchor = 'top' | 'left' | 'bottom' | 'right';

export default function SwipeableTemporaryDrawer() {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {/* {['つぶやく', '計画作成'].map((text, index) => ( */}
          <>
            <Link 
              to={"/post/add"}
              style={{ textDecoration: 'none', color: 'black', fontSize: '20px', fontWeight: 'bolder'}} 
            >
              <ListItem button>
                <ListItemIcon>
                    <i className='bx bx-message-detail'></i> 
                </ListItemIcon>
                <ListItemText primary='つぶやく' />
              </ListItem>
            </Link>

            <Link 
              to={"/roadmap/add"}
              style={{ textDecoration: 'none', color: 'black', fontSize: '20px', fontWeight: 'bolder'}} 
            >
              <ListItem button>
                <ListItemIcon>
                    <i className='bx bx-paper-plane' ></i>
                </ListItemIcon>
                <ListItemText primary='計画作成' />
              </ListItem>
            </Link>
          </>
        {/* ))} */}
        
      </List>
      {/* <Divider /> */}
      {/* <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List> */}
    </Box>
  );

  return (
    <div>
      {/* {(['bottom'] as const).map((anchor) => ( */}
        {/* // <React.Fragment key={anchor}> */}
        <React.Fragment key="bottom">
          {/* <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button> */}
          <div className={styles.nav__link} onClick={toggleDrawer("bottom", true)}>
            <i className={`bx bx-plus ${styles.nav__icon}`}></i>
            <span className={styles.nav__name}>作成</span>
          </div>

          <SwipeableDrawer
            anchor={"bottom"}
            open={state["bottom"]}
            onClose={toggleDrawer("bottom", false)}
            onOpen={toggleDrawer("bottom", true)}
          >
            {list("bottom")}
          </SwipeableDrawer>
        </React.Fragment>
      {/* ))} */}
    </div>
  );
}