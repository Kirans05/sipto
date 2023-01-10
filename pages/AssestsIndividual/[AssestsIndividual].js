import { Alert, Box, Button, Divider, Modal, Slider, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import HighchartsReact from 'highcharts-react-official';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import Header from '../../Component/Header/Header';
import Sidebar from '../../Component/Siderbar/Sidebar';
import supabase from '../../src/Config/supabaseClient';
import Styles from "../../Styles/AssestsIndividual.module.css"
import Highcharts from 'highcharts/highstock';
// import { Doughnut } from 'react-chartjs-2';
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
import MuiAlert from "@mui/material/Alert";



const AssestsIndividual = () => {


  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const chartRef = useRef()
  const coinId = useRouter().query.AssestsIndividual;
  const [assestDetails, setAssestDetails] = useState("")
  const [optionSelected, setOptionSelected] = useState("overview")
  const [arr, setArr] = useState([-2,-1,0,1,2])
  const [i, setI] = useState(0)
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState('');
  const [snackBarColor, setSnackBarColor] = useState('success');
  const [modalOpen, setModalOpen] = useState(false);
  const [unitValue, setUnitValue] = useState(1);
  const [userDetails, setUserDetails] = useState("")



  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);


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
              receiver: assestDetails.name,
              message: `${assestDetails.name} purchase`,
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
            } catch (err) {
            }
          }
        } catch (err) {
        }
      }
    } catch (err) {
    }
  };

  


  const [chartOptions, setChartOptions] = useState({
    chart: {
        zoomType: 'xy',
        backgroundColor:"black",
    },
    xAxis: [{
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        crosshair: true,
        tickLength:0
    }],
    yAxis: [{ // Primary yAxis
        labels: {
            // 
            enabled:false
        },
        title: {
            // text: 'Temperature',
            style: {
                color: "red"
            }
        },
        

    }, { // Secondary yAxis
        title: {
            text: 'Precipitation',
            style: {
                color: "green"
            }
        },
        labels: {
            format: '{value} ',
            style: {
                color: "green"
            }
        },
        opposite: true
    }],
    tooltip: {
        shared: true
    },
    legend: {
        align: 'left',
        x: 80,
        verticalAlign: 'top',
        y: 80,
        floating: true,
        backgroundColor:
            'rgba(255,255,255,0.25)'
    },
    series: [{
        type: 'spline',
        yAxis: 1,
        data: [27.6, 28.8, 21.7, 34.1, 29.0, 28.4, 45.6, 51.7, 39.0,
            60.0, 28.6, 32.1],
        tooltip: {
            valueSuffix: ' '
        },
          color:"green"

    }, {
        type: 'spline',
        data: [-13.6, -14.9, -5.8, -0.7, 3.1, 13.0, 14.5, 10.8, 5.8,
            -0.7, -11.0, -16.4],
        tooltip: {
            valueSuffix: ''
        }
    }]
});


const [DognutData, setDognutData] = useState({
  labels: [
    
  ],
  datasets: [
    {
      label: 'All Others: 100.00%',
      data: ['100'],
      hoverOffset: 4,
      backgroundColor:"rgb(107,133,189)"
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
  cutout: 10,
  radius: 90,
  circumference: 360
};



  const fetchSingleAssestDetails = async () => {
    try {
      let fetchResponse = await supabase
        .from('new_assests_table')
        .select('*')
        .eq('id', coinId);

      console.log(fetchResponse);
      if(fetchResponse.status == 200){
        setAssestDetails(fetchResponse.data[0])
        let filterXAxisValues = fetchResponse.data[0].graph_1W.returns.map(item => {
          return item.date.substring(0,10)
        })
        console.log(filterXAxisValues)

        let filterYaxisStockValue = fetchResponse.data[0].graph_1W.returns.map(item => {
          return item.vest+"%"
        })

        console.log(filterYaxisStockValue)

        let filterYaxisS_P_500Value = fetchResponse.data[0].graph_1W.returns.map(item => {
          return item['sp500']+"%"
        })

        console.log(filterYaxisS_P_500Value)
        // setChartOptions({...chartOptions, xAxis:[{...chartOptions.xAxis[0],categories:filterXAxisValues}], series:[{...chartOptions.series[0], data:filterYaxisStockValue},{...chartOptions.series[1], data: filterYaxisS_P_500Value}]})
      }
    } catch (err) {}
  };

  useEffect(() => {
    // console.log(localStorage.getItem(userData))
    setUserDetails(JSON.parse(localStorage.getItem("userData")))
    fetchSingleAssestDetails();
  }, []);

  return (
    <>
      <Head>
        <title>AssetsPage</title>
      </Head>
      <Box className={Styles.simpleMainBox}>
        <Sidebar />
        <Box className={Styles.headerAndMainCompo}>
          <Header />
          {
            assestDetails == "" ? null
            : <Box className={Styles.singleAssestMainBox}>
            <Box className={Styles.firstBox}>
              <Box className={Styles.imageBox}>
                <Box
                  component={'img'}
                  src={
                    'https://assets.coingecko.com/coins/images/325/small/Tether.png?1668148663'
                  }
                  alt={'assest Image'}
                  className={Styles.assestImage}
                />
                <Box className={Styles.ticker_titleBox}>
                  <Typography className={Styles.typo}>{assestDetails.ticker}</Typography>
                  <Typography className={Styles.typo}>{assestDetails.name}</Typography>
                </Box>
              </Box>
              <Box className={Styles.priceBox}>
                <Typography className={Styles.typo}>{assestDetails.price}</Typography>
                <Typography className={Styles.typo} sx={{color:assestDetails.change.toString().startsWith("-") ? "red" : "green"}}>{assestDetails.change} ({assestDetails.changePercent}%)</Typography>
              </Box>
            </Box>
            <Box className={Styles.secondBox}>
                {
                    assestDetails.tabs.map((item, index) => {
                        return <Typography key={item} className={Styles.typo} onClick={() => setOptionSelected(item)}
                        sx={{borderBottom: optionSelected == item ? "2px solid white" : "2px solid rgb(7,12,39)"}}
                        >{item.toUpperCase()}</Typography>
                    })
                }
            </Box>
            {
              optionSelected == "overview" ? 
              <Box className={Styles.overViewBox}>
                <Typography className={Styles.performanceTypo}>Performance</Typography>
                <Box className={Styles.comparisionChart}>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={chartOptions}
                  constructorType="chart"
                  ref={chartRef}
                />
                </Box>
                <Box className={Styles.about_52WeekBox}>
                    <Typography className={Styles.aboutTypo}>ABOUT {assestDetails.name.toUpperCase()}</Typography>
                    <Typography className={Styles.about_description_typo}>{assestDetails.description}</Typography>
                    <Box className={Styles.WeekRange52Box}>
                        <Typography className={Styles.weekRangeTitleTypo}>52-WEEK RANGE</Typography>
                        <Box className={Styles.priceRange}>
                            <Typography>${assestDetails.summary[0].raw.low}</Typography>
                            <Slider
                                defaultValue={99.11}
                                step={10}
                                marks
                                min={91.18}
                                max={99.11}
                                disabled
                                />
                            <Typography>${assestDetails.summary[0].raw.high}</Typography>
                        </Box>
                    </Box>
                    <Box className={Styles.differentRationBox}>
                        {
                            assestDetails.summary.map((item,index) => {
                                if(index > 0){
                                    return <Box key={index} className={Styles.individualRation}>
                                    <Typography>{item.label}</Typography>
                                    <Typography>{item.value}</Typography>
                                </Box>
                                }
                            })
                        }
                    </Box>
                </Box>

                {/* sector */}
                <Box className={Styles.sectorBreakdownBox}>
                    <Typography className={Styles.titleTypo}>SECTOR BREAKDOWN</Typography>
                    <Box className={Styles.dognutBox} >
                      <Doughnut data={DognutData} options={DognutOptions} />
                    </Box>
                </Box>

                {/* largest holding */}
                <Box className={Styles.largestHoldingsBox}>
                    <Typography className={Styles.largestHoldingsTitle}>LARGEST HOLDINGS</Typography>
                    <Box className={Styles.holdingDetailsBox}>
                    {
                        assestDetails.holdings.map((item,index) => {
                            return <Box key={index} className={Styles.singleHoldingDetailsBox}>
                                <Typography className={Styles.holdingsTitleTypo}>{item.name}</Typography>
                                <Typography className={Styles.holdingsPercentageTypo}>{item.assetsPercent}%</Typography>
                            </Box>
                        })
                    }
                    </Box>
                </Box>
            </Box>
            : <Box className={Styles.returnBox}>
            <Typography className={Styles.returnBoxTitleTypo}>Returns</Typography>
            <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align='left'>TimeFrame</TableCell>
              <TableCell align='left'>{assestDetails.ticker}</TableCell>
              <TableCell align='left'>S&P500</TableCell>
            </TableRow>
          </TableHead>
            <TableBody>
            {
                    assestDetails.returns.timeFrames.value.map((item,index) => {
                         return <TableRow hover key={item}>
                          <TableCell align='left'>{item.label}</TableCell>
                          <TableCell align='left'>{assestDetails.returns.current.value[item.key].value}</TableCell>
                          <TableCell align='left'>{assestDetails.returns.sp500.value[item.key].value}</TableCell>
                        </TableRow>
                    })
                }
            </TableBody>
        </Table>
      </TableContainer>
        </Box>
            }
            <Button variant='contained' className={Styles.investButton}
              onClick={handleModalOpen}
            >Invest</Button>
          </Box>
          }
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
                <Typography>
                  Total amount -{' '}
                  {assestDetails.price*unitValue}
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
                        unitValue * assestDetails.price
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
    </>
  );
};

export default AssestsIndividual;
