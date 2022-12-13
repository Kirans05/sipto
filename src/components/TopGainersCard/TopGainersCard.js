import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import EjectIcon from '@mui/icons-material/Eject';
import Link from 'next/link';

const TopGainersCard = ({ Styles, item }) => {
  const [changeTitleColor, setChangeTitleColor] = useState(false);

  return (
    <Link href={`/SingleBasket/${item.id}`}>
      <Box
        className={Styles.topGainersCardBox}
        onMouseEnter={() => setChangeTitleColor(true)}
        onMouseLeave={() => setChangeTitleColor(false)}
      >
        <Box className={Styles.topGainersCardFirstHalf}>
          <Box className={Styles.topGainerCardImageBox}>
            {
              item.constituents.map((image,index) => {
                if(index < 4){
                  let topGainersCardImages = `topGainersCardImages${index+1}`
                  return <Box
                  key={index}
              component={'img'}
              className={Styles.topGainersCardImages}
              src={image.crypto.image.thumb}
            />
                }
              })
            }
            &nbsp;
            <Typography>& {item.constituents.length - 4} more</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography className={Styles.typographySTyles}>3Y CAGR</Typography>
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
              <EjectIcon
                sx={{ color: item.returns.annualized["3Y"].toString().startsWith("-") ? "rgb(118,44,58)" :'rgb(40,247,159)' }}
                className={Styles.typographySTyles}
              />
              {item.returns.annualized["3Y"]}%
            </Typography>
          </Box>
        </Box>
        <Box className={Styles.topGainersCardSecondHalf}>
          <Typography
            className={Styles.typographySTyles}
            sx={{
              color: changeTitleColor ? 'rgb(255,207,99)' : 'rgb(196,189,175)'
            }}
          >
            {item.name}
          </Typography>
          <Box>
            <Typography>Minimm Investment</Typography>
            <Typography className={Styles.typographySTyles}>
              $ {item.min_investment.amount}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Link>
  );
};

export default TopGainersCard;
