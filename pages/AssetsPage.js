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
import supabase from "../src/Config/supabaseClient"
import {useDispatch, useSelector} from "react-redux"
import {addAssestsData} from "../Store/AssestsSlice"


const AssetsPage = () => {

  const dispatch = useDispatch()
  const {coinData} = useSelector((state) => state.assestsDataSlice)
  let fetchCryptoCoins = async () => {
    try{
      let assestsResponse = await supabase
          .from("assests_table")
          .select("*")
          // .limit(10)
          .order('assest_table_id', { ascending: true })
      
      if(assestsResponse.err){

      }


      if(assestsResponse.status == 200){
        dispatch(addAssestsData(assestsResponse.data))
      }
    }catch(err){
      console.log(err)
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
          {/* <button onClick={fetchId}>fetchId</button> */}
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
