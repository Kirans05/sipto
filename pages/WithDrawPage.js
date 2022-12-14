import { useTheme } from '@emotion/react';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Snackbar,
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
import Styles from "../Styles/WithDrawPage.module.css"
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MessageIcon from '@mui/icons-material/Message';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {useRouter} from "next/router"
import supabase from "../src/Config/supabaseClient"
import MuiAlert from "@mui/material/Alert";
import Header from '../Component/Header/Header';
import Sidebar from '../Component/Siderbar/Sidebar';


const WithDrawPage = () => {
  const router = useRouter();
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const [userDetails, setUserDetails] = useState("");
  const [inputValue, setInputValue] = useState({
    type: "debit",
    from: "null",
    to: "null",
    message: "withdraw",
    amount: "",
  });

  const changeHandler = (e) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value });
  };

  const [errorMsg, setErrorMsg] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState("");
  const [snackBarColor, setSnackBarColor] = useState("success");
  const [userData, setUserData] = useState("")

  const handleSnackBarClick = () => {
    setSnackBarOpen(true);
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackBarOpen(false);
  };

  const submitHandler = async () => {
    if(userData.wallet_balance <= 0){
      setSnackBarOpen(true);
      setSnackBarMsg("Insufficient balance to withdraw");
      setSnackBarColor("warning");
      return
    }


    if(inputValue.amount > userData.wallet_balance){
      setSnackBarOpen(true);
      setSnackBarMsg("Insufficient balance to withdraw");
      setSnackBarColor("warning");
      return
    }


    try {
      let supabaseResponse = await supabase.rpc("decrement_balance", {
        amount: inputValue.amount,
      });
      if (supabaseResponse.data == true) {
        try {
          let transactionResponse = await supabase.rpc(
            "update_transaction_details",
            {
              amount: inputValue.amount,
              sender: inputValue.from,
              receiver: inputValue.to,
              message: inputValue.message,
              id: userDetails.id,
              type: "debit",
            }
          );

          if(transactionResponse.error){
            setSnackBarOpen(true);
            setSnackBarMsg("unable to complete Transaction.");
            setSnackBarColor("warning");
          }

          if (transactionResponse.data == true) {
            setSnackBarOpen(true);
            setSnackBarMsg("Successfully money withdrawed");
            setSnackBarColor("success");
          } 
            

          setTimeout(() => {
            // router.push("Dashboard")
          }, 3000)
        } catch (err) {}
      }
    } catch (err) {}
  };

  const fetchUserDetails = async (userId) => {
    try{
      let userResponse = await supabase
        .from("profiles")
        .select("*")
        .eq("id",userId)

      console.log(userResponse)

      if(userResponse.error){

      }


      if(userResponse.status == 200){
        setUserData(userResponse.data[0])
      }
    }catch(err){

    }
  }


  useEffect(() => {
    let user = localStorage.getItem("sb-ziaxsvytbaahgjrompdd-auth-token")
    if(user == null){
      router.push("/LoginPage")
    }else{
      setUserDetails(JSON.parse(user).user)
      fetchUserDetails(JSON.parse(user).user.id)
    }
  }, []);


  return (
    <>
      <Head>
        <title>WithDraw</title>
      </Head>
      <Box className={Styles.simpleMainBox}>
      <Sidebar />
      <Box className={Styles.headerAndMainCompo}>
        <Header />
        <Box className={Styles.withDrawPageBox}>
        <Typography className={Styles.title}>WithDraw</Typography>
        <TextField
        className={Styles.inputFeild}
          variant="outlined"
          label="Money"
          type="number"
          name="amount"
          value={inputValue.amount}
          onChange={(e) => changeHandler(e)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AttachMoneyIcon />
              </InputAdornment>
            )
          }}
        />
        <button className={Styles.withDrawPageBtn} onClick={submitHandler}><RemoveCircleOutlineIcon /> WithDraw</button>
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
          sx={{ width: "100%" }}
        >
          {snackBarMsg}
        </Alert>
      </Snackbar>
    </>
  );
};

// WithDrawPage.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default WithDrawPage;
