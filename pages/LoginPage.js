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
import Styles from "../Styles/LoginPage.module.css"
import supabase from '../src/Config/supabaseClient';
import {useRouter} from "next/router"

const LoginPage = () => {


  const router = useRouter()
  const [fetchData, setFetchData] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [inputValue, setInputValue] = useState({
    email: '',
    password: '',
    showPassword: false
  });

  const changeHandler = (e) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value });
  };

  const submitHandler = async () => {
    if (inputValue.password == '' || inputValue.email == '') {
      setErrorMsg("Please Fill All The Fields");
      setTimeout(() => {
        setErrorMsg("");
      }, 4000);
      return;
    }

    try{
      setFetchData(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: inputValue.email,
        password: inputValue.password,
      });

      if (error) {
        console.log(error)
        setFetchData(false)
        setErrorMsg("Invalid login credentials");
        setTimeout(() => {
          setErrorMsg("");
        }, 4000);
        return;
      }
  
      if (data.session) {
        setFetchData(false)
        router.push("/dashboards/tasks");
        // sb-rjbbcbogvcyfgacrosge-auth-token
      }
    }catch(err){

    }
    
  };


  return (
    <>
      <Head>
        <title>LoginPage</title>
      </Head>
      <Box className={Styles.loginPageBox}>
        <Typography className={Styles.welcomeBack}>Hi, Welcome Back</Typography>
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

        <FormControl  variant="outlined" className={Styles.emailTextFeild}>
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={inputValue.showPassword ? 'text' : 'password'}
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
                      showPassword: !inputValue.showPassword
                    })
                  }
                  edge="end"
                >
                  {inputValue.showPassword ? <VisibilityOff /> : <Visibility />}
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
        <button className={Styles.signInBtn} onClick={submitHandler}>
          {
            fetchData == false ? "Sign In" 
            : <CircularProgress color='warning' size={"30px"} />
          }
        </button>
        <Typography className={Styles.errorMsg}>{errorMsg}</Typography>
      </Box>
    </>
  );
};

LoginPage.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default LoginPage;
