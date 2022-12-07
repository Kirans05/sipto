import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import {
  ListSubheader,
  alpha,
  Box,
  List,
  styled,
  Button,
  ListItem
} from '@mui/material';
import NextLink from 'next/link';
import { SidebarContext } from 'src/contexts/SidebarContext';

import DesignServicesTwoToneIcon from '@mui/icons-material/DesignServicesTwoTone';
import BrightnessLowTwoToneIcon from '@mui/icons-material/BrightnessLowTwoTone';
import MmsTwoToneIcon from '@mui/icons-material/MmsTwoTone';
import TableChartTwoToneIcon from '@mui/icons-material/TableChartTwoTone';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import BallotTwoToneIcon from '@mui/icons-material/BallotTwoTone';
import BeachAccessTwoToneIcon from '@mui/icons-material/BeachAccessTwoTone';
import EmojiEventsTwoToneIcon from '@mui/icons-material/EmojiEventsTwoTone';
import FilterVintageTwoToneIcon from '@mui/icons-material/FilterVintageTwoTone';
import HowToVoteTwoToneIcon from '@mui/icons-material/HowToVoteTwoTone';
import LocalPharmacyTwoToneIcon from '@mui/icons-material/LocalPharmacyTwoTone';
import RedeemTwoToneIcon from '@mui/icons-material/RedeemTwoTone';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import TrafficTwoToneIcon from '@mui/icons-material/TrafficTwoTone';
import CheckBoxTwoToneIcon from '@mui/icons-material/CheckBoxTwoTone';
import ChromeReaderModeTwoToneIcon from '@mui/icons-material/ChromeReaderModeTwoTone';
import WorkspacePremiumTwoToneIcon from '@mui/icons-material/WorkspacePremiumTwoTone';
import CameraFrontTwoToneIcon from '@mui/icons-material/CameraFrontTwoTone';
import DisplaySettingsTwoToneIcon from '@mui/icons-material/DisplaySettingsTwoTone';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import StoreIcon from '@mui/icons-material/Store';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
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

const MenuWrapper = styled(Box)(
  ({ theme }) => `
  .MuiList-root {
    padding: ${theme.spacing(1)};

    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
    }
  }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(12)};
      color: ${theme.colors.alpha.trueWhite[50]};
      padding: ${theme.spacing(0, 2.5)};
      line-height: 1.4;
    }
`
);

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {

      .MuiListItem-root {
        padding: 1px 0;

        .MuiBadge-root {
          position: absolute;
          right: ${theme.spacing(3.2)};

          .MuiBadge-standard {
            background: ${theme.colors.primary.main};
            font-size: ${theme.typography.pxToRem(10)};
            font-weight: bold;
            text-transform: uppercase;
            color: ${theme.palette.primary.contrastText};
          }
        }
    
        .MuiButton-root {
          display: flex;
          color: ${theme.colors.alpha.trueWhite[70]};
          background-color: transparent;
          width: 100%;
          justify-content: flex-start;
          padding: ${theme.spacing(1.2, 3)};

          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(['color'])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            color: ${theme.colors.alpha.trueWhite[30]};
            font-size: ${theme.typography.pxToRem(20)};
            margin-right: ${theme.spacing(1)};
          }
          
          .MuiButton-endIcon {
            color: ${theme.colors.alpha.trueWhite[50]};
            margin-left: auto;
            opacity: .8;
            font-size: ${theme.typography.pxToRem(20)};
          }

          &.active,
          &:hover {
            background-color: ${alpha(theme.colors.alpha.trueWhite[100], 0.06)};
            color: ${theme.colors.alpha.trueWhite[100]};

            .MuiButton-startIcon,
            .MuiButton-endIcon {
              color: ${theme.colors.alpha.trueWhite[100]};
            }
          }
        }

        &.Mui-children {
          flex-direction: column;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(7)};
          }
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 1px 0;

            .MuiButton-root {
              padding: ${theme.spacing(0.8, 3)};

              .MuiBadge-root {
                right: ${theme.spacing(3.2)};
              }

              &:before {
                content: ' ';
                background: ${theme.colors.alpha.trueWhite[100]};
                opacity: 0;
                transition: ${theme.transitions.create([
                  'transform',
                  'opacity'
                ])};
                width: 6px;
                height: 6px;
                transform: scale(0);
                transform-origin: center;
                border-radius: 20px;
                margin-right: ${theme.spacing(1.8)};
              }

              &.active,
              &:hover {
                &:before {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }
`
);

function SidebarMenu() {
  const [rerender, setRerender] = useState(true)
  const { closeSidebar } = useContext(SidebarContext);
  const router = useRouter();
  const currentRoute = router.pathname;
  const [userExists, setUserExists] = useState( false);

  const signOutHandler = async () => {
    const res = await supabase.auth.signOut();
    setRerender(!rerender)
  };

  useEffect(() => {
    let user = localStorage.getItem("sb-ziaxsvytbaahgjrompdd-auth-token");
    if (user == null) {
      setUserExists(false)
    } else {
      setUserExists(true);
    }
  },[rerender])

  return (
    <>
      <MenuWrapper>
        <SubMenuWrapper>
          <List component="div">
              <ListItem component="div">
                <Link href="/LoginPage">
                  <Button
                    className={currentRoute === '/LoginPage' ? 'active' : ''}
                    disableRipple
                    // onClick={() => router.push("LoginPage")}
                    startIcon={<LoginIcon />}
                    sx={{ display: userExists == false ? 'flex' : 'none' }}
                  >
                    Login
                  </Button>
                </Link>
              </ListItem>
              <ListItem component="div">
                <Link href="/SignUpPage">
                  <Button
                    className={currentRoute === '/SignUpPage' ? 'active' : ''}
                    disableRipple
                    // onClick={() => router.push("SignUpPage")}
                    startIcon={<HowToRegIcon />}
                    sx={{ display: userExists == false ? 'flex' : 'none' }}
                  >
                    Sign Up
                  </Button>
                </Link>
              </ListItem>
            </List>
            <List component="div">
              <ListItem component="div">
                <Link href="/dashboards/tasks">
                  <Button
                    className={
                      currentRoute === '/dashboards/tasks' ? 'active' : ''
                    }
                    disableRipple
                    // onClick={() => router.push("/dashboards/tasks")}
                    startIcon={<DashboardCustomizeIcon />}
                    sx={{ display: userExists == true ? 'flex' : 'none' }}
                  >
                    Dashboard
                  </Button>
                </Link>
              </ListItem>
              <ListItem component="div">
                <Link href="/PortfolioPage">
                  <Button
                    className={
                      currentRoute === '/PortfolioPage' ? 'active' : ''
                    }
                    disableRipple
                    // onClick={() => router.push("PortfolioPage")}
                    startIcon={<SavingsIcon />}
                    sx={{ display: userExists == true ? 'flex' : 'none' }}
                  >
                    Portfolio
                  </Button>
                </Link>
              </ListItem>
              <ListItem component="div">
                <Link href="/FundPage">
                  <Button
                    className={currentRoute === '/FundPage' ? 'active' : ''}
                    disableRipple
                    // onClick={() => router.push("FundPage")}
                    startIcon={<AddCircleOutlineIcon />}
                    sx={{ display: userExists == true ? 'flex' : 'none' }}
                  >
                    Add Fund
                  </Button>
                </Link>
              </ListItem>
              <ListItem component="div">
                <Link href="/WithDrawPage">
                  <Button
                    className={currentRoute === '/WithDrawPage' ? 'active' : ''}
                    disableRipple
                    // onClick={() => router.push("WithDrawPage")}
                    startIcon={<RemoveCircleOutlineIcon />}
                    sx={{ display: userExists == true ? 'flex' : 'none' }}
                  >
                    WithDraw
                  </Button>
                </Link>
              </ListItem>
              <ListItem component="div">
                <Link href="/management/transactions">
                  <Button
                    className={
                      currentRoute === '/management/transactions'
                        ? 'active'
                        : ''
                    }
                    disableRipple
                    // onClick={() => router.push("management/transactions")}
                    startIcon={<TableChartTwoToneIcon />}
                    sx={{ display: userExists == true ? 'flex' : 'none' }}
                  >
                    Transactions
                  </Button>
                </Link>
              </ListItem>
              <ListItem component="div">
                <Link href="/AssetsPage">
                  <Button
                    className={currentRoute === '/AssetsPage' ? 'active' : ''}
                    disableRipple
                    // onClick={() => router.push("AssetsPage")}
                    startIcon={<StoreIcon />}
                    sx={{ display: userExists == true ? 'flex' : 'none' }}
                  >
                    Show Assets
                  </Button>
                </Link>
              </ListItem>
              <ListItem component="div">
                <Link href="/Basket">
                  <Button
                    className={currentRoute === '/Basket' ? 'active' : ''}
                    disableRipple
                    // onClick={() => router.push("Basket")}
                    startIcon={<ShoppingBasketIcon />}
                  >
                    Basket
                  </Button>
                </Link>
              </ListItem>
              <ListItem component="div">
                <Link href="/">
                <Button
                  disableRipple
                  startIcon={<LogoutIcon />}
                  sx={{ display: userExists == true ? 'flex' : 'none' }}
                  onClick={() => signOutHandler()}
                >
                  Sign Out
                </Button>
                </Link>
              </ListItem>
            </List>
          
        </SubMenuWrapper>
      </MenuWrapper>
    </>
  );
}

export default SidebarMenu;
