import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import StoreIcon from '@mui/icons-material/Store';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SavingsIcon from '@mui/icons-material/Savings';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import supabase from 'src/Config/supabaseClient';
import Link from 'next/link';
import TableChartTwoToneIcon from '@mui/icons-material/TableChartTwoTone';

const Sidebar = () => {
  const router = useRouter();
  const currentRoute = router.pathname;
  const [userExists, setUserExists] = useState(false);
  const [reRender, setRerender] = useState(false);

  const signOutHandler = async () => {
    const res = await supabase.auth.signOut();
    setRerender(!reRender)
    router.push("/")
  };

  useEffect(() => {
    let user = localStorage.getItem('sb-ziaxsvytbaahgjrompdd-auth-token');
    if (user == null) {
      setUserExists(false);
    } else {
      setUserExists(true);
    }
  }, [reRender]);

  return (
    <Box className={'relativeSidebarBox'}>
      <Box className={'SidebarMainBox'}>
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
            <ListItem component="div" className={'listItem'}>
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
            </ListItem>
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

        <Divider />
      </Box>
    </Box>
  );
};

export default Sidebar;
