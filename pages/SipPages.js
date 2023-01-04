import {
  Alert,
  Box,
  Skeleton,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import Header from '../Component/Header/Header';
import Sidebar from '../Component/Siderbar/Sidebar';
import Styles from '../Styles/SipPage.module.css';
import supabase from '../src/Config/supabaseClient';
import SipCard from '../src/components/SipCard/SipCard';
import MuiAlert from '@mui/material/Alert';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'




const SipPage = () => {
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const [dataFetched, setDataFetched] = useState(false);
  const [sipData, setSipData] = useState([]);
  const [userDetails, setUserDetails] = useState('');
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [reRender, setRerender] = useState(true);
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

  const fetchSipData = async (userData) => {
    try {
      let sipResponse = await supabase
        .from('sip_table')
        .select('*')
        .eq('user_id', userData.id);

      if (sipResponse.status == 200) {
        setSipData(sipResponse.data);
        setDataFetched(true);
      }
    } catch (err) {}
  };

  const deleteSipHandler = async (itemId) => {
    try {
      const sipResponse = await supabase
        .from('sip_table')
        .delete()
        .eq('sip_table_id', itemId);

      if (sipResponse.error) {
        handleSnackBarClick();
        setSnackBarColor('error');
        setSnackBarMsg('Internal Server Problem');
      }
      if (sipResponse.status == 204) {
        handleSnackBarClick();
        setSnackBarColor('success');
        setSnackBarMsg('Successfully SIP Deleted');
        setRerender(!reRender);
      }
    } catch (err) {}
  };


  const editSip = async (obj, id) => {

    if(obj.duration == "weekly" && obj.units == "shares" && obj.shareQty <= 0){
      handleSnackBarClick();
      setSnackBarColor('error');
      setSnackBarMsg('Please Enter Quantity More than 0');
      return
    }else if(obj.duration == "weekly" && obj.units == "SIP Amount" && obj.totalAmount <= 0){
      handleSnackBarClick();
      setSnackBarColor('error');
      setSnackBarMsg('Please Enter Amount More than 0');
      return
    }else if(obj.duration == "monthly" && obj.units == "shares" && obj.shareQty <= 0){
      handleSnackBarClick();
      setSnackBarColor('error');
      setSnackBarMsg('Please Enter Quantity More than 0');
      return
    }else if(obj.duration == "monthly" && obj.units == "SIP Amount" && obj.totalAmount <= 0){
      handleSnackBarClick();
      setSnackBarColor('error');
      setSnackBarMsg('Please Enter Amount More than 0');
      return
    }
    let dataObj 
    
    if(obj.duration == "weekly"){
      if(obj.units == "shares"){
        dataObj = {
          date:null,
          amount:null,
          day:obj.day,
          frequency:"weekly",
          invest_type:"shares",
          qty:obj.shareQty,
        }
      }else{
        dataObj = {
          date:null,
          amount:obj.totalAmount,
          day:obj.day,
          frequency:"weekly",
          invest_type:"SIP Amount",
          qty:null,
        }
      }
    }else{
      if(obj.units == "shares"){
        dataObj = {
          date:obj.date == "" ? "" : Number(obj.date.slice(8,10)),
          amount:null,
          day:null,
          frequency:"monthly",
          invest_type:"shares",
          qty:obj.shareQty,
        }
      }else{
        dataObj = {
          date:obj.date == "" ? "" : Number(obj.date.slice(8, 10)),
          amount:obj.totalAmount,
          day:null,
          frequency:"monthly",
          invest_type:"SIP Amount",
          qty:null,
        }
      }
    }

    try{
      const sipResponse = await supabase
          .from('sip_table')
          .update(dataObj)
          .eq('sip_table_id', id)


          if (sipResponse.error) {
            handleSnackBarClick();
            setSnackBarColor('error');
            setSnackBarMsg('Internal Server Problem');
          }
          if (sipResponse.status == 204) {
            handleSnackBarClick();
            setSnackBarColor('success');
            setSnackBarMsg('Successfully SIP Deleted');
            setRerender(!reRender);
          }
    }catch(err){

    }
  }

  

  useEffect(() => {
    setUserDetails(JSON.parse(localStorage.getItem('userData')));
  }, []);

  useEffect(() => {
    fetchSipData(JSON.parse(localStorage.getItem('userData')));
  }, [reRender]);

  return (
    <>
     <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Head>
        <title>SipPage</title>
      </Head>
      <Box className={Styles.simpleMainBox}>
        <Sidebar />
        <Box className={Styles.headerAndMainCompo}>
          <Header />
          <Box className={Styles.mainBox}>
            {dataFetched == false ? (
              <Box className={Styles.skeletonBox}>
                {[1, 2, 3, 4, 5, 6, 7].map((item, index) => {
                  return (
                    <Skeleton
                      key={index}
                      variant="rectangular"
                      className={Styles.Skeleton}
                    />
                  );
                })}
              </Box>
            ) : sipData.length == 0 ? (
              <Typography sx={{ textAlign: 'center' }}>No SIP Set</Typography>
            ) : (
              // : <Box className={Styles.sipMainBox}>
              //     <Box>
              //         <Typography>Name</Typography>
              //         <Typography>Current Price</Typography>
              //         <Typography>SIP Type</Typography>
              //         <Typography>SIP Date/Day</Typography>
              //         <Typography>Qty/Amount</Typography>
              //     </Box>
              //     <Box>
              //         {
              //             sipData.map((item,index) => {
              //                 return <SipCard key={index} Styles={Styles} item={item}/>
              //             })
              //         }
              //     </Box>
              // </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Name</TableCell>
                      <TableCell align="center">Current Price</TableCell>
                      <TableCell align="left">SIP Type</TableCell>
                      <TableCell align="left">SIP Due Date/Day</TableCell>
                      <TableCell align="left">Qty/Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sipData.map((item, index) => {
                      return (
                        <SipCard
                          Styles={Styles}
                          key={index}
                          item={item}
                          deleteSipHandler={deleteSipHandler}
                          editSip={editSip}
                        />
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
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
      </LocalizationProvider>
    </>
  );
};

export default SipPage;
