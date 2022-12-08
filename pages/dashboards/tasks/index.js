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
  const [userDetails, setUserDetails] = useState('');
  const [rerender, setRerender] = useState(true);

  const fetchUserDetails = async (user) => {
    let response = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    let { data } = response;
    localStorage.setItem('userData', JSON.stringify(data));
    setUserDetails(data);
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

  useEffect(() => {
    const { user } = JSON.parse(
      localStorage.getItem('sb-ziaxsvytbaahgjrompdd-auth-token')
    );
    fetchUserDetails(user);
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
            <Skeleton
              variant="rectangular"
              width={400}
              height={120}
              style={{ borderRadius: '20px', marginLeft: '4%' }}
            />
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
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}

// DashboardTasks.getLayout = (page) => <SidebarLayout userExist={true}>{page}</SidebarLayout>;

export default DashboardTasks;
