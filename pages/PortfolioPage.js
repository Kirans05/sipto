import Head from "next/head"
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import Styles from '../Styles/PortfolioPage.module.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import supabase from '../src/Config/supabaseClient';
import PortfolioCard from '../src/components/PortfolioCard/PortfolioCard';
import { useRouter } from 'next/router';
import SidebarLayout from 'src/layouts/SidebarLayout';
import Header from '../Component/Header/Header';
import Sidebar from '../Component/Siderbar/Sidebar';

const Portfolio = () => {
  const router = useRouter();
  const [positionsArr, setpositionsArr] = useState([]);

  const fetchPositions = async (userId) => {
    try {
      let positionsResponse = await supabase
        .from('coins_table')
        .select('*')
        .eq('id', userId);

      console.log(positionsResponse);
      setpositionsArr(positionsResponse.data);
    } catch (err) {}
  };

  useEffect(() => {
    let { user } = JSON.parse(
      localStorage.getItem('sb-ziaxsvytbaahgjrompdd-auth-token')
    );
    fetchPositions(user.id);
  }, []);

  return (
    <>
    <Head>
      <title>Portfolio</title>
    </Head>
    <Box className={Styles.simpleMainBox}>
      <Sidebar />
      <Box className={Styles.headerAndMainCompo}>
        <Header />
        <Box className={Styles.portfolioMainBox}>
      {positionsArr.map((item, index) => {
        return (
          <PortfolioCard
            key={index}
            Styles={Styles}
            item={item}
            index={index}
          />
        );
      })}
    </Box>
      </Box>
    </Box>
    </>
  );
};

// Portfolio.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Portfolio;
