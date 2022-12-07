import React from "react";
import { Box, TableCell, TableRow, Typography } from "@mui/material";
import { useRouter } from "next/router";

const CoinCard = ({ item, index, Styles }) => {
  const router = useRouter();

  const CoinClicked = () => {
    router.push(`IndividualAsset/${item.id}`);
  };

  return (
    <Box className={Styles.coinCardMainBox}>
      <Box className={Styles.coinCardLeftPart} onClick={CoinClicked}>
        <Box component={"img"} src={item.image} width={30} />
        <Typography className={Styles.coinDetailsTypography}>{item.name}</Typography>
      </Box>
      <Box className={Styles.coindCardRightPart}>
        <Box className={Styles.market_cap}>
          <Typography className={Styles.coinDetailsTypography}>Market Cap</Typography>
          <Typography className={Styles.coinDetailsTypography}>{item.market_cap}</Typography>
        </Box>
        <Box className={Styles.total_volume}>
          <Typography className={Styles.coinDetailsTypography}>Volume</Typography>
          <Typography className={Styles.coinDetailsTypography}>{item.total_volume}</Typography>
        </Box>
        <Box className={Styles.current_price}>
          <Typography className={Styles.coinDetailsTypography}>Price</Typography>
          <Typography className={Styles.coinDetailsTypography}>${item.current_price}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CoinCard;
