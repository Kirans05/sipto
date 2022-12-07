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

          if (transactionResponse.data == true) {
            setSnackBarOpen(true);
            setSnackBarMsg("Successfully money withdrawed");
            setSnackBarColor("success");
          } else {
            setSnackBarOpen(true);
            setSnackBarMsg("unable to complete Transaction");
            setSnackBarColor("warning");
          }

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
    setUserDetails(user);
  }, []);


  return (
    <>
      <Head>
        <title>WithDraw</title>
      </Head>
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

WithDrawPage.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default WithDrawPage;
