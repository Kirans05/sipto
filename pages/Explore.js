import { useTheme } from '@emotion/react';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
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
import Styles from '../Styles/Explore.module.css';
import supabase from '../src/Config/supabaseClient';
import { useRouter } from 'next/router';
import Header from '../Component/Header/Header';
import Sidebar from '../Component/Siderbar/Sidebar';
import ExploreCard from "../src/components/ExploreCard/ExploreCard"
import SearchIcon from '@mui/icons-material/Search';


const Explore = () => {

  const [basketData, setBasketData] = useState([])
  const [inputFeildValue, setInputFeildValue] = useState("")
  const [basketRisk, setBasketRisk] = useState("")
  const [basketCost, setBasketCost] = useState("All")

  const fetchAllBaskets = async () => {
    try {
      let resp = await supabase.from('bakset_Table').select('*');
      if (resp.error) {
        return;
      }

      if (resp.data) {
        if(basketRisk == "" && basketCost == "All"){
          setBasketData(resp.data);
        }else if(basketRisk != ""){
          let cost = basketCost == "All" ? 100000 : basketCost == "Less Than $50" ? 50 : basketCost == "Less Than $150" ? 150 : 250
          let filteredBasket = resp.data.filter(item => item.risk.toLowerCase().startsWith(basketRisk.toLowerCase()) && item.min_investment.amount < cost)
          console.log(filteredBasket)
          setBasketData(filteredBasket)
        }
      }
    } catch (err) {}
  };

  const searchHandler = async () => {
    try {
      let resp = await supabase.from('bakset_Table').select('*');
      if (resp.error) {
        return;
      }

      if (resp.data) {
        let filteredData = resp.data.filter(item => item.name.toLowerCase().includes(inputFeildValue.toLowerCase()))
        setBasketData(filteredData)
        setBasketRisk("")
      }
    } catch (err) {}
  }


  useEffect(() => {
    fetchAllBaskets()
  },[basketRisk, basketCost])

  return (
    <>
      <Head>
        <title>Explore</title>
      </Head>
      <Box className={Styles.simpleMainBox}>
        <Sidebar />
        <Box className={Styles.headerAndMainCompo}>
          <Header />
          <Box className={Styles.exploreMainBox}>
            <Box className={Styles.leftPart}>
              <Box sx={{display:"flex",alignItems:"center", columnGap:"10px"}}>
              <TextField placeholder='Search' value={inputFeildValue} onChange={(e) => setInputFeildValue(e.target.value)}/>
              <SearchIcon className={Styles.searchIcon} onClick={searchHandler}/>
              </Box>
              {
                basketData.map((item, index) => {
                  return <ExploreCard Styles={Styles} key={index} item={item}/>
                })
              }
            </Box>
            <Box className={Styles.rightPart}>
              <Typography className={Styles.exploreBAsketTitle}>
                Explore Basket
              </Typography>
              <Box className={Styles.filterBox}>
                <Typography className={Styles.fiterTitle}>Filters</Typography>
                <Box className={Styles.riskBox}>
                  <Typography className={Styles.riskTitle}>Risk</Typography>
                  <Box className={Styles.riskButtons}>
                    <button style={{backgroundColor:basketRisk == "Low" ? "rgb(255,215,111)" : "rgb(41,41,41)", color : basketRisk == "Low" ? "black" : "white"}} className={Styles.riskBtn} onClick={() => setBasketRisk("Low")}>Low</button>
                    <button style={{backgroundColor:basketRisk == "Med" ? "rgb(255,215,111)" : "rgb(41,41,41)", color : basketRisk == "Med" ? "black" : "white"}} className={Styles.riskBtn} onClick={() => setBasketRisk("Med")}>Med</button>
                    <button style={{backgroundColor:basketRisk == "High" ? "rgb(255,215,111)" : "rgb(41,41,41)", color : basketRisk == "High" ? "black" : "white"}} className={Styles.riskBtn} onClick={() => setBasketRisk("High")}>High</button>
                  </Box>
                  <Typography className={Styles.AmountTitle}>
                    Investment Amount
                  </Typography>
                  <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label"></FormLabel>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue="All"
                      name="radio-buttons-group"
                      onChange={(e) => setBasketCost(e.target.value)}
                    >
                      <FormControlLabel
                        value="All"
                        control={<Radio />}
                        label="All"
                      />
                      <FormControlLabel
                        value="Less Than $50"
                        control={<Radio />}
                        label="Less Than $50"
                      />
                      <FormControlLabel
                        value="Less Than $150"
                        control={<Radio />}
                        label="Less Than $150"
                      />
                      <FormControlLabel
                        value="Less Than $250"
                        control={<Radio />}
                        label="Less Than $250"
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

// LoginPage.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Explore;
