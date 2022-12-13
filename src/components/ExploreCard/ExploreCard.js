import { Box, TextField, Typography } from '@mui/material';
import Link from 'next/link';
import React, { useState } from 'react';

const ExploreCard = ({ Styles, item }) => {
  const [changeTitleColor, setChangeTitleColor] = useState(false);

  return (
    <Link href={`/SingleBasket/${item.id}`}>
    <Box
      className={Styles.ExploreCardMainBox}
      onMouseEnter={() => setChangeTitleColor(true)}
      onMouseLeave={() => setChangeTitleColor(false)}
    >
      <Box
        component={'img'}
        src={item.image.small}
        alt="image"
        className={Styles.exploreCardImages}
      />
      <Box className={Styles.exporeCardFirstPart}>
        <Typography
          sx={{
            color: changeTitleColor ? 'rgb(255,207,99)' : 'white'
          }}
          className={Styles.exploreCardTitle}
        >
          {item.name}
        </Typography>
        <Typography className={Styles.description}>
          {item.description.short}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between',alignItems:"center" }}>
          <Typography className={Styles.investment}>Investment</Typography>
          <Typography className={Styles.risk} sx={{backgroundColor : item.risk == "high" ? "rgb(242,55,83)" : item.risk == "low" ? "rgb(36,245,164)" : "rgb(251,255,40)"}}>{item.risk} Risk</Typography>
        </Box>
      </Box>
      <Box className={Styles.exporeCardSecondPart}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography className={Styles.minAmount}>Min Amount</Typography>
          <Typography className={Styles.amount}>$ {item.min_investment.amount}</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography className={Styles.sixMonth}>6M</Typography>
          <Typography 
          sx={{
            color: item.returns.annualized['6M']
              .toString()
              .startsWith('-')
              ? 'red'
              : 'rgb(39,239,157)'
          }}
          >{item.returns.annualized["6M"]}%</Typography>
          {/* <Typography
            className={Styles.sixMonthVlue}
            sx={{
              color: basketDetails.returns.annualized['6M']
                .toString()
                .startsWith('-')
                ? 'red'
                : 'rgb(39,239,157)'
            }}
          >
            {basketDetails.returns.annualized['6M']}%
          </Typography> */}
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography className={Styles.threeYear}>3Y</Typography>
          <Typography 
          // className={Styles.threeYearValue}
          sx={{
            color: item.returns.annualized['3Y']
              .toString()
              .startsWith('-')
              ? 'red'
              : 'rgb(39,239,157)'
          }}
          >{item.returns.annualized["3Y"]}%</Typography>
        </Box>
      </Box>
      <Box className={Styles.exporeCardThirdPart}>
        {
          item.constituents.map((list,index) => {
            if(index < 4){
              return <Box
              key={index}
              component={'img'}
              alt="image"
              className={Styles.constituentsImage}
              src={list.crypto.image.thumb}
            />
            }
          })
        }
        &nbsp;
        <Typography>& {item.constituents.length - 4} more</Typography>
      </Box>
    </Box>
    </Link>
  );
};

export default ExploreCard;
