import Head from 'next/head';
import SidebarLayout from 'src/layouts/SidebarLayout';
import PageHeader from 'src/content/Management/Transactions/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container, Box } from '@mui/material';
import Footer from 'src/components/Footer';
import Header from '../../../Component/Header/Header';
import Sidebar from '../../../Component/Siderbar/Sidebar';
import Styles from "../../../Styles/Transaction.module.css"

import RecentOrders from 'src/content/Management/Transactions/RecentOrders';

function ApplicationsTransactions() {
  return (
    <>
      <Head>
        <title>Transactions - Applications</title>
      </Head>
      <Box className={Styles.simpleMainBox}>
      <Sidebar />
      <Box className={Styles.headerAndMainCompo}>
        <Header />
        <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <RecentOrders />
          </Grid>
        </Grid>
      </Container>
      </Box>
    </Box>
      
    </>
  );
}

// ApplicationsTransactions.getLayout = (page) => (
//   <SidebarLayout>{page}</SidebarLayout>
// );

export default ApplicationsTransactions;
