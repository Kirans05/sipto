import Head from 'next/head';
import SidebarLayout from 'src/layouts/SidebarLayout';
import { useEffect, useState } from 'react';
import PageHeader from 'src/content/Dashboards/Tasks/PageHeader';
import Footer from 'src/components/Footer';
import {
  Grid,
  Tab,
  Tabs,
  Divider,
  Container,
  Card,
  Box,
  useTheme,
  styled,
  Typography,
  Alert,
  Skeleton
} from '@mui/material';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import TeamOverview from 'src/content/Dashboards/Tasks/TeamOverview';
import TasksAnalytics from 'src/content/Dashboards/Tasks/TasksAnalytics';
import Performance from 'src/content/Dashboards/Tasks/Performance';
import Projects from 'src/content/Dashboards/Tasks/Projects';
import Checklist from 'src/content/Dashboards/Tasks/Checklist';
import Profile from 'src/content/Dashboards/Tasks/Profile';
import TaskSearch from 'src/content/Dashboards/Tasks/TaskSearch';
import Styles from '../../../Styles/Dashboard.module.css';
import supabase from '../../../src/Config/supabaseClient';
import axios from 'axios';
import Header from '../../../Component/Header/Header';
import Sidebar from '../../../Component/Siderbar/Sidebar';
import Link from 'next/link';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import EjectIcon from '@mui/icons-material/Eject';
import TrendingBasketCard from '../../../src/components/TrendingBasketCard/TrendingBasketCard';
import TopGainersCard from '../../../src/components/TopGainersCard/TopGainersCard';
import HighestReturnCard from '../../../src/components/HighestReturnCard/HighestReturnCard';
import { useRouter } from 'next/router';
import {useDispatch, useSelector} from "react-redux"
import {addUserData} from "../../../Store/UserSlice"

const TabsContainerWrapper = styled(Box)(
  ({ theme }) => `
      padding: 0 ${theme.spacing(2)};
      position: relative;
      bottom: -1px;

      .MuiTabs-root {
        height: 44px;
        min-height: 44px;
      }

      .MuiTabs-scrollableX {
        overflow-x: auto !important;
      }

      .MuiTabs-indicator {
          min-height: 4px;
          height: 4px;
          box-shadow: none;
          bottom: -4px;
          background: none;
          border: 0;

          &:after {
            position: absolute;
            left: 50%;
            width: 28px;
            content: ' ';
            margin-left: -14px;
            background: ${theme.colors.primary.main};
            border-radius: inherit;
            height: 100%;
          }
      }

      .MuiTab-root {
          &.MuiButtonBase-root {
              height: 44px;
              min-height: 44px;
              background: ${theme.colors.alpha.white[50]};
              border: 1px solid ${theme.colors.alpha.black[10]};
              border-bottom: 0;
              position: relative;
              margin-right: ${theme.spacing(1)};
              font-size: ${theme.typography.pxToRem(14)};
              color: ${theme.colors.alpha.black[80]};
              border-bottom-left-radius: 0;
              border-bottom-right-radius: 0;

              .MuiTouchRipple-root {
                opacity: .1;
              }

              &:after {
                position: absolute;
                left: 0;
                right: 0;
                width: 100%;
                bottom: 0;
                height: 1px;
                content: '';
                background: ${theme.colors.alpha.black[10]};
              }

              &:hover {
                color: ${theme.colors.alpha.black[100]};
              }
          }

          &.Mui-selected {
              color: ${theme.colors.alpha.black[100]};
              background: ${theme.colors.alpha.white[100]};
              border-bottom-color: ${theme.colors.alpha.white[100]};

              &:after {
                height: 0;
              }
          }
      }
  `
);

function DashboardTasks() {

  const dispatch = useDispatch()
  const userState = useSelector((state) => state.userDataSlice)
  const router = useRouter()
  const [userDetails, setUserDetails] = useState('');
  const [rerender, setRerender] = useState(true);
  const [basketData, setBasketData] = useState([]);

  const fetchUserDetails = async (user) => {
    let response = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    let { data } = response;
    console.log(data)
    if(data.first_name == ""){
      localStorage.setItem('userData', JSON.stringify(data));
      router.push("/Profile")
    }
    setUserDetails(data);
    dispatch(addUserData(data))
  };

  const kycVerification = async () => {
    let getDetails = {
      url: 'https://637cac1f16c1b892ebbb6fe6.mockapi.io/userData',
      method: 'GET'
    };
    let response = await axios(getDetails);
    let { data } = response;
    let filterItem = data.filter((item) => item.userKycId == userDetails.id);
    if (filterItem.length == 0) {
      let postDetails = {
        url: 'https://637cac1f16c1b892ebbb6fe6.mockapi.io/userData',
        method: 'POST',
        data: {
          userKycId: userDetails.id
        }
      };
      let postResponse = await axios(postDetails);
      if (postResponse.statusText == 'Created') {
        let supabaseResponse = await supabase
          .from('profiles')
          .update([{ kyc_verified: true }])
          .eq('id', userDetails.id);
        if (supabaseResponse.status == 204) {
          setRerender(!rerender);
        }
      }
    }
  };

  const fetchAllBaskets = async () => {
    try {
      let resp = await supabase.from('bakset_Table').select('*');
      if (resp.error) {
        return;
      }

      if (resp.data) {
        setBasketData(resp.data);
      }
    } catch (err) {}
  };

  

  useEffect(() => {
    const { user } = JSON.parse(
      localStorage.getItem('sb-ziaxsvytbaahgjrompdd-auth-token')
    );
    fetchUserDetails(user);
    fetchAllBaskets();
  }, [rerender]);

  return (
    <>
      <Head>
        <title>Tasks Dashboard</title>
      </Head>
      <Box className={Styles.simpleMainBox}>
        <Sidebar />
        <Box className={Styles.headerAndMainCompo}>
          <Header />
          {userDetails == '' ? null : (
            <Alert
              severity="warning"
              sx={{
                display: userDetails.kyc_verified == false ? 'flex' : 'none'
              }}
              onClick={kycVerification}
              className={Styles.alertMessage}
            >
              KYC not verified &nbsp;{' '}
              <span className={Styles.kycVerificationButton}>Verify Now!</span>
            </Alert>
          )}
          {userDetails == '' ? (
            <Box className={Styles.skeletonBox}>
              <Box className={Styles.firstSkeletonBox}>
                {

                  [1,2].map((item, index) => {
                    return <Skeleton
                              key={index}
                              variant="rectangular"
                              className={Styles.walletSkeleton}
                              />
                  })
                }
              </Box>
              <Box className={Styles.secondSkeletonBox}>
                  <Skeleton
                variant="rectangular"
                className={Styles.chartSkeleton}
                />
                  <Skeleton
                variant="rectangular"
                className={Styles.chartSkeleton}
                />
              </Box>
            </Box>
          ) : (
            <Box className={Styles.dashboardMainBox}>
              <Box className={Styles.portfolioBox}>
                <Typography className={Styles.portfolioTitle}>
                  Your PortFolio
                </Typography>
                <Typography className={Styles.portfolioAmount}>
                  $ {userDetails.wallet_balance}
                </Typography>
                <Link href="/PortfolioPage">
                  <button className={Styles.portfolionBtn}>
                    View Portfolio
                  </button>
                </Link>
                <Box className={Styles.portfolioBackgroundCircle1}></Box>
                <Box className={Styles.portfolioBackgroundCircle2}></Box>
              </Box>
              <Box className={Styles.totalOrderBox}>
                <Typography className={Styles.fundTitle}>
                  Funds Available
                </Typography>
                <Typography className={Styles.fundAmount}>
                  $ {userDetails.wallet_balance}
                </Typography>
                <Box className={Styles.fund_withdrawBtn}>
                  <Link href="/FundPage">
                    <button className={Styles.addFundBtn}>Add Fund</button>
                  </Link>
                  <Link href="/WithDrawPage">
                    <button className={Styles.withdrawBtn}>Withdraw</button>
                  </Link>
                </Box>
                <Box className={Styles.totalOrderBackgroundCircle1}></Box>
                <Box className={Styles.totalOrderBackgroundCircle2}></Box>
              </Box>
              <Box className={Styles.TasksAnalytics}>
                <TasksAnalytics />
              </Box>
              <Box className={Styles.DashboardWelcomeCard}>
                <Box className={Styles.DashboardWelcomeCardFirstPart}>
                  <Typography className={Styles.typographyTitle}>
                    Welcome <span className={Styles.userName}>User</span>
                  </Typography>
                  <Typography
                    className={Styles.yourInvestment}
                    sx={{ fontWeight: '800' }}
                  >
                    Your Investment
                  </Typography>
                </Box>
                <Box className={Styles.DashboardWelcomeCardSecondPart}>
                  <Typography className={Styles.typographyTitle}>
                    Basket
                  </Typography>
                  <Typography
                    className={Styles.typographyTitle}
                    sx={{ fontWeight: '800' }}
                  >
                    0
                  </Typography>
                </Box>
                <Box className={Styles.DashboardWelcomeCardThirdPart}>
                  <Typography className={Styles.typographyTitle}>
                    Current Value
                  </Typography>
                  <Typography
                    className={Styles.typographyTitle}
                    sx={{ color: 'rgb(175,49,67)', fontWeight: '800' }}
                  >
                    $ 0.00
                  </Typography>
                </Box>
                <Box className={Styles.DashboardWelcomeCardFourthPart}>
                  <Typography className={Styles.typographyTitle}>
                    Invested Value
                  </Typography>
                  <Typography
                    className={Styles.typographyTitle}
                    sx={{ fontWeight: '800' }}
                  >
                    $ 0.00
                  </Typography>
                </Box>
              </Box>

              <Box className={Styles.trendingBasketBox}>
                <Box sx={{display:"flex", justifyContent:"space-between"}}>
                  <Typography className={Styles.trendingBasketTitle}>
                    New Baskets
                  </Typography>
                  <Link href={"/Explore"}>
                    <button className={Styles.viewMoreButton}>View More</button>
                  </Link>
                </Box>
                <Box className={Styles.trendingBasketCard}>
                  {basketData.length == 0
                    ? null
                    : basketData.map((item, index) => {
                        if (
                          item.name == 'BNB Chain Ecosystem Basket' ||
                          item.name == 'Blue-Chip Crypto Basket'
                        ) {
                          return (
                            <TrendingBasketCard
                              key={index}
                              Styles={Styles}
                              item={item}
                            />
                          );
                        }
                      })}
                </Box>
              </Box>
              <Box className={Styles.trendingBasketBox}>
              <Box sx={{display:"flex", justifyContent:"space-between"}}>
                  <Typography className={Styles.trendingBasketTitle}>
                    Trending Baskets
                  </Typography>
                  <Link href={"/Explore"}>
                    <button className={Styles.viewMoreButton}>View More</button>
                  </Link>
                </Box>
                <Box className={Styles.trendingBasketCard}>
                  {basketData.length == 0
                    ? null
                    : basketData.map((item, index) => {
                        if (
                          item.name == 'All Crypto Basket' ||
                          item.name == 'DeFi Basket'
                        ) {
                          return (
                            <TrendingBasketCard
                              key={index}
                              Styles={Styles}
                              item={item}
                            />
                          );
                        }
                      })}
                </Box>
              </Box>
              <Box className={Styles.TopGainersBox}>
                <Box sx={{display:"flex", justifyContent:"space-between"}}>
                  <Typography className={Styles.topGainersTitle}>
                  Top Gainers
                  </Typography>
                  <Link href={"/Explore"}>
                    <button className={Styles.viewMoreButton}>View More</button>
                  </Link>
                </Box>
                <Box className={Styles.topGainersBox_info}>
                  {basketData.length == 0
                    ? null
                    : basketData.map((item, index) => {
                        if (
                          item.name == 'Blue-Chip Crypto Basket' ||
                          item.name == 'All Crypto Basket' ||
                          item.name == 'NFT Basket' ||
                          item.name == 'BNB Chain Ecosystem Basket'
                        ) {
                          return (
                            <TopGainersCard
                              key={index}
                              Styles={Styles}
                              item={item}
                            />
                          );
                        }
                      })}
                </Box>
              </Box>
              <Box className={Styles.highestReturnBox}>
                <Box sx={{display:"flex", justifyContent:"space-between"}}>
                  <Typography className={Styles.highestReturnTitle}>
                  Highest Return (APY)
                  </Typography>
                  <Link href={"/Explore"}>
                    <button className={Styles.viewMoreButton}>View More</button>
                  </Link>
                </Box>
                <Box className={Styles.highestReturnBox_info}>
                  {basketData.length == 0
                    ? null
                    : basketData.map((item, index) => {
                        if (
                          item.name == 'Metaverse Basket' ||
                          item.name == 'NFT Basket' ||
                          item.name == 'All Crypto Basket' ||
                          item.name == 'DeFi Basket'
                        ) {
                          return (
                            <HighestReturnCard
                              key={index}
                              Styles={Styles}
                              item={item}
                            />
                          );
                        }
                      })}
                  {[1, 2, 3, 4].map((item) => {
                    return;
                  })}
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}

// DashboardTasks.getLayout = (page) => <SidebarLayout userExist={true}>{page}</SidebarLayout>;

export default DashboardTasks;
