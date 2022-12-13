import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import EjectIcon from '@mui/icons-material/Eject';
import Link from 'next/link';

const TrendingBasketCard = ({ Styles, item }) => {
  const [changeTitleColor, setChangeTitleColor] = useState(false);

  return (
    <Link href={`/SingleBasket/${item.id}`}>
      <Box
        className={Styles.trendingBasketCard1}
        onMouseEnter={() => setChangeTitleColor(true)}
        onMouseLeave={() => setChangeTitleColor(false)}
      >
        <Box
          component={'img'}
          src={item.image.small}
          alt={'basket Image'}
          className={Styles.trendingBasketCardImage}
        />
        <Box className={Styles.basketCardSecondPart}>
          <Typography
            className={Styles.cardTitle}
            sx={{
              color: changeTitleColor ? 'rgb(255,207,99)' : 'rgb(196,189,175)'
            }}
          >
            {item.name}
          </Typography>
          <Typography className={Styles.trendingTypography}>
            {item.description.short}
          </Typography>
          <Box className={Styles.basketImagesBox}>
            {item.constituents.map((list, index) => {
              if (index < 4) {
                return (
                  <Box
                    key={index}
                    component={'img'}
                    className={Styles.basketAssestsImage}
                    src={list.crypto.image.thumb}
                  />
                );
              }
            })}
            &nbsp;
            <Typography>& {item.constituents_count - 4} more</Typography>
          </Box>
          <Box className={Styles.investmentAndReturnBox}>
            <Box className={Styles.investmentBox}>
              <Typography className={Styles.trendingTypography}>
                Minimum Investment
              </Typography>
              <Typography className={Styles.trendingTypography}>
                $ {item.min_investment.amount}
              </Typography>
            </Box>
            <Box className={Styles.returnBox}>
              <Typography className={Styles.trendingTypography}>
                3Y CAGR
              </Typography>
              <Typography
                sx={{ display: 'flex', alignItems: 'center' }}
                className={Styles.trendingTypography}
              >
                <EjectIcon sx={{ color: 'rgb(40,247,159)' }} />
                {item.returns.annualized['3Y']}%
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Link>
  );
};

export default TrendingBasketCard;
