// import React from "react";
// import { Box, TableCell, TableRow, Typography } from "@mui/material";
// import { useRouter } from "next/router";

// const CoinCard = ({ item, index, Styles }) => {
//   const router = useRouter();

//   const CoinClicked = () => {
//     router.push(`IndividualAsset/${item.id}`);
//   };


//   console.log(JSON.parse(item.detail_image))

//   return (
//     <Box className={Styles.coinCardMainBox}>
//       <Box className={Styles.coinCardLeftPart} onClick={CoinClicked}>
//         <Box component={"img"} src={JSON.parse(item.detail_image).large} width={30} />
//         <Typography className={Styles.coinDetailsTypography}>{item.name}</Typography>
//       </Box>
//       <Box className={Styles.coindCardRightPart}>
//         <Box className={Styles.market_cap}>
//           <Typography className={Styles.coinDetailsTypography}>Market Cap</Typography>
//           <Typography className={Styles.coinDetailsTypography}>{item.market_cap}</Typography>
//         </Box>
//         <Box className={Styles.total_volume}>
//           <Typography className={Styles.coinDetailsTypography}>Volume</Typography>
//           <Typography className={Styles.coinDetailsTypography}>{item.total_volume}</Typography>
//         </Box>
//         <Box className={Styles.current_price}>
//           <Typography className={Styles.coinDetailsTypography}>Price</Typography>
//           <Typography className={Styles.coinDetailsTypography}>${item.current_price}</Typography>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default CoinCard;








import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'

const CoinCard = ({Styles, item}) => {

  const router = useRouter()
  const coinClicked = () => {
    router.push(`AssestsIndividual/${item.id}`)
  }
  
  return (
    <Box className={Styles.coinCardMainBox} onClick={coinClicked}>
      <Box className={Styles.leftPart}>
      <Box
                  component={'img'}
                  src={
                    'https://assets.coingecko.com/coins/images/325/small/Tether.png?1668148663'
                  }
                  alt={'assest Image'}
                  className={Styles.assestImage}
                />
                <Box >
      <Typography>{item.ticker}</Typography>
      <Typography>{item.name}</Typography>
      </Box>
      </Box>
      
      <Box className={Styles.rightPart}>
        <Typography>Type - {item.type}</Typography>
        <Typography>Price - {item.price}</Typography>
      </Box>
    </Box>
  )
}

export default CoinCard
