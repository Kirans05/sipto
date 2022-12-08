import HighchartsReact from 'highcharts-react-official';
import Styles from '../Styles/SingleBasket.module.css';
import Highcharts from 'highcharts/highstock';
import MuiAlert from '@mui/material/Alert';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Bubble, Scatter, Doughnut } from 'react-chartjs-2';
import dynamic from 'next/dynamic';
import supabase from '../src/Config/supabaseClient';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

import { useTheme } from '@emotion/react';
import {
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Modal,
  OutlinedInput,
  Snackbar,
  styled,
  TextField,
  Typography
} from '@mui/material';
import Head from 'next/head';
import React, { useState, useRef, useEffect } from 'react';
import SidebarLayout from 'src/layouts/SidebarLayout';
import Header from '../Component/Header/Header';
import Sidebar from '../Component/Siderbar/Sidebar';

const SingleBasket = () => {
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const [optionSelected, setOptionSelected] = useState('Chart & Overview');
  const [returnSelected, setReturnSelected] = useState('Annualized Returns');
  const [errorMsg, setErrorMsg] = useState('');
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [snackBarColor, setSnackBarColor] = useState('success');
  const [modalOpen, setModalOpen] = useState(false);
  const [unitValue, setUnitValue] = useState(1);
  const [userDetails, setUserDetails] = useState('');

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);
  const handleSnackBarClick = () => {
    setSnackBarOpen(true);
  };

  const unitValueChange = (e) => {
    if (e.target.value <= 0) {
      return;
    }

    setUnitValue(e.target.value);
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackBarOpen(false);
  };

  const LineData = {
    labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JULY'],
    datasets: [
      {
        label: 'My First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const LineOpt = {
    Plugins: {
      legend: {
        display: true
      }
    },
    elements: {
      line: {
        tension: 0,
        borderWidth: 2,
        borderColor: 'rgba(47,97,68,1)',
        fill: 'start',
        backgroundColor: 'rgba(47,97,68,0.3)'
      },
      point: {
        radius: 0,
        hitRadius: 0
      }
    },
    scales: {
      xAxis: {
        display: false
      },
      yAxis: {
        display: false
      }
    },
    tooltips: {
      mode: 'index',
      intersect: false
    },
    hover: {
      mode: 'index',
      intersect: false
    }
  };

  const DognutData = {
    labels: [
      'Bitcoin - 20%',
      'Ethereum - 20%',
      'Tether - 20%',
      'BNB - 20%',
      'USD Coin - 20%'
    ],
    datasets: [
      {
        // label: 'My First Dataset',
        data: ['20', '20', '20', '20', '20'],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgb(78,121,167)',
          'rgb(128,103,220)'
        ],
        hoverOffset: 4
      }
    ]
  };

  const DognutOptions = {
    elements: {
      arc: {
        weight: 0.5,
        borderWidth: 3
      }
    },
    cutout: 50,
    radius: 90,
    circumference: 360
  };

  const chartRef = useRef();
  const chart_overview_ref = useRef(null);
  const forcast_ref = useRef(null);
  const weights_ref = useRef(null);
  const returns_ref = useRef(null);
  const options = { style: 'currency', currency: 'USD' };
  const numberFormat = new Intl.NumberFormat('en-US', options);
  const [NoOfDays, setNoOfDays] = useState(1);
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
      gridLineWidth: 0.5,
      // min: yAxisMin,
      title: false
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

  const fetchChartDetails = async () => {
    let response = await fetch(
      `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${NoOfDays}`
    );

    let data = await response.json();
    setChartOptions({
      series: {
        data: data.prices
      }
    });
  };

  const investHandler = async (totalPrice) => {
    if (
      userDetails.wallet_balance < totalPrice ||
      userDetails.wallet_balance <= 0
    ) {
      console.log('second');
      handleSnackBarClick();
      setSnackBarColor('error');
      setSnackBarMsg('Not Enough Balance to Purchase');
      return;
    }
    console.log('first');
    try {
      let balanceResponse = await supabase.rpc('decrement_balance', {
        amount: Math.ceil(totalPrice)
      });
      console.log(balanceResponse);
      if (balanceResponse.data == true) {
        try {
          let transactionResponse = await supabase.rpc(
            'update_transaction_details',
            {
              id: userDetails.id,
              amount: Math.ceil(totalPrice),
              sender: 'user',
              receiver: 'basket',
              message: `BNB Chain Ecosystem Basket`,
              type: 'debit'
            }
          );
          console.log(transactionResponse);
          if (transactionResponse.data == true) {
            try {
              let coinTableResponse = await supabase.rpc('update_coins_table', {
                userid: userDetails.id,
                coin_id: 'BNB Chain Ecosystem Basket',
                purchase_price: Math.ceil(totalPrice),
                purchase_unit: unitValue
              });
              console.log(coinTableResponse);
              if (coinTableResponse.data == true) {
                handleSnackBarClick();
                setSnackBarColor('success');
                setSnackBarMsg('Coin SuccessFully Purchased');
                handleModalClose();
                return;
              }
            } catch (err) {}
          }
        } catch (err) {}
      }
    } catch (err) {}
  };

  const handleScrollEvent = (type) => {
    setOptionSelected(type);
    if (type == 'Chart & Overview') {
      chart_overview_ref.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (type == 'Forecast') {
      forcast_ref.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (type == 'Weights & Distribution') {
      weights_ref.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (type == 'Returns') {
      returns_ref.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setUserDetails(JSON.parse(localStorage.getItem('userData')));
    fetchChartDetails();
  }, [NoOfDays]);

  return (
    <>
      <Head>
        <title>SingleBasket</title>
      </Head>
      <Box className={Styles.simpleMainBox}>
      <Sidebar />
      <Box className={Styles.headerAndMainCompo}>
        <Header />
        <Box className={Styles.mainBox}>
        <Box className={Styles.basketBreifInfo}>
          <Box
            component={'img'}
            src="https://www.pandasecurity.com/en/mediacenter/src/uploads/2021/11/pandasecurity-crypto-gaming.jpg"
            className={Styles.basketlogo}
          />
          <Box className={Styles.basketFirstpart}>
            <Typography>BNB Chain Ecosystem Basket</Typography>
            <Typography>
              BNB Smart Chain or BSc is a Smart Contarct Platform which runs on
              POS consensus mechanism.
            </Typography>
            <Box className={Styles.precaution}>
              <Typography>Investment App</Typography>
              <Typography className={Styles.mediumRisk}>Medium Risk</Typography>
            </Box>
          </Box>
          <Box className={Styles.basketSecondPart}>
            <Box className={Styles.sixMonth}>
              <Typography>6M</Typography>
              <Typography sx={{ color: 'red' }}>-3.56%</Typography>
            </Box>
            <Box className={Styles.oneYear}>
              <Typography>1Y</Typography>
              <Typography sx={{ color: 'red' }}>-55.53%</Typography>
            </Box>
            <Box className={Styles.threeYear}>
              <Typography>3Y</Typography>
              <Typography sx={{ color: 'rgb(39,239,157)' }}>114.3%</Typography>
            </Box>
          </Box>
          <Box className={Styles.basketThirdpart}>
            <Box
              component={'img'}
              className={Styles.basketAssestsImage}
              src={
                'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579'
              }
            />
            <Box
              component={'img'}
              className={Styles.basketAssestsImage}
              src={
                'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880'
              }
            />
            <Box
              component={'img'}
              className={Styles.basketAssestsImage}
              src={
                'https://assets.coingecko.com/coins/images/325/large/Tether.png?1668148663'
              }
            />
            <Box
              component={'img'}
              className={Styles.basketAssestsImage}
              src={
                'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1644979850'
              }
            />
            <Box
              component={'img'}
              className={Styles.basketAssestsImage}
              src={
                'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389'
              }
            />
          </Box>
        </Box>
        <Box className={Styles.mainBoxSecondHalf}>
          <Box className={Styles.mainBoxLeftPart}>
            <Box className={Styles.investmentvariousOptions}>
              <Typography
                className={Styles.optionButton}
                sx={{
                  color:
                    optionSelected == 'Chart & Overview'
                      ? 'rgb(255,215,111)'
                      : 'white'
                }}
                // onClick={() => setOptionSelected("Chart & Overview")}
                onClick={() => handleScrollEvent('Chart & Overview')}
              >
                Chart & Overview
              </Typography>
              <Typography
                className={Styles.optionButton}
                sx={{
                  color:
                    optionSelected == 'Forecast' ? 'rgb(255,215,111)' : 'white'
                }}
                onClick={() => handleScrollEvent('Forecast')}
                // onClick={() => setOptionSelected("Forecast")}
              >
                Forecast
              </Typography>
              <Typography
                className={Styles.optionButton}
                sx={{
                  color:
                    optionSelected == 'Weights & Distribution'
                      ? 'rgb(255,215,111)'
                      : 'white'
                }}
                onClick={() => handleScrollEvent('Weights & Distribution')}
                // onClick={() => setOptionSelected("Weights & Distribution")}
              >
                Weights & Distribution
              </Typography>
              <Typography
                className={Styles.optionButton}
                sx={{
                  color:
                    optionSelected == 'Returns' ? 'rgb(255,215,111)' : 'white'
                }}
                onClick={() => handleScrollEvent('Returns')}
                // onClick={() => setOptionSelected("Returns")}
              >
                Returns
              </Typography>
            </Box>
            <Box className={Styles.buttonGroup}>
              <button
                onClick={() => setNoOfDays(1)}
                className={`${
                  NoOfDays == 1 ? Styles.buttonActive : Styles.individualButton
                }`}
              >
                1D
              </button>
              <button
                onClick={() => setNoOfDays(7)}
                className={`${
                  NoOfDays == 7 ? Styles.buttonActive : Styles.individualButton
                }`}
              >
                7D
              </button>
              <button
                onClick={() => setNoOfDays(14)}
                className={`${
                  NoOfDays == 14 ? Styles.buttonActive : Styles.individualButton
                }`}
              >
                14D
              </button>
              <button
                onClick={() => setNoOfDays(30)}
                className={`${
                  NoOfDays == 30 ? Styles.buttonActive : Styles.individualButton
                }`}
              >
                30D
              </button>
            </Box>
            <Box className={Styles.highChartReact} ref={chart_overview_ref}>
              <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
                constructorType="chart"
                ref={chartRef}
              />
            </Box>
            <Divider className={Styles.divider} />
            <Box className={Styles.futureTrend} ref={forcast_ref}>
              <Typography className={Styles.futureTrendTypography}>
                Future Trend
              </Typography>
              <Line data={LineData} options={LineOpt} width={100} height={50} />
            </Box>
            <Divider className={Styles.divider} />
            <Box className={Styles.dognutBox_and_info} ref={weights_ref}>
              <Box className={Styles.dognutBox}>
                <Doughnut data={DognutData} options={DognutOptions} />
              </Box>
              <Box className={Styles.dognut_coin_info}>
                <Box
                  className={Styles.coinTypography}
                  sx={{ borderLeft: '10px solid rgb(255,99,132)' }}
                >
                  <Typography>Bitcoin</Typography>
                  <Typography>20%</Typography>
                </Box>
                <Box
                  className={Styles.coinTypography}
                  sx={{ borderLeft: '10px solid rgb(54, 162, 235)' }}
                >
                  <Typography>Ethereum</Typography>
                  <Typography>20%</Typography>
                </Box>
                <Box
                  className={Styles.coinTypography}
                  sx={{ borderLeft: '10px solid rgb(255, 205, 86)' }}
                >
                  <Typography>Tether</Typography>
                  <Typography>20%</Typography>
                </Box>
                <Box
                  className={Styles.coinTypography}
                  sx={{ borderLeft: '10px solid rgb(78,121,167)' }}
                >
                  <Typography>BNB</Typography>
                  <Typography>20%</Typography>
                </Box>
                <Box
                  className={Styles.coinTypography}
                  sx={{ borderLeft: '10px solid rgb(128,103,220)' }}
                >
                  <Typography>USD Coin</Typography>
                  <Typography>20%</Typography>
                </Box>
              </Box>
            </Box>
            <Box className={Styles.variousReturnsBox} ref={returns_ref}>
              <Typography
                className={Styles.returnButton}
                sx={{
                  color:
                    returnSelected == 'Annualized Returns'
                      ? 'rgb(255,215,111)'
                      : 'white'
                }}
                onClick={() => setReturnSelected('Annualized Returns')}
              >
                Annualized Returns
              </Typography>
              <Typography
                className={Styles.returnButton}
                sx={{
                  color:
                    returnSelected == 'Absolute Returns'
                      ? 'rgb(255,215,111)'
                      : 'white'
                }}
                onClick={() => setReturnSelected('Absolute Returns')}
              >
                Absolute Returns
              </Typography>
            </Box>
            {returnSelected == 'Annualized Returns' ? (
              <Box className={Styles.annualizedReturns}>
                <Box className={Styles.title}>
                  <Typography>Tenure</Typography>
                  <Typography>Basket Returns</Typography>
                </Box>
                <Box className={Styles.sixMonth}>
                  <Typography>6M</Typography>
                  <Typography sx={{ color: 'red' }}>-3.49%</Typography>
                </Box>
                <Box className={Styles.oneYear}>
                  <Typography>1Y</Typography>
                  <Typography sx={{ color: 'red' }}>-56.44%</Typography>
                </Box>
                <Box className={Styles.threeYear}>
                  <Typography>3Y</Typography>
                  <Typography sx={{ color: 'rgb(40,255,164)' }}>
                    110.61%
                  </Typography>
                </Box>
                <Box className={Styles.All}>
                  <Typography>All</Typography>
                  <Typography sx={{ color: 'rgb(40,255,164)' }}>
                    110.61%
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box className={Styles.AbsoluteReturns}>
                <Box className={Styles.title}>
                  <Typography>Tenure</Typography>
                  <Typography>Basket Returns</Typography>
                </Box>
                <Box className={Styles.sixMonth}>
                  <Typography>6M</Typography>
                  <Typography sx={{ color: 'red' }}>-3.49%</Typography>
                </Box>
                <Box className={Styles.oneYear}>
                  <Typography>1Y</Typography>
                  <Typography sx={{ color: 'red' }}>-56.44%</Typography>
                </Box>
                <Box className={Styles.threeYear}>
                  <Typography>3Y</Typography>
                  <Typography sx={{ color: 'rgb(40,255,164)' }}>
                    331.08%
                  </Typography>
                </Box>
                <Box className={Styles.All}>
                  <Typography>All</Typography>
                  <Typography sx={{ color: 'rgb(40,255,164)' }}>
                    331.08%
                  </Typography>
                </Box>
              </Box>
            )}

            <Box className={Styles.overView}>
              <Typography>Overview</Typography>
              <Typography>
                BNB Smart Chain or BSC is a Smart Contract Platform which runs
                on PoS (Proof of Stake) consensus mechanism. The purpose of BSC
                was to provide a low latency, cheap & faster to run platform for
                DApps which is also compatible with Ethereum. BSC token are
                called as Bep20 tokens. BSC is home to a lot of projects/DApps
                such as SushiSwap(SUSHI), PancakeSwap(CAKE), Basic Attention
                Token(BAT) etc. There are hundreds of DApps running on BSC, but
                we have filtered out the noise and present the best projects to
                invest in. We bring you a well diversified portfolio of such 14
                coins & tokens to invest in. This portfolio consists few of the
                top 20 tokens such as Binance(BNB) & ChainLink(LINK) along with
                some portion invested in stable coin to reduce the risk.
              </Typography>
            </Box>
          </Box>
          <Box className={Styles.mainBoxRightPart}>
            <Box className={Styles.investmentAmount}>
              <Typography>Minimum Investment</Typography>
              <Typography>$4,728.50</Typography>
            </Box>
            <Button
              className={Styles.invsetmentbutton}
              variant="contained"
              onClick={handleModalOpen}
            >
              Start Investing
            </Button>
            <Button className={Styles.wishlistButton}>Add to wishlist</Button>
          </Box>
        </Box>
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
            <Typography>Total amount - {unitValue * 4281.5}</Typography>
            <Box
              sx={{
                display: 'flex',
                columnGap: '30px',
                justifyContent: 'flex-end'
              }}
            >
              <Button
                variant="contained"
                color="error"
                onClick={handleModalClose}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => investHandler(unitValue * 4281.5)}
              >
                Purchase
              </Button>
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
      </Box>
    </Box>
      
    </>
  );
};

// SingleBasket.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default SingleBasket;
