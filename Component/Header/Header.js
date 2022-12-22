import { Box, Button, Divider, IconButton, List, ListItem, SwipeableDrawer, Tooltip, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import HeaderNotifications from "../../src/layouts/SidebarLayout/Header/Buttons/Notifications/index"
import HeaderSearch from "../../src/layouts/SidebarLayout/Header/Buttons/Search/index"
import HeaderUserbox from "../../src/layouts/SidebarLayout/Header/Userbox/index"
import { SidebarContext } from 'src/contexts/SidebarContext';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import Link from "next/link"
import {useRouter} from "next/router"
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import StoreIcon from '@mui/icons-material/Store';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SavingsIcon from '@mui/icons-material/Savings';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import TableChartTwoToneIcon from '@mui/icons-material/TableChartTwoTone';
import supabase from 'src/Config/supabaseClient';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';


const Header = () => {

  
  const router = useRouter();
  const currentRoute = router.pathname;
  const [userExists, setUserExists] = useState(false);
  const [reRender, setRerender] = useState(false);

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [sidebarToggle, setSidebarToggle] = useState(false)

  const toggleDrawer = (anchor, open) =>
    (event) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event).key === 'Tab' ||
          (event).key === 'Shift')
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
      setSidebarToggle(!sidebarToggle)
    };

  // const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);

  const signOutHandler = async () => {
    const res = await supabase.auth.signOut();
    setRerender(!reRender)
    router.push("/")
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
     <Box className={'headerToggleBox'}>
        <Typography className="AppName">Investment App</Typography>
        <br />
        <Divider />
        {userExists == false ? (
          <List component="div">
            <ListItem component="div" className={'listItem'}>
              <Link href="/LoginPage">
                <Button
                  className={
                    currentRoute === '/LoginPage' ? 'active' : 'notActive'
                  }
                  disableRipple
                  // onClick={() => router.push("LoginPage")}
                  startIcon={<LoginIcon />}
                >
                  Login
                </Button>
              </Link>
            </ListItem>
            <ListItem component="div" className={'listItem'}>
              <Link href="/SignUpPage">
                <Button
                  className={
                    currentRoute === '/SignUpPage' ? 'active' : 'notActive'
                  }
                  disableRipple
                  // onClick={() => router.push("SignUpPage")}
                  startIcon={<HowToRegIcon />}
                >
                  Sign Up
                </Button>
              </Link>
            </ListItem>
          </List>
        ) : (
          <List component="div" className={'listDiv'}>
            <ListItem component="div" className={'listItem'}>
              <Link href="/dashboards/tasks">
                <Button
                  className={
                    currentRoute === '/dashboards/tasks'
                      ? 'active'
                      : 'notActive'
                  }
                  disableRipple
                  // onClick={() => router.push("/dashboards/tasks")}
                  startIcon={<DashboardCustomizeIcon />}
                >
                  Dashboard
                </Button>
              </Link>
            </ListItem>
            <ListItem component="div" className={'listItem'}>
              <Link href="/PortfolioPage">
                <Button
                  className={
                    currentRoute === '/PortfolioPage' ? 'active' : 'notActive'
                  }
                  disableRipple
                  // onClick={() => router.push("PortfolioPage")}
                  startIcon={<SavingsIcon />}
                >
                  Portfolio
                </Button>
              </Link>
            </ListItem>
            <ListItem component="div" className={'listItem'}>
              <Link href="/FundPage">
                <Button
                  className={
                    currentRoute === '/FundPage' ? 'active' : 'notActive'
                  }
                  disableRipple
                  // onClick={() => router.push("FundPage")}
                  startIcon={<AddCircleOutlineIcon />}
                >
                  Add Fund
                </Button>
              </Link>
            </ListItem>
            <ListItem component="div" className={'listItem'}>
              <Link href="/WithDrawPage">
                <Button
                  className={
                    currentRoute === '/WithDrawPage' ? 'active' : 'notActive'
                  }
                  disableRipple
                  // onClick={() => router.push("WithDrawPage")}
                  startIcon={<RemoveCircleOutlineIcon />}
                >
                  WithDraw
                </Button>
              </Link>
            </ListItem>
            <ListItem component="div" className={'listItem'}>
              <Link href="/management/transactions">
                <Button
                  className={
                    currentRoute === '/management/transactions'
                      ? 'active'
                      : 'notActive'
                  }
                  disableRipple
                  // onClick={() => router.push("management/transactions")}
                  startIcon={<TableChartTwoToneIcon />}
                >
                  Transactions
                </Button>
              </Link>
            </ListItem>
            <ListItem component="div" className={'listItem'}>
              <Link href="/AssetsPage">
                <Button
                  className={
                    currentRoute === '/AssetsPage' ? 'active' : 'notActive'
                  }
                  disableRipple
                  // onClick={() => router.push("AssetsPage")}
                  startIcon={<StoreIcon />}
                >
                  Show Assets
                </Button>
              </Link>
            </ListItem>
            {/* <ListItem component="div" className={'listItem'}>
              <Link href="/Basket" className={'link'}>
                <Button
                  className={
                    currentRoute === '/Basket' ? 'active' : 'notActive'
                  }
                  disableRipple
                  // onClick={() => router.push("Basket")}
                  startIcon={<ShoppingBasketIcon />}
                >
                  Basket
                </Button>
              </Link>
            </ListItem> */}
            <ListItem component="div" className={'listItem'}>
              {/* <Link href="/"> */}
              <Button
                className="signoutBtn"
                disableRipple
                startIcon={<LogoutIcon />}
                onClick={() => signOutHandler()}
              >
                Sign Out
              </Button>
              {/* </Link> */}
            </ListItem>
          </List>
        )}
      </Box>
    </Box>
  );

  useEffect(() => {
    let user = localStorage.getItem('sb-ziaxsvytbaahgjrompdd-auth-token');
    if (user == null) {
      setUserExists(false);
    } else {
      setUserExists(true);
    }
  }, [reRender]);

  return (
    <Box className={"HeaderMainBox"}>
      <HeaderSearch />
      <HeaderNotifications />
      <HeaderUserbox />
      <Box
          component="span"
          className={"toggleButton"}
        >
          <Tooltip arrow title="Toggle Menu">
            <IconButton color="primary" 
            onClick={toggleDrawer("left", true)}
            >
              {!sidebarToggle ? (
                <MenuTwoToneIcon fontSize="small" />
               ) : ( 
                <CloseTwoToneIcon fontSize="small" />
               )} 
            </IconButton>
          </Tooltip>
        </Box>

        <SwipeableDrawer
            anchor={"left"}
            open={state["left"]}
            onClose={toggleDrawer("left", false)}
            onOpen={toggleDrawer("left", true)}
          >
            {list("left")}
          </SwipeableDrawer>
    </Box>
  )
}

export default Header