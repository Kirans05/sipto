import { useTheme } from '@emotion/react';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Skeleton,
  styled,
  TextField,
  Typography
} from '@mui/material';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import SidebarLayout from 'src/layouts/SidebarLayout';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import KeyIcon from '@mui/icons-material/Key';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Styles from "../Styles/AssetsPAge.module.css"
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MessageIcon from '@mui/icons-material/Message';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CoinCard from "../src/components/CoinCard/CoinCard"
import Header from '../Component/Header/Header';
import Sidebar from '../Component/Siderbar/Sidebar';

const AssetsPage = () => {

  const [coinData, setCoinData] = useState([])
  
  let fetchCryptoCoins = async () => {
    try{
      let cryptoCoinsResponse = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=7")

      let data = await cryptoCoinsResponse.json()
      setCoinData(data)
    }catch(err){

    }
  }

  useEffect(() => {
    fetchCryptoCoins()
  },[])

  return (
    <>
      <Head>
        <title>AssetsPage</title>
      </Head>
      <Box className={Styles.simpleMainBox}>
      <Sidebar />
      <Box className={Styles.headerAndMainCompo}>
        <Header />
        <Box className={Styles.AssetsPageBox}>
        {coinData.length == 0 ? (
          <Box className={Styles.coinPageSkeleton}>
            <Skeleton variant="rounded" className={Styles.assestsSkeleton} />
            <Skeleton variant="rounded" className={Styles.assestsSkeleton} />
            <Skeleton variant="rounded" className={Styles.assestsSkeleton} />
            <Skeleton variant="rounded" className={Styles.assestsSkeleton} />
            <Skeleton variant="rounded" className={Styles.assestsSkeleton} />
            <Skeleton variant="rounded" className={Styles.assestsSkeleton} />
            <Skeleton variant="rounded" className={Styles.assestsSkeleton} />
            <Skeleton variant="rounded" className={Styles.assestsSkeleton} />
            <Skeleton variant="rounded" className={Styles.assestsSkeleton} />
            <Skeleton variant="rounded" className={Styles.assestsSkeleton} />
          </Box>
        ) : (
          <Box className={Styles.coinCardBox}>
            {
              coinData.map((item, index) => {
                return (
                  <CoinCard key={index} Styles={Styles} item={item} index={index} />
                  );
                })
              }
          </Box>
        )}
      </Box>
      </Box>
    </Box>
      

    </>
  );
};

// AssetsPage.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default AssetsPage;
