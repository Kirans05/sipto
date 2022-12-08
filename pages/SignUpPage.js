import { useTheme } from '@emotion/react';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  styled,
  TextField,
  Typography
} from '@mui/material';
import Head from 'next/head';
import React, { useState } from 'react';
import SidebarLayout from 'src/layouts/SidebarLayout';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import KeyIcon from '@mui/icons-material/Key';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Styles from "../Styles/Signup.module.css"
import supabase from '../src/Config/supabaseClient';
import Header from '../Component/Header/Header';
import Sidebar from '../Component/Siderbar/Sidebar';

const LoginPage = () => {

  
  const [errorMsg, setErrorMsg] = useState("")
  const [fetchData, setFetchData] = useState(false)
  const [inputValue, setInputValue] = useState({
    email: '',
    password: '',
    confirmPassword:"",
    showPassword1: false,
    showPassword2: false
  });

  const changeHandler = (e) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value });
  };

  const submitHandler = async () => {
    if (inputValue.password == '' || inputValue.email == '' || inputValue.confirmPassword == "") {
      setErrorMsg("Please Fill All The Fields");
      setTimeout(() => {
        setErrorMsg("");
      }, 4000);
      return;
    }

    if (inputValue.password != inputValue.confirmPassword) {
      setErrorMsg("Passwors Does not Match");
      setTimeout(() => {
        setErrorMsg("");
      }, 4000);
      return;
    }

    try{
      setFetchData(true)
      const { data, error } = await supabase.auth.signUp({
        email: inputValue.email,
        password: inputValue.password,
      });


      if (error) {
        setFetchData(false)
        setErrorMsg("Invalid login credentials");
        setTimeout(() => {
          setErrorMsg("");
        }, 4000);
        return;
      }
  
      if (data.session == null) {
        setFetchData(false)
        setErrorMsg("Please Check your Email for Confimation link");
        setTimeout(() => {
          setErrorMsg("");
        }, 4000);
        return;
      }
    }catch(err){

    }
  };


  return (
    <>
      <Head>
        <title>LoginPage</title>
      </Head>
      <Box className={Styles.simpleMainBox}>
      <Sidebar />
      <Box className={Styles.headerAndMainCompo}>
        <Header />
        <Box className={Styles.SignupPageBox}>
        <Typography className={Styles.Signup}>Sign up</Typography>
        <Typography className={Styles.credentials}>Enter your credentials to continue</Typography>
        <TextField
          className={Styles.emailTextFeild}
          variant="outlined"
          label="Email"
          type="text"
          name="email"
          value={inputValue.email}
          onChange={(e) => changeHandler(e)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MailOutlineIcon />
              </InputAdornment>
            )
          }}
        />

        <FormControl className={Styles.emailTextFeild} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={inputValue.showPassword1 ? 'text' : 'password'}
            value={inputValue.password}
            onChange={changeHandler}
            name="password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() =>
                    setInputValue({
                      ...inputValue,
                      showPassword1: !inputValue.showPassword1
                    })
                  }
                  edge="end"
                >
                  {inputValue.showPassword1 ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            startAdornment={
              <InputAdornment position="start">
                <KeyIcon />
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        <FormControl className={Styles.emailTextFeild} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Confirm Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={inputValue.showPassword2 ? 'text' : 'password'}
            value={inputValue.confirmPassword}
            onChange={changeHandler}
            name="confirmPassword"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() =>
                    setInputValue({
                      ...inputValue,
                      showPassword2: !inputValue.showPassword2
                    })
                  }
                  edge="end"
                >
                  {inputValue.showPassword2 ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            startAdornment={
              <InputAdornment position="start">
                <KeyIcon />
              </InputAdornment>
            }
            label="Confirm Password"
          />
        </FormControl>
        <button className={Styles.signInBtn} onClick={submitHandler}>
          {
            fetchData == false ? "Register" 
            : <CircularProgress color='warning' size={"30px"} />
          }
        </button>
        <Typography className={Styles.errorMsg}>{errorMsg}</Typography>
      </Box>
      </Box>
    </Box>
      
    </>
  );
};

// LoginPage.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default LoginPage;
