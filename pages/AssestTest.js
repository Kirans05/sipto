import React, { useEffect, useState } from 'react';
import { Box, Slider, Typography } from '@mui/material';
import axios from 'axios';
import Head from 'next/head';
import Styles from '../Styles/Test.module.css';
import Sidebar from '../Component/Siderbar/Sidebar';
import Header from '../Component/Header/Header';

const AssestTest = () => {
  const [returnObj, setReturnObj] = useState([
    { timeFrame: '1-Week Return', BTC: '-', 'S&P500': '0.06%' },
    { timeFrame: '1-Month Return', BTC: '-', 'S&P500': '-3.58%' },
    { timeFrame: '3-Month Return', BTC: '-', 'S&P500': '2.19%' },
    { timeFrame: '6-Month Return', BTC: '-', 'S&P500': '1.34%' },
    { timeFrame: '1-Year Return', BTC: '18012.49%', 'S&P500': '-16.77%' },
    { timeFrame: '3-Year Return', BTC: '17667.7%', 'S&P500': '24.66%' }
  ]);
  const [optionSelected, setOptionSelected] = useState("OverView")
  const [contentSize, setContentSize] = useState("More")

  const [largestHoldings, setLargestHoldings] = useState([
    {name:"Fedral Home Loan Banks 3.25%", percentage:"3.54%"},
    {name:"ClearShares Ultra-short Maturity Etf", percentage:"3.12%"},
    {name:"United States Treasury Notes 0.12%", percentage:"3.10%"},
    {name:"Federal Home Loan Mortgage Corporation 0.12%", percentage:"3.10%"},
    {name:"Federal Home Loan Mortgage Corporation 0.38%", percentage:"3.07%"},
    {name:"United States Treasury Notes 0.25%", percentage:"3.05%"},
    {name:"Federal National Mortgage Association 0.75%", percentage:"2.43%"},
    {name:"J.M. Smucker Company 3.5%", percentage:"2.21%"},
    {name:"SALT LAKE CITY UTAH REDEV AGY TAX INCREMENT REV 5.11%", percentage:"2.07%"},
    {name:"Pfizer Inc. 2.75%", percentage:"1.98%"},
  ])

  const fetchChartDetails = async () => {
    try {
      let chartResponse = await axios(
        'https://api.coingecko.com/api/v3/coins/bitcoin'
      );
      console.log(chartResponse);
    } catch (err) {}
  };



  const contentSizeHandler = () => {
    if(contentSize == "More"){
      setContentSize("Less")
    }else{
      setContentSize("More")
    }
  }

  useEffect(() => {
    fetchChartDetails();
  }, []);

  return (
    <>
      <Head>
        <title>FundPage</title>
      </Head>
      <Box className={Styles.simpleMainBox}>
        <Sidebar />
        <Box className={Styles.headerAndMainCompo}>
          <Header />
          <Box className={Styles.assestPageMainBox}>
            <Box className={Styles.firstRow}>
              <Box
                component={'img'}
                src={
                  'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579'
                }
                alt={'coin Image'}
                className={Styles.coinImage}
              />
              <Box className={Styles.firtsRow_secondColumn}>
                <Typography>BTC</Typography>
                <Typography>
                  ClearShares Piton Intermediate Fixed Income ETF, ETF
                </Typography>
                <Typography>NYSE ARCA</Typography>
              </Box>
              <Box className={Styles.firstRow_thirdColumn}>
                <Typography>$99.11</Typography>
                <Typography>-$0.00 (-0.00%)</Typography>
              </Box>
            </Box>
            <Box className={Styles.secondRow}>
              <Typography onClick={() => setOptionSelected("OverView")} className={Styles.optionsTypo}>OverView</Typography>
              <Typography onClick={() => setOptionSelected("Returns")} className={Styles.optionsTypo}>Returns</Typography>
            </Box>

            {
              optionSelected == "OverView" ?
              <Box className={Styles.overViewBox}>
              <Typography>Performance</Typography>
              <Box className={Styles.about_weekRangeBox}>
                <Box className={Styles.aboutBox}>
                  <Typography>
                    ABOUT CLEARSHARES PITON INTERMEDIATE FIXED INCOME ETF
                  </Typography>
                  <Typography>
                    The investment seeks current income consistent with the long
                    term preservation of capital. The fund is an actively
                    managed exchange-traded fund (ETF) that seeks to achieve its
                    investment objective by investing, under normal market
                    conditions, at least 80% of its net assets (plus borrowings
                    for investment purposes) in debt securities and in
                    derivatives and other instruments that have economic
                    characteristics similar to such securities. It principally
                    invests in U.S.-dollar denominated, investment-grade
                    securities and seeks to typically maintain a dollar-weighted
                    average portfolio maturity of zero to ten years. The fund is
                    non-diversified.
                  </Typography>
                </Box>
                <Box className={Styles.weekRangeBox}>
                  <Typography>52-WEEK RANGE</Typography>
                  <Box className={Styles.sliderBox}>
                    <Typography>$91.18</Typography>
                    <Slider
                      defaultValue={99.11}
                      step={10}
                      marks
                      min={91.18}
                      max={99.11}
                      disabled
                    />
                    <Typography>$99.11</Typography>
                  </Box>
                </Box>
                <Box className={Styles.expense_volumeBox}>
                  <Box className={Styles.expenseRatioBox}>
                    <Typography>EXPENSE RATIO</Typography>
                    <Typography>0.45%</Typography>
                  </Box>
                  <Box className={Styles.avgVolumeBox}>
                    <Typography>AVG VOLUME</Typography>
                    <Typography>2.61k</Typography>
                  </Box>
                </Box>
                <Box className={Styles.indicatorBox}>
                  <Typography>NM = Not Meaningful</Typography>
                  <Typography>Learn more about these indicators</Typography>
                </Box>
              </Box>

              {/*sector breakdown information*/}
              <Box className={Styles.sectorBreakdownBox}>
                <Typography>SECTOR BREAKDOWN</Typography>
                {/* dognut chart */}
              </Box>

              {/* Largest holding */}
              <Box className={Styles.largestHoldingBox}>
                <Typography>LARGEST HOLDINGS</Typography>
                {
                  largestHoldings.map((item,index) => {
                    if(contentSize == "More"){
                      if(index <= 3){
                        return <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography>{item.name}</Typography>
                        <Typography>{item.percentage}</Typography>
                      </Box>
                      }
                    }else{
                      return <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography>{item.name}</Typography>
                        <Typography>{item.percentage}</Typography>
                      </Box>
                    }
                    
                  })
                }
                <Typography sx={{ textAlign: 'center', "&:hover":{cursor:"pointer"} }} onClick={contentSizeHandler}>Show {contentSize}</Typography>
              </Box>
            </Box>
            : <Box className={Styles.returnBox}>
            <Typography>RETURNS</Typography>
            <Box className={Styles.returnBoxDetails}>
              <Box className={Styles.header}>
                <Typography className={Styles.timeFrameTypo}>
                  TIME FRAME
                </Typography>
                <Typography className={Styles.cryptoTypo}>BTC</Typography>
                <Typography className={Styles.s_p_500Typo}>
                  S&P 500
                </Typography>
                <Typography className={Styles.tickerTypo}>-</Typography>
              </Box>
              {/* <Box className={Styles.detailBox}> */}
                {returnObj.map((item, index) => {
                  return (
                    <Box key={index} className={Styles.detailBox}>
                      <Typography className={Styles.timeFrameTypo}>{item.timeFrame}</Typography>
                      <Typography className={Styles.cryptoTypo}>{item.BTC}</Typography>
                      <Typography className={Styles.s_p_500Typo}>{item['S&P500']}</Typography>
                      <Typography className={Styles.tickerTypo}>-</Typography>
                    </Box>
                  );
                })}
              {/* </Box> */}
            </Box>
          </Box>
            }
            
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AssestTest;
