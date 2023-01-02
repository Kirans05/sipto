import Head from 'next/head';
import {
  Box,
  Button,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
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
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ClearIcon from '@mui/icons-material/Clear';
import MuiAlert from '@mui/material/Alert';

const Portfolio = () => {
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const router = useRouter();
  const [positionsArr, setpositionsArr] = useState([]);
  const [optionSelected, setOptionSelected] = useState('No Option');
  const [itemSelected, setItemSelected] = useState('');
  const [currencyQty, setCurrencyQty] = useState(0);
  const [butQty, setBuyQty] = useState(1);
  const [userId, setUserId] = useState('');
  const [userDeatils, setUserDetails] = useState('');
  const [reRender, setRerender] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [snackBarColor, setSnackBarColor] = useState('success');

  const handleSnackBarClick = () => {
    setSnackBarOpen(true);
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackBarOpen(false);
  };

  const fetchCurrentUserDetails = async (user) => {
    try {
      let response = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // console.log(response)
      setUserDetails(response.data);
      localStorage.setItem('userData', JSON.stringify(response.data));
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPositions = async (userId) => {
    try {
      let positionsResponse = await supabase
        .from('coins_table')
        .select('*')
        .order('coins_table_id', { ascending: false })
        .eq('id', userId);

      setpositionsArr(positionsResponse.data);
    } catch (err) {}
  };

  const optionClicked = (option, item) => {
    setOptionSelected(option);
    setItemSelected(item);
    setCurrencyQty(parseInt(item.units_purchase));
  };

  const sellChangeHandler = (e) => {
    if (e.target.value <= 0 || e.target.value > itemSelected.units_purchase) {
    } else {
      setCurrencyQty(e.target.value);
    }
  };

  const buyChangeHandler = (e) => {
    if (e.target.value <= 0) {
    } else {
      setBuyQty(e.target.value);
    }
  };

  const sellCoinHandler = async () => {
    if(itemSelected.units_purchase <= 0){
      handleSnackBarClick();
      setSnackBarColor("warning");
      setSnackBarMsg("You have 0 Quantity to sell");
      setOptionSelected('No Option')
      return
    }
    try {
      console.log("first")
      let creditedAmount;
      let updatedResponse;
      if (itemSelected.units_purchase == currencyQty) {
        updatedResponse = await supabase
          .from('coins_table')
          .update({ units_purchase: 0, current_status: 'sold' })
          .eq('coins_table_id', itemSelected.coins_table_id);
        creditedAmount =
          itemSelected.units_purchase * itemSelected.price_purchased;
      } else {
        updatedResponse = await supabase
          .from('coins_table')
          .update({ units_purchase: itemSelected.units_purchase - currencyQty })
          .eq('coins_table_id', itemSelected.coins_table_id);
        creditedAmount = currencyQty * itemSelected.price_purchased;
      }
      if (updatedResponse.error) {
        handleSnackBarClick();
        setSnackBarColor('warning');
        setSnackBarMsg('Something went wrong');
      }

      if (updatedResponse.status == 204) {
        let fundResponse = await supabase.rpc('update_wallet_balance', {
          amount: creditedAmount
        });

        if (fundResponse.error) {
          handleSnackBarClick();
          setSnackBarColor('warning');
          setSnackBarMsg('Something went wrong');
        }

        if (fundResponse.status == 200) {
          let transactionResponse = await supabase.rpc(
            'update_transaction_details',
            {
              amount: creditedAmount,
              sender: 'null',
              receiver: 'null',
              message: `${itemSelected.coinid} sell`,
              id: userId,
              type: 'credit'
            }
          );

          handleSnackBarClick();
          setSnackBarColor('success');
          setSnackBarMsg('Successfully Coin Sold');
          setRerender(!reRender);
          setOptionSelected('No Option')
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const buyCoinHandler = async () => {
    if (itemSelected.price_purchased * butQty > userDeatils.wallet_balance) {
      handleSnackBarClick();
      setSnackBarColor("warning");
      setSnackBarMsg("Insuffiecient Walet Balance");
      setOptionSelected('No Option')
      return;
    }
    try {
      let updatedResponse;
      let debitAmout;
      updatedResponse = await supabase
        .from('coins_table')
        .update({
          units_purchase:
            parseInt(itemSelected.units_purchase) + parseInt(butQty)
        })
        .eq('coins_table_id', itemSelected.coins_table_id);
      debitAmout = itemSelected.price_purchased * butQty;
      console.log(updatedResponse);
      if (updatedResponse.error) {
        handleSnackBarClick();
        setSnackBarColor('warning');
        setSnackBarMsg('Something went wrong');
      }

      if (updatedResponse.status == 204) {
        let withdrawResponse = await supabase.rpc('decrement_balance', {
          amount: itemSelected.price_purchased * butQty
        });

        console.log(withdrawResponse);
        if (withdrawResponse.error) {
          handleSnackBarClick();
          setSnackBarColor('warning');
          setSnackBarMsg('Something went wrong');
        }

        if (withdrawResponse.status == 200) {
          let transactionResponse = await supabase.rpc(
            'update_transaction_details',
            {
              amount: debitAmout,
              sender: 'null',
              receiver: 'null',
              message: `${itemSelected.coinid} buy`,
              id: userId,
              type: 'debit'
            }
          );

          console.log(transactionResponse);
          handleSnackBarClick();
          setSnackBarColor('success');
          setSnackBarMsg('Successfully Purchased');
          setRerender(!reRender);
          setOptionSelected('No Option')
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    let { user } = JSON.parse(
      localStorage.getItem('sb-ziaxsvytbaahgjrompdd-auth-token')
    );
    let userData = JSON.parse(localStorage.getItem('userData'));
    setUserId(user.id);
    setUserDetails(userData);
  }, []);

  useEffect(() => {
    let { user } = JSON.parse(
      localStorage.getItem('sb-ziaxsvytbaahgjrompdd-auth-token')
    );
    fetchPositions(user.id);
    fetchCurrentUserDetails(user);
  }, [reRender]);

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
            <Box className={Styles.positionCardMainBox}>
              {positionsArr.map((item, index) => {
                if(item.units_purchase <= 0){
                  
                }else{
                return (
                  <PortfolioCard
                    key={index}
                    Styles={Styles}
                    item={item}
                    index={index}
                    optionClicked={optionClicked}
                  />
                );
                }
              })}
            </Box>
            <Box className={Styles.buySellOptionsBox}>
              {optionSelected == 'No Option' ? (
                <Box className={Styles.investmentNoOptions}>
                  <Typography sx={{ textAlign: 'center', alignSelf: 'center' }}>
                    Select a currency to view investing options
                  </Typography>
                  <Box className={Styles.walletBalance_AddMoney}>
                    <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccountBalanceWalletIcon /> &nbsp; Balance $
                      {userDeatils == '' ? null : userDeatils.wallet_balance}
                    </Typography>
                    <Typography
                      className={Styles.addmoneyButton}
                      onClick={() => router.push('/FundPage')}
                    >
                      + ADD MONEY
                    </Typography>
                  </Box>
                </Box>
              ) : optionSelected == 'buy' ? (
                <Box className={Styles.buyOptionBox}>
                  <Box className={Styles.titleBox}>
                    <Typography className={Styles.title}>
                      {itemSelected.coinid}
                    </Typography>
                    {/* large screen clear icon */}
                    <ClearIcon
                      sx={{ '&:hover': { cursor: 'pointer' } }}
                      onClick={() => setOptionSelected('No Option')}
                    />

                    {/* small screen clear icon */}
                    {/* <ClearIcon
                      sx={{display:{xs:"flex",md:"none"},color:"red"}}
                      onClick={() => setOptionSelected('No Option')}
                    /> */}
                  </Box>
                  <Box className={Styles.otherOption}>
                    <Typography
                      className={Styles.buySellButton}
                      onClick={() => setOptionSelected('buy')}
                    >
                      Buy
                    </Typography>
                    <Typography
                      className={Styles.buySellButton}
                      onClick={() => setOptionSelected('sell')}
                    >
                      Sell
                    </Typography>
                  </Box>
                  <Box className={Styles.input_buy_button}>
                    <Typography>
                      Price - ${itemSelected.price_purchased * butQty}
                    </Typography>
                    <TextField
                      type={'number'}
                      value={butQty}
                      onChange={buyChangeHandler}
                    />
                    <button
                      className={Styles.buyButton}
                      onClick={buyCoinHandler}
                    >
                      Buy
                    </button>
                  </Box>
                  <Box className={Styles.walletBalance_AddMoney}>
                    <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccountBalanceWalletIcon /> &nbsp; Balance $
                      {userDeatils == '' ? null : userDeatils.wallet_balance}
                    </Typography>
                    <Typography
                      className={Styles.addmoneyButton}
                      onClick={() => router.push('/FundPage')}
                    >
                      + ADD MONEY
                    </Typography>
                  </Box>
                </Box>
              ) : optionSelected == 'sell' ? (
                <Box className={Styles.sellOptionBox}>
                  <Box className={Styles.titleBox}>
                    <Typography className={Styles.title}>
                      {itemSelected.coinid}
                    </Typography>
                    <ClearIcon
                      sx={{ '&:hover': { cursor: 'pointer' } }}
                      onClick={() => setOptionSelected('No Option')}
                    />
                  </Box>
                  <Box className={Styles.otherOption}>
                    <Typography
                      className={Styles.buySellButton}
                      onClick={() => setOptionSelected('buy')}
                    >
                      Buy
                    </Typography>
                    <Typography
                      className={Styles.buySellButton}
                      onClick={() => setOptionSelected('sell')}
                    >
                      Sell
                    </Typography>
                  </Box>
                  <Box className={Styles.input_Sell_button}>
                    <Typography>
                      Price - ${itemSelected.price_purchased * currencyQty}
                    </Typography>
                    <TextField
                      type={'number'}
                      value={currencyQty}
                      onChange={sellChangeHandler}
                    />
                    <button
                      className={Styles.sellButton}
                      onClick={sellCoinHandler}
                    >
                      Sell
                    </button>
                  </Box>
                  <Box className={Styles.walletBalance_AddMoney}>
                    <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccountBalanceWalletIcon /> &nbsp; Balance $
                      {userDeatils == '' ? null : userDeatils.wallet_balance}
                    </Typography>
                    <Typography
                      className={Styles.addmoneyButton}
                      onClick={() => router.push('/FundPage')}
                    >
                      + ADD MONEY
                    </Typography>
                  </Box>
                </Box>
              ) : null}
            </Box>
          </Box>
        </Box>
        <Snackbar
          open={snackBarOpen}
          autoHideDuration={6000}
          onClose={handleSnackBarClose}
        >
          <Alert
            onClose={handleSnackBarClose}
            severity={snackBarColor}
            sx={{ width: '100%' }}
          >
            {snackBarMsg}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

// Portfolio.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Portfolio;
