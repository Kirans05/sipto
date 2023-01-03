import { Alert, Box, Snackbar, TextField, Typography } from '@mui/material';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import Header from '../Component/Header/Header';
import Sidebar from '../Component/Siderbar/Sidebar';
import Styles from '../Styles/Profile.module.css';
import supabase from "../src/Config/supabaseClient"
import { useRouter } from 'next/router';
import MuiAlert from '@mui/material/Alert';
import axios from "axios"

const Profile = () => {

    const router = useRouter()
    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
      });
    const [snackBarMsg, setSnackBarMsg] = useState('');
    const [snackBarColor, setSnackBarColor] = useState('success');
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [reRender, setRerender] = useState(false)
    const [userId, setUserId] = useState("")
    const [kycVerified, setKycVerified] = useState(false)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")

    const handleSnackBarClick = () => {
      setSnackBarOpen(true);
    };
  
    const handleSnackBarClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setSnackBarOpen(false);
    };

    const [userDetails, setUserDetails] = useState({
        first_name:"" ,
        last_name:"",
        phone_number:""
    })


    const fetchUSerDetails = async (userId) => {
        try{
            let response = await supabase
                .from("profiles")
                .select("first_name,last_name,phone_number,kyc_verified")
                .eq("id",userId)

            if(response.status == 200){
                setUserDetails({...userDetails, first_name:response.data[0].first_name, last_name:response.data[0].last_name, phone_number:response.data[0].phone_number})
                setKycVerified(response.data[0].kyc_verified)
                setFirstName(response.data[0].first_name)
                setLastName(response.data[0].last_name)
            }
        }catch(err){

        }
    }


    const changeHandler = (e) => {
        setUserDetails({...userDetails, [e.target.name] : e.target.value})
    }


    const kycVerificationHandler = async () => {
      let getDetails = {
        url: 'https://637cac1f16c1b892ebbb6fe6.mockapi.io/userData',
        method: 'GET'
      };
      let response = await axios(getDetails);
      let { data } = response;
      let filterItem = data.filter((item) => item.userKycId == userId);
      if (filterItem.length == 0) {
        let postDetails = {
          url: 'https://637cac1f16c1b892ebbb6fe6.mockapi.io/userData',
          method: 'POST',
          data: {
            userKycId: userId
          }
        };
        let postResponse = await axios(postDetails);
        if (postResponse.statusText == 'Created') {
          let supabaseResponse = await supabase
            .from('profiles')
            .update([{ kyc_verified: true }])
            .eq('id', userId);
          if (supabaseResponse.status == 204) {
            setRerender(!reRender);
          }
        }
      }
    }


    const saveHandler = async () => {
        try{
            const updateResponse = await supabase
                .from('profiles')
                .update(userDetails)
                .eq('id', userId)


            if(updateResponse.status == 204){
                handleSnackBarClick();
                setSnackBarColor('success');
                setSnackBarMsg('Successfully updated Profile');
                setRerender(!reRender)
            }

            if(updateResponse.error){
                handleSnackBarClick();
                setSnackBarColor('error');
                setSnackBarMsg('Unable To Update Profile Try Again Later');
            }
        }catch(serr){

        }
    }


    useEffect(() => {
        let user = localStorage.getItem("sb-ziaxsvytbaahgjrompdd-auth-token")
        if(user == null){
            router.push("LoginPage")
        }else{
            setUserId(JSON.parse(localStorage.getItem("sb-ziaxsvytbaahgjrompdd-auth-token")).user.id)
            fetchUSerDetails(JSON.parse(localStorage.getItem("sb-ziaxsvytbaahgjrompdd-auth-token")).user.id)
        }
    },[reRender])




  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <Box className={Styles.simpleMainBox}>
        <Sidebar />
        <Box className={Styles.headerAndMainCompo}>
          <Header />
          <Box className={Styles.ProfilePageMainBox}>
            <Box className={Styles.profileMainBox}>
                  <Typography className={Styles.welcomeTypo}>Welcome {firstName} {lastName}</Typography>
              <Box className={Styles.firstNameBox}>
                  <Typography>First Name</Typography>
                  <TextField
                  id="outlined-basic"
                  label="Outlined"
                  variant="outlined"
                  value={userDetails.first_name}
                  onChange={changeHandler}
                  name="first_name"
                  />
              </Box>
              <Box className={Styles.SecondNameBox}>
                  <Typography>Last Name</Typography>
                  <TextField
                  id="outlined-basic"
                  label="Outlined"
                  variant="outlined"
                  value={userDetails.last_name}
                  onChange={changeHandler}
                  name="last_name"
                  />
              </Box>
              <Box className={Styles.phoneNumberBox}>
                  <Typography>Phone Number</Typography>
                  <TextField
                  id="outlined-basic"
                  label="Outlined"
                  variant="outlined"
                  type={"number"}
                  value={userDetails.phone_number}
                  onChange={changeHandler}
                  name="phone_number"
                  />
              </Box>
              <button onClick={saveHandler} className={Styles.saveButton}>Save Details</button>
            </Box>
            <Box className={Styles.kycDetailsBox}>
              <Typography>KYC Verified</Typography>
              <Box>
                {
                  kycVerified == false ?
                  <Box>
                    <Typography>Not Verified</Typography>
                    <Typography className={Styles.kycVerifyButton} onClick={kycVerificationHandler}>Verifiy Now</Typography>
                  </Box>
                  : <Typography>Verified</Typography>
                }
              </Box>
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
            sx={{ width: '100%' }}
          >
            {snackBarMsg}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default Profile;
