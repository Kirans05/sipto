import React from 'react';
import Styles from '../Styles/Simple.module.css';
import { Box, Typography } from '@mui/material';
import Header from '../Component/Header/Header';
import Sidebar from '../Component/Siderbar/Sidebar';

const Simple = () => {
  return (
    <Box className={Styles.simpleMainBox}>
      <Sidebar />
      <Box className={Styles.headerAndMainCompo}>
        <Header />
        
      </Box>
    </Box>
  );
};

export default Simple;
