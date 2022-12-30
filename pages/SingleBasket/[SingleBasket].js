import HighchartsReact from 'highcharts-react-official';
import Styles from '../../Styles/SingleBasket.module.css';
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
import supabase from '../../src/Config/supabaseClient';

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
  Checkbox,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
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
import Header from '../../Component/Header/Header';
import Sidebar from '../../Component/Siderbar/Sidebar';
import { useRouter } from 'next/router';
import ClearIcon from '@mui/icons-material/Clear';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DesktopDatePicker } from '@mui/x-date-pickers';


const SingleBasket = () => {


  let bgColorDognut = ["rgb(254,238,127)","rgb(83,231,206)","rgb(118,129,247)","rgb(250,135,53)","rgb(233,63,142)","rgb(184,231,83)","rgb(231,83,83)","rgb(184,83,231)","rgb(14,57,169)","rgb(121,231,83)","rgb(254,238,127)","rgb(83,231,206)","rgb(118,129,247)","rgb(250,135,53)"]
  const basketId = useRouter().query.SingleBasket;
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
  const [basketDetails, setbasketDetails] = useState('');
  const [sipOption, setSipOption] = useState({
    duration:"monthly",
    units:"shares",
    date:"",
    day:"",
    shareQty:0,
    totalAmount:0
  })
  const [sipPlaced, setSipPlaced] = useState(false)

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const handleSnackBarClick = () => {
    setSnackBarOpen(true);
  };

  const [anchorElMenuList, setAnchorElMenuList] = React.useState(null);
  const openMenuList = Boolean(anchorElMenuList);

  const handleClickMenuList = (event) => {
    setAnchorElMenuList(event.currentTarget);
  };

  const handleCloseMenuList = (day) => {
    setAnchorElMenuList(null);
    setSipOption({...sipOption, day})
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

  const [DognutData, setDognutData] = useState({
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
        hoverOffset: 4
      }
    ]
  });

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
    setChartOptions({...chartOptions, series:[{...chartOptions.series[0], data: data.prices}]
      // series: {
      //   data: data.prices
      // }
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
              message: `${basketDetails.name}`,
              type: 'debit'
            }
          );
          console.log(transactionResponse);
          if (transactionResponse.data == true) {
            try {
              let coinTableResponse = await supabase.rpc('update_coins_table', {
                userid: userDetails.id,
                coin_id: `${basketDetails.name}`,
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
        } catch (err) {
         
        }
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

  const fetchSingleBasketDetails = async () => {
    try {
      let response = await supabase
        .from('bakset_Table')
        .select('*')
        .eq('id', basketId);
        
        let labelData = response.data[0].constituents.map(item => {
          return `${item.crypto.name} - ${item.weight}%`
        })
        
        let dognutDataValue = response.data[0].constituents.map(item => {
          return `${item.weight}`
        })

        
        // setDognutData({...DognutData, datasets: [{...DognutData.datasets[0], data:dognutDataValue, backgroundColor:bgColorDognut.splice(0,response.data[0].constituents.length)}], labels: labelData })

        setDognutData({
          labels:labelData,
          datasets:[{
            data:dognutDataValue,
            backgroundColor:bgColorDognut.splice(0, response.data[0].constituents.length),
            hoverOffset:4
        }]
        })
        console.log(response.data[0])
        setbasketDetails(response.data[0]);
    } catch (err) {}
  };


  const durationHandler = (e) => {
    setSipOption({...sipOption, duration:e.target.name})
  }


  const sipUnitCHangeHandler = (e) => {
    if(sipOption.units == "shares"){
      setSipOption({...sipOption, units:"SIP Amount"})
    }else{
      setSipOption({...sipOption, units:"shares"})
    }
  }


  const investmentDayHandler = (e) => {
    setSipOption({...sipOption, date:e.toDateString()})
  }


  const list = (anchor) => {
    if(basketDetails == ""){
      return <Box>

      </Box>
    }else{
      return <Box
      className={Styles.sipDrawer}
      role="presentation"
    >
      <Box className={Styles.sipDrawerHeading}>
        <Box sx={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
        <Typography className={Styles.basketTitle}>{basketDetails.name}</Typography>
        <ClearIcon onClick={toggleDrawer("right", false)} sx={{"&:hover":{cursor:"pointer"}}}/>
        </Box>
        <Typography className={Styles.basketPrice}>{basketDetails.min_investment.amount} <span style={{color:"rgb(89,170,0)", fontSize:"15px"}}>+0.06 (4.41%)</span></Typography>
        <Typography className={Styles.sipLogo}>SIP</Typography>
      </Box>
      <Divider sx={{backgroundColor:"rgb(174 181 187)"}}/>
      <Box className={Styles.sipDrawerBody}>
        <Box className={Styles.drawerBodydFirstPart}>
          <Typography className={Styles.drawerTypography}>Buy Every Month</Typography>
          <Typography className={Styles.drawerTypographyMonthy}><Checkbox name='monthly' onChange={durationHandler} checked={sipOption.duration == "monthly" ? true : false}/> Monthly</Typography>
          <Typography className={Styles.drawerTypographyWeekly}><Checkbox name='weekly' onChange={durationHandler} checked={sipOption.duration == "weekly" ? true : false}/> Weekly</Typography>
          <Typography className={Styles.drawerTypography}>Buy Every week</Typography>
        </Box>
        <Box className={Styles.drawerBodySecondPart}>
          {
            sipOption.units == "shares" ?
            <Typography>Shares</Typography>
            : <Typography>SIP Amount</Typography>
          }
          {
            sipOption.units == "shares" ?
            <TextField type={"number"} sx={{width:120}} value={sipOption.shareQty} onChange={(e) => setSipOption({...sipOption, shareQty:e.target.value})}/>
            : <Typography className={Styles.shareQty}  sx={{display:"flex", alignItems:"center"}}>$ <TextField type={"number"} sx={{width:120}} value={sipOption.totalAmount}  onChange={(e) => setSipOption({...sipOption, totalAmount:e.target.value})}/></Typography>
          }
          <Divider className={Styles.divider}/>
          <Typography><Checkbox onChange={sipUnitCHangeHandler}/> Change to {sipOption.units == "shares" ? "Amount" : "Shares"}</Typography>
        </Box>
        <Box className={Styles.drawerBodyThirdPart}>
          <Typography>Day of investment</Typography>
          {
            sipOption.duration == "monthly" ? 
          //   <TextField
          //   onChange={investmentDayHandler}
          //   value={sipOption.date}
          //   id="date"
          //   label="Select"
          //   type="date"
          //   InputLabelProps={{
          //     shrink: true,
          //   }}
          //   className={Styles.dayOfInvestment}
          // /> 
          <DesktopDatePicker
                    label="Date desktop"
                    inputFormat="MM/dd/yyyy"
                    value={sipOption.date}
                    onChange={investmentDayHandler}
                    // onChange={(e) => console.log(e)}
                    renderInput={(params) => <TextField {...params} />}
                    className={Styles.dayOfInvestment}
                    disablePast
                />
          
          : <Typography onClick={handleClickMenuList} sx={{"&:hover":{cursor:"pointer"}}}>{sipOption.day == "" ? "Select" : sipOption.day == "Not Selected" ? "Select" : sipOption.day}</Typography>
          }
          <Divider className={Styles.divider}/>
          {
            sipOption.duration == "monthly" ?
            <Typography>Every Month</Typography>
            : <Typography>Every Week</Typography>
          }
        </Box>
        <Box className={Styles.drawerBodyFourthPart}>
          <Typography className={Styles.sipWarning}>Amount will be deducted from your trading account.</Typography>
          <button className={Styles.startSipButton} style={{backgroundColor: sipOption.duration == "monthly" ? sipOption.date == "" ? "rgb(167,171,182)": "rgb(89,170,0)": sipOption.day == "" ? "rgb(167,171,182)" : sipOption.day == "Not Selected" ? "rgb(167,171,182)" : "rgb(89,170,0)"}}  onClick={startSipHandler}>Start SIP</button>
        </Box>
      </Box>
    </Box>
      }
    }
    

  const startSipHandler = async () => {

    if(sipOption.duration == "weekly" && sipOption.units == "shares" && sipOption.shareQty <= 0){
      handleSnackBarClick();
      setSnackBarColor('error');
      setSnackBarMsg('Please Enter Quantity More than 0');
      return
    }else if(sipOption.duration == "weekly" && sipOption.units == "SIP Amount" && sipOption.totalAmount <= 0){
      handleSnackBarClick();
      setSnackBarColor('error');
      setSnackBarMsg('Please Enter Amount More than 0');
      return
    }else if(sipOption.duration == "monthly" && sipOption.units == "shares" && sipOption.shareQty <= 0){
      handleSnackBarClick();
      setSnackBarColor('error');
      setSnackBarMsg('Please Enter Quantity More than 0');
      return
    }else if(sipOption.duration == "monthly" && sipOption.units == "SIP Amount" && sipOption.totalAmount <= 0){
      handleSnackBarClick();
      setSnackBarColor('error');
      setSnackBarMsg('Please Enter Amount More than 0');
      return
    }

    if(sipOption.duration == "monthly" && sipOption.date == ""){
      handleSnackBarClick();
      setSnackBarColor('error');
      setSnackBarMsg('Please Select Date');
      return
    }

    if(sipOption.duration == "weekly" && (sipOption.day == "" || sipOption.day == "Not Selected")){
      handleSnackBarClick();
      setSnackBarColor('error');
      setSnackBarMsg('Please Select Day');
      return
    }

    try{
      let dataObj
      if(sipOption.duration == "monthly"){
        if(sipOption.units == "shares"){
          dataObj = {
            user_id:userDetails.id,
            date:sipOption.date == "" ? "" : Number(sipOption.date.slice(8,10)),
            frequency:sipOption.duration,
            invest_type:sipOption.units,
            qty:sipOption.shareQty,
            status:"Active",
            basketName:basketDetails.name,
            basket_id:basketDetails.id
          }
        }else{
          dataObj = {
            user_id:userDetails.id,
            date:sipOption.date == "" ? "" : Number(sipOption.date.slice(8,10)),
            frequency:sipOption.duration,
            invest_type:sipOption.units,
            amount:sipOption.totalAmount,
            status:"Active",
            basketName:basketDetails.name,
            basket_id:basketDetails.id
          }
        }
      }else{
        if(sipOption.units == "shares"){
          dataObj = {
            user_id:userDetails.id,
            day:sipOption.day,
            frequency:sipOption.duration,
            invest_type:sipOption.units,
            qty:sipOption.shareQty,
            status:"Active",
            basketName:basketDetails.name,
            basket_id:basketDetails.id
          }
        }else{
          dataObj = {
            user_id:userDetails.id,
            day:sipOption.day,
            frequency:sipOption.duration,
            invest_type:sipOption.units,
            amount:sipOption.totalAmount,
            status:"Active",
            basketName:basketDetails.name,
            basket_id:basketDetails.id
          }
        }
      }

      let sipResponse = await supabase
          .from("sip_table")
          .insert([dataObj])
        
      if(sipResponse.error){
        handleSnackBarClick();
        setSnackBarColor('error');
        setSnackBarMsg('Error Setting SIP Try Again Later');
      }

      if(sipResponse.data || sipResponse.status == 201){
        handleSnackBarClick();
        setSnackBarColor('success');
        setSnackBarMsg('SIP Set SuccessFully');
      }
    }catch(err){
      console.log(err)
    }


  }

  useEffect(() => {
    setUserDetails(JSON.parse(localStorage.getItem('userData')));
    fetchChartDetails();
    fetchSingleBasketDetails();
  }, [NoOfDays]);

  return (
    <>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Head>
        <title>SingleBasket</title>
      </Head>
      <Box className={Styles.simpleMainBox}>
        <Sidebar />
        <Box className={Styles.headerAndMainCompo}>
          <Header />
          {basketDetails == ''  ? null : (
            <Box className={Styles.mainBox}>
              <Box className={Styles.basketBreifInfo}>
                <Box
                  component={'img'}
                  src={basketDetails.image.small}
                  className={Styles.basketlogo}
                />
                <Box className={Styles.basketFirstpart}>
                  <Typography>{basketDetails.name}</Typography>
                  <Typography>{basketDetails.description.short}</Typography>
                  <Box className={Styles.precaution}>
                    <Typography>Investment App</Typography>
                    <Typography sx={{backgroundColor : basketDetails.risk == "high" ? "rgb(242,55,83)" : basketDetails.risk == "low" ? "rgb(36,245,164)" : "rgb(251,255,40)", padding:"1%", borderRadius:"5px", color:"black"}}>
                      {basketDetails.risk} Risk
                    </Typography>
                  </Box>
                </Box>
                <Box className={Styles.basketSecondPart}>
                  <Box className={Styles.sixMonth}>
                    <Typography>6M</Typography>
                    <Typography
                      sx={{
                        color: basketDetails.returns.annualized['6M']
                          .toString()
                          .startsWith('-')
                          ? 'red'
                          : 'rgb(39,239,157)'
                      }}
                    >
                      {basketDetails.returns.annualized['6M']}%
                    </Typography>
                  </Box>
                  <Box className={Styles.oneYear}>
                    <Typography>1Y</Typography>
                    <Typography
                      sx={{
                        color: basketDetails.returns.annualized['1Y']
                          .toString()
                          .startsWith('-')
                          ? 'red'
                          : 'rgb(39,239,157)'
                      }}
                    >
                      {basketDetails.returns.annualized['1Y']}%
                    </Typography>
                  </Box>
                  <Box className={Styles.threeYear}>
                    <Typography>3Y</Typography>
                    <Typography
                      sx={{
                        color: basketDetails.returns.annualized['3Y']
                          .toString()
                          .startsWith('-')
                          ? 'red'
                          : 'rgb(39,239,157)'
                      }}
                    >
                      {basketDetails.returns.annualized['3Y']}%
                    </Typography>
                  </Box>
                </Box>
                <Box className={Styles.basketThirdpart}>
                  {basketDetails.constituents.map((item, index) => {
                    if (index < 4) {
                      return (
                        <Box
                        key={index}
                          component={'img'}
                          className={Styles.basketAssestsImage}
                          src={item.crypto.image.thumb}
                        />
                      );
                    }
                  })}
                  &nbsp;
                  <Typography>
                    & {basketDetails.constituents_count - 4} more
                  </Typography>
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
                          optionSelected == 'Forecast'
                            ? 'rgb(255,215,111)'
                            : 'white'
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
                      onClick={() =>
                        handleScrollEvent('Weights & Distribution')
                      }
                      // onClick={() => setOptionSelected("Weights & Distribution")}
                    >
                      Weights & Distribution
                    </Typography>
                    <Typography
                      className={Styles.optionButton}
                      sx={{
                        color:
                          optionSelected == 'Returns'
                            ? 'rgb(255,215,111)'
                            : 'white'
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
                        NoOfDays == 1
                          ? Styles.buttonActive
                          : Styles.individualButton
                      }`}
                    >
                      1D
                    </button>
                    <button
                      onClick={() => setNoOfDays(7)}
                      className={`${
                        NoOfDays == 7
                          ? Styles.buttonActive
                          : Styles.individualButton
                      }`}
                    >
                      7D
                    </button>
                    <button
                      onClick={() => setNoOfDays(14)}
                      className={`${
                        NoOfDays == 14
                          ? Styles.buttonActive
                          : Styles.individualButton
                      }`}
                    >
                      14D
                    </button>
                    <button
                      onClick={() => setNoOfDays(30)}
                      className={`${
                        NoOfDays == 30
                          ? Styles.buttonActive
                          : Styles.individualButton
                      }`}
                    >
                      30D
                    </button>
                  </Box>
                  <Box
                    className={Styles.highChartReact}
                    ref={chart_overview_ref}
                  >
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
                    <Line
                      data={LineData}
                      options={LineOpt}
                      width={100}
                      height={50}
                    />
                  </Box>
                  <Divider className={Styles.divider} />
                  <Box className={Styles.dognutBox_and_info} ref={weights_ref}>
                    <Box className={Styles.dognutBox}>
                      <Doughnut data={DognutData} options={DognutOptions} />
                    </Box>
                    <Box className={Styles.dognut_coin_info}>
                      {basketDetails.constituents.map((item, index) => {
                        return (
                          <Box
                          key={index}
                            className={Styles.coinTypography}
                            sx={{ borderLeft: `10px solid`+ ` ${bgColorDognut[index]}` }}
                          >
                            <Typography>{item.crypto.name}</Typography>
                            <Typography>{item.weight}%</Typography>
                          </Box>
                        );
                      })}
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
                        <Typography
                          sx={{
                            color: basketDetails.returns.annualized['6M']
                              .toString()
                              .startsWith('-')
                              ? 'red'
                              : 'rgb(39,239,157)'
                          }}
                        >
                          {basketDetails.returns.annualized['6M']}%
                        </Typography>
                      </Box>
                      <Box className={Styles.oneYear}>
                        <Typography>1Y</Typography>
                        <Typography
                          sx={{
                            color: basketDetails.returns.annualized['1Y']
                              .toString()
                              .startsWith('-')
                              ? 'red'
                              : 'rgb(39,239,157)'
                          }}
                        >
                          {basketDetails.returns.annualized['1Y']}%
                        </Typography>
                      </Box>
                      <Box className={Styles.threeYear}>
                        <Typography>3Y</Typography>
                        <Typography
                          sx={{
                            color: basketDetails.returns.annualized['3Y']
                              .toString()
                              .startsWith('-')
                              ? 'red'
                              : 'rgb(39,239,157)'
                          }}
                        >
                          {basketDetails.returns.annualized['3Y']}%
                        </Typography>
                      </Box>
                      <Box className={Styles.All}>
                        <Typography>All</Typography>
                        <Typography
                          sx={{
                            color: basketDetails.returns.annualized['All']
                              .toString()
                              .startsWith('-')
                              ? 'red'
                              : 'rgb(39,239,157)'
                          }}
                        >
                          {basketDetails.returns.annualized['All']}%
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
                        <Typography
                          sx={{
                            color: basketDetails.returns.absolute['6M']
                              .toString()
                              .startsWith('-')
                              ? 'red'
                              : 'rgb(39,239,157)'
                          }}
                        >
                          {basketDetails.returns.absolute['6M']}%
                        </Typography>
                      </Box>
                      <Box className={Styles.oneYear}>
                        <Typography>1Y</Typography>
                        <Typography
                          sx={{
                            color: basketDetails.returns.absolute['1Y']
                              .toString()
                              .startsWith('-')
                              ? 'red'
                              : 'rgb(39,239,157)'
                          }}
                        >
                          {basketDetails.returns.absolute['1Y']}%
                        </Typography>
                      </Box>
                      <Box className={Styles.threeYear}>
                        <Typography>3Y</Typography>
                        <Typography
                          sx={{
                            color: basketDetails.returns.absolute['3Y']
                              .toString()
                              .startsWith('-')
                              ? 'red'
                              : 'rgb(39,239,157)'
                          }}
                        >
                          {basketDetails.returns.absolute['3Y']}%
                        </Typography>
                      </Box>
                      <Box className={Styles.All}>
                        <Typography>All</Typography>
                        <Typography
                          sx={{
                            color: basketDetails.returns.absolute['All']
                              .toString()
                              .startsWith('-')
                              ? 'red'
                              : 'rgb(39,239,157)'
                          }}
                        >
                          {basketDetails.returns.absolute['All']}%
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  <Box className={Styles.overView}>
                    <Typography>Overview</Typography>
                    <Typography>{basketDetails.description.long}</Typography>
                  </Box>
                </Box>
                <Box className={Styles.mainBoxRightPart}>
                  <Box className={Styles.investmentAmount}>
                    <Typography>Minimum Investment</Typography>
                    <Typography>
                      $ {basketDetails.min_investment.amount}
                    </Typography>
                  </Box>
                  <Button
                    className={Styles.invsetmentbutton}
                    variant="contained"
                    onClick={handleModalOpen}
                  >
                    Start Investing
                  </Button>
                  {/* <Button className={Styles.wishlistButton}>
                    Add to wishlist
                  </Button> */}
                  <Button className={Styles.setSipButton} onClick={toggleDrawer("right", true)}>
                    Set SIP
                  </Button>
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
                  <Typography>Total amount - {unitValue * basketDetails.min_investment.amount}</Typography>
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
                      onClick={() => investHandler(unitValue * basketDetails.min_investment.amount)}
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
          )}
        </Box>
        <Drawer
            anchor={"right"}
            open={state["right"]}
            onClose={toggleDrawer("right", false)}
          >
            {list("right")}
          </Drawer>

          <Menu
          id="basic-menu"
          anchorEl={anchorElMenuList}
          open={openMenuList}
          onClose={() => handleCloseMenuList("Not Selected")}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
      >
        <MenuItem onClick={() => handleCloseMenuList("Mon")}>Mon</MenuItem>
        <MenuItem onClick={() => handleCloseMenuList("Tue")}>Tue</MenuItem>
        <MenuItem onClick={() => handleCloseMenuList("Wed")}>Wed</MenuItem>
        <MenuItem onClick={() => handleCloseMenuList("Thu")}>Thu</MenuItem>
        <MenuItem onClick={() => handleCloseMenuList("Fri")}>Fri</MenuItem>
      </Menu>
      </Box>
      </LocalizationProvider>
    </>
  );
};

// SingleBasket.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default SingleBasket;
