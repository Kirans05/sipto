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
  );
};

Portfolio.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Portfolio;
