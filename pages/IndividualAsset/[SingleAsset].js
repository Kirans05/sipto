import { useTheme } from '@emotion/react';
import {
  Alert,
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Modal,
  OutlinedInput,
  Skeleton,
  Snackbar,
  styled,
  TextField,
  Typography
} from '@mui/material';
import Head from 'next/head';
import React, { useEffect, useRef, useState } from 'react';
import SidebarLayout from 'src/layouts/SidebarLayout';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import KeyIcon from '@mui/icons-material/Key';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Styles from '../../Styles/SingleAsset.module.css';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MessageIcon from '@mui/icons-material/Message';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import { useRouter } from 'next/router';
import axios from 'axios';
import supabase from '../../src/Config/supabaseClient';
import MuiAlert from "@mui/material/Alert";
import Header from '../../Component/Header/Header';
import Sidebar from '../../Component/Siderbar/Sidebar';




const AssetsPage = () => {

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const coinId = useRouter().query.SingleAsset;
  const [coinData, setCoinData] = useState([]);
  const [userDetails, setUserDetails] = useState("");
  const [coinDetails, setCoinDetails] = useState('');
  const options = { style: 'currency', currency: 'USD' };
  const numberFormat = new Intl.NumberFormat('en-US', options);
  const [NoOfDays, setNoOfDays] = useState(1);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [modalOpen, setModalOpen] = useState(false);
  const [unitValue, setUnitValue] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [snackBarColor, setSnackBarColor] = useState('success');

  const fetchChartDetails = async () => {
    let response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${NoOfDays}`
    );

    let data = await response.json();
    setChartOptions({
      series: {
        data: data.prices
      }
    });
  };

  const fetchdata = async () => {
    let response = await axios(
      `https://api.coingecko.com/api/v3/coins/${coinId}?tickers=true&market_data=true&community_data=false&developer_data=false`
    );
    console.log(response.data);
    setCoinDetails(response.data);
  };

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const chartRef = useRef();
  const [chartOptions, setChartOptions] = useState({
    xAxis: {
      type: 'logarithmic',
      crosshair: {
        color: '#4E7DD9',
        dashStyle: 'Dash'
      },
      ordinal: false,
      minRange: 1,
      labels: {
        formatter: function () {
          return new Date(this.value).toString().slice(4, 10);
        }
      }
    },
    yAxis: {
      opposite: true,
      labels: {
        formatter: function () {
          return numberFormat.format(this.value);
        }
      },
      gridLineDashStyle: 'Dash',
      gridLineColor: '#01052D40',
      gridLineWidth: 0.5
      // min: yAxisMin,
    },
    series: [
      {
        type: 'spline',
        // type: 'areaspline',
        name: 'Price',
        data: null,
        lineWidth: 2,
        lineColor: '#4E7DD9',
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [
            [0, 'rgba(78, 125, 217, 0.4)'],
            [1, 'rgba(78, 125, 217, 0.05)']
          ]
        },
        marker: {
          fillColor: 'white',
          lineWidth: 2,
          radius: 3,
          lineColor: '#4E7DD9'
        },
        animation: {
          duration: 1500
        }
      }
    ],
    chart: {
      backgroundColor: 'transparent'
      // zoomType: "x",
    },
    navigation: {
      enabled: false,
      buttonOptions: {
        enabled: false
      }
    },
    rangeSelector: { enabled: false },
    credits: { enabled: false },
    tooltip: {
      animation: true,
      // xDateFormat: "",
      useHTML: true,
      backgroundColor: 'rgba(255, 255, 255)',
      borderWidth: 1,
      borderRadius: 15,
      borderColor: '#B0C4DB',
      shadow: {
        offsetX: 1,
        offsetY: 2,
        width: 2,
        opacity: 0.05
      },
      shape: 'square',
      // split: true,
      hideDelay: 100,
      outside: false
    },
    navigator: {
      handles: {
        // lineWidth: 1,
        width: 20,
        height: 30
      },
      maskFill: 'rgba(78, 125, 217, 0.2)',
      outlineWidth: 0,
      enabled: false,
      xAxis: {}
    },
    scrollbar: {
      enabled: false
    }
  });

  const handleSnackBarClick = () => {
    setSnackBarOpen(true);
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackBarOpen(false);
  };

  const unitValueChange = (e) => {
    if (e.target.value <= 0) {
      return;
    }

    setUnitValue(e.target.value);
  };

  const investHandler = async (totalPrice) => {
    if (
      userDetails.wallet_balance < totalPrice ||
      userDetails.wallet_balance <= 0
    ) {
      handleSnackBarClick();
      setSnackBarColor("error");
      setSnackBarMsg("Not Enough Balance to Purchase");
      return;
    }

    try {
      let balanceResponse = await supabase.rpc("decrement_balance", {
        amount: Math.ceil(totalPrice),
      });
      if (balanceResponse.data == true) {
        try {
          let transactionResponse = await supabase.rpc(
            "update_transaction_details",
            {
              id: userDetails.id,
              amount: Math.ceil(totalPrice),
              sender: "kiran",
              receiver: coinId,
              message: `${coinId} purchase`,
              type: "debit",
            }
          );
          if (transactionResponse.data == true) {
            try {
              let coinTableResponse = await supabase.rpc("update_coins_table", {
                userid: userDetails.id,
                coin_id: coinId,
                purchase_price: Math.ceil(totalPrice),
                purchase_unit: unitValue,
              });
              if (coinTableResponse.data == true) {
                handleSnackBarClick();
                setSnackBarColor("success");
                setSnackBarMsg("Coin SuccessFully Purchased");
                handleModalClose();
                return;
              }
            } catch (err) {}
          }
        } catch (err) {}
      }
    } catch (err) {}
  };

  useEffect(() => {
    setUserDetails(JSON.parse(localStorage.getItem("userData")));
    fetchChartDetails();
    fetchdata();
  }, [NoOfDays]);

  return (
    <>
      <Head>
        <title>AssetsPage</title>
      </Head>
      <Box className={Styles.simpleMainBox}>
      <Sidebar />
      <Box className={Styles.headerAndMainCompo}>
        <Header />
        <Box className={Styles.SingleAssetDetailsMainPage}>
        <Typography className={Styles.coindId}>{coinId}</Typography>
        <Box className={Styles.buttonGroup}>
          <button
            onClick={() => setNoOfDays(1)}
            className={` ${
              NoOfDays == 1 ? Styles.buttonActie : Styles.individualButton
            }`}
          >
            1D
          </button>
          <button
            onClick={() => setNoOfDays(7)}
            className={` ${
              NoOfDays == 7 ? Styles.buttonActie : Styles.individualButton
            }`}
          >
            7D
          </button>
          <button
            onClick={() => setNoOfDays(14)}
            className={` ${
              NoOfDays == 14 ? Styles.buttonActie : Styles.individualButton
            }`}
          >
            14D
          </button>
          <button
            onClick={() => setNoOfDays(30)}
            className={` ${
              NoOfDays == 30 ? Styles.buttonActie : Styles.individualButton
            }`}
          >
            30D
          </button>
        </Box>
        <Box className={Styles.highChartReact}>
          <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
            constructorType="chart"
            ref={chartRef}
          />
        </Box>
        {coinDetails == '' ? null : (
          <Box className={Styles.coinInformation}>
            <Box className={Styles.coinImageAndName}>
              <Box
                component={'img'}
                src={coinDetails.image.large}
                className={Styles.coinImage}
              />
              <Typography className={Styles.coinName}>
                {coinDetails.name}
              </Typography>
            </Box>
            <Box className={Styles.coinDetailsAndDescriptions}>
              <Box className={Styles.coinDescriptionBox}>
                <Typography className={Styles.descriptionHeading}>
                  Description
                </Typography>
                <Typography className={Styles.coinDescription}>
                  {coinDetails.description.en}
                </Typography>
              </Box>
              <Box className={Styles.coinPricingdetailsBox}>
                <Typography className={Styles.coinDetailsTypography}>
                  Market cap rank - {coinDetails.market_cap_rank}
                </Typography>
                <Typography className={Styles.coinDetailsTypography}>
                  Current price - {coinDetails.market_data.current_price.usd}
                </Typography>
                <Typography className={Styles.coinDetailsTypography}>
                  Market Cap - {coinDetails.market_data.market_cap.usd}
                </Typography>
                <Typography className={Styles.coinDetailsTypography}>
                  Price Change in 24h -{' '}
                  {
                    coinDetails.market_data
                      .price_change_percentage_1h_in_currency.usd
                  }
                  %
                </Typography>
                <Typography className={Styles.coinDetailsTypography}>
                  Price Change in 1y -{' '}
                  {
                    coinDetails.market_data
                      .price_change_percentage_1y_in_currency.usd
                  }
                  %
                </Typography>
                <Typography className={Styles.coinDetailsTypography}>
                  Price Change in 7d -{' '}
                  {
                    coinDetails.market_data
                      .price_change_percentage_7d_in_currency.usd
                  }
                  %
                </Typography>
                <Typography className={Styles.coinDetailsTypography}>
                  Price Change in 14d -{' '}
                  {
                    coinDetails.market_data
                      .price_change_percentage_14d_in_currency.usd
                  }
                  %
                </Typography>
                <Typography className={Styles.coinDetailsTypography}>
                  Price Change in 30d -{' '}
                  {
                    coinDetails.market_data
                      .price_change_percentage_30d_in_currency.usd
                  }
                  %
                </Typography>
                <Typography className={Styles.coinDetailsTypography}>
                  Total Volume - {coinDetails.market_data.total_volume.usd}
                </Typography>
              </Box>
            </Box>
            <button
              // onClick={investHandler}
              onClick={handleModalOpen}
              className={Styles.investmentbutton}
            >
              Invest Now
            </button>
            <Modal
              open={modalOpen}
              onClose={handleModalClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className={Styles.modalBoxStyle}>
                <Typography className={Styles.modalHeading}>
                  Please Select The Number Of Units
                </Typography>
                <TextField
                  id="outlined-basic"
                  label="Units"
                  variant="outlined"
                  name="phoneNumber"
                  type={'number'}
                  onChange={unitValueChange}
                  value={unitValue}
                />
                <Typography>
                  Total amount -{' '}
                  {unitValue * coinDetails.market_data.current_price.usd}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    columnGap: '20px',
                    justifyContent: 'center',
                    width: '100%'
                  }}
                >
                  <button
                    className={Styles.modalCancelBtn}
                    onClick={handleModalClose}
                  >
                    Cancel
                  </button>
                  <button
                    className={Styles.modalPurchaseBtn}
                    onClick={() =>
                      investHandler(
                        unitValue * coinDetails.market_data.current_price.usd
                      )
                    }
                  >
                    Purchase
                  </button>
                </Box>
              </Box>
            </Modal>
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
        )}
      </Box>
      </Box>
    </Box>
      
    </>
  );
};

// AssetsPage.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default AssetsPage;
