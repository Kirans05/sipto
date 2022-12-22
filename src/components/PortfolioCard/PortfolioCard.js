import {
  Divider,
  Menu,
  MenuItem,
  TableCell,
  TableRow,
  Typography
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const PortfolioCard = ({ item, index, Styles, optionClicked }) => {
  const [showMore, setShowMore] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (option) => {
    optionClicked(option, item);
    setAnchorEl(null);
  };

  return (
    <>
      <Box
        className={Styles.portfolioCardMainBox}
        onMouseEnter={() => setShowMore(true)}
        onMouseLeave={() => setShowMore(false)}
        onClick={handleClick}
      >
        <Box className={Styles.portfolioCardLeftPart}>
          <Typography className={Styles.coindId}>{item.coinid}</Typography>
          <Typography className={Styles.units}>
            units - {item.units_purchase}
          </Typography>
        </Box>
        <Box className={Styles.portfolioCardRightPart}>
          <Typography className={Styles.totalPrice}>
            ${item.price_purchased}
          </Typography>
          <Typography className={Styles.purchaseDate}>
            {new Date(item.created_at).toString().substring(0, 24)}
          </Typography>
        </Box>
        <MoreVertIcon
          className={Styles.moreOptions}
          // onMouseEnter={handleClick}
          // onMouseLeave={handleClose}
          // onClick={handleClick}
          sx={{ display: showMore ? 'flex' : 'none' }}
        />
      </Box>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose('No Option')}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
      >
        <MenuItem onClick={() => handleClose('buy')}>Buy</MenuItem>
        <MenuItem onClick={() => handleClose('sell')}>Sell</MenuItem>
      </Menu>
      <Divider className={Styles.divider} />
    </>
  );
};

export default PortfolioCard;
