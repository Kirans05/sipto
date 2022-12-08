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
import Styles from "../Styles/FundPAge.module.css"
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MessageIcon from '@mui/icons-material/Message';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MuiAlert from "@mui/material/Alert";
import {useRouter} from "next/router"
import supabase from '../src/Config/supabaseClient';
import Header from '../Component/Header/Header';
import Sidebar from '../Component/Siderbar/Sidebar';


const FundPage = () => {

  const router = useRouter();
  const [fetchData, setFetchData] = useState(false)
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const [userId, setUserId] = useState("");
  const [inputValue, setInputValue] = useState({
    type: "credit",
    from: "null",
    to: "null",
    amount:"",
    message:""
  });

  const changeHandler = (e) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value });
  };

  const [errorMsg, setErrorMsg] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState("");
  const [snackBarColor, setSnackBarColor] = useState("success");

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
    if (
      inputValue.message == "" ||
      inputValue.amount == ""
    ) {
      setErrorMsg("Please Fill All Feilds");
      setTimeout(() => {
        setErrorMsg("");
      }, 4000);
      return;
    }
    try {
      setFetchData(true)
      let response = await supabase.rpc("update_wallet_balance", {
        amount: inputValue.amount,
      });
      if (response.data == true) {
        try {
          let resp = await supabase.rpc("update_transaction_details", {
            amount: inputValue.amount,
            sender: inputValue.from,
            receiver: inputValue.to,
            message: inputValue.message,
            id: userId,
            type: "credit",
          });
          if (resp.status == 200) {
            handleSnackBarClick();
            setSnackBarColor("success");
            setSnackBarMsg("Successfully added balance");
          } else {
            handleSnackBarClick();
            snackBarOpen(true);
            setSnackBarColor("error");
            setSnackBarMsg("Internal Server Problem");
          }
          setFetchData(false)
          setTimeout(() => {
            // router.push("Dashboard")
          }, 3000)
        } catch (err) {}
      }
    } catch (err) {}
  };

  useEffect(() => {
    let { user } = JSON.parse(
      localStorage.getItem("sb-ziaxsvytbaahgjrompdd-auth-token")
    );
    setUserId(user.id);
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
        <Box className={Styles.fundPageBox}>
        <Typography className={Styles.title}>Add Fund</Typography>
        <TextField
        className={Styles.inputFeilds}
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
        <TextField
        className={Styles.inputFeilds}
          variant="outlined"
          label="message"
          type="text"
          name="message"
          value={inputValue.message}
          onChange={(e) => changeHandler(e)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MessageIcon />
              </InputAdornment>
            )
          }}
        />
        <button className={Styles.fundPageBtn} onClick={submitHandler}>
          <AddCircleOutlineIcon /> Add Fund
        </button>
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
      </Box>
      </Box>
    </Box>
      
    </>
  );
};

// FundPage.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default FundPage;
