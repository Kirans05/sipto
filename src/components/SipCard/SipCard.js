import {
  Box,
  Checkbox,
  Divider,
  Drawer,
  Menu,
  MenuItem,
  TableCell,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import { DesktopDatePicker } from '@mui/x-date-pickers';


const SipCard = ({ Styles, item, deleteSipHandler, editSip }) => {
  let displayDate;
  if (item.frequency == 'monthly') {
    let calender = new Date();
    let date = calender.getDate();
    if (date >= item.date) {
      calender.setMonth(calender.getMonth() + 1);
      displayDate = calender.toString().slice(4, 7);
    } else if (date < item.date) {
      displayDate = calender.toString().slice(4, 7);
    }
  }

  let upcomingWeek;
  if (item.frequency == 'weekly') {
    let calender = new Date();
    for (let i = 0; i < 7; i++) {
      if (
        calender.toString().slice(0, 3).toLowerCase() == item.day.toLowerCase()
      ) {
        upcomingWeek = calender.toDateString();
      }
      calender.setDate(calender.getDate() + 1);
    }
  }

  const [anchorElMenuList, setAnchorElMenuList] = React.useState(null);
  const openMenuList = Boolean(anchorElMenuList);
  const [sipOption, setSipOption] = useState({
    duration:"monthly",
    units:"shares",
    date:"",
    day:"",
    shareQty:0,
    totalAmount:0
  })
  const [anchorElMenuDay, setAnchorElMenuDay] = React.useState(null);
  const openMenuDay = Boolean(anchorElMenuDay);


  const handleClickMenuList = (event) => {
    setAnchorElMenuList(event.currentTarget);
  };
  const handleCloseMenuList = (type) => {
    if (type == 'menu close') {
    } else if (type == 'edit') {
    } else if (type == 'delete') {
      deleteSipHandler(item.sip_table_id);
    }
    setAnchorElMenuList(null);
  };

  const [drawerState, setDrawerState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });


  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setDrawerState({ ...drawerState, [anchor]: open });
    handleCloseMenuList("edit")
  };


  const durationHandler = (e) => {
    setSipOption({...sipOption, duration:e.target.name})
  }

  const sipUnitCHangeHandler = (e) => {
    if(sipOption.units == "shares"){
      setSipOption({...sipOption, units:"SIP Amount"})
    }else{
      setSipOption({...sipOption, units:"shares"})
    }
  }

  const investmentDayHandler = (e) => {
    // console.log(e.target.value)
    // console.log(e.toDateString())
    setSipOption({...sipOption, date:e.toDateString()})
  }

  const handleClickMenuDay = (event) => {
    setAnchorElMenuDay(event.currentTarget);
  };

  const handleCloseMenuDay = (day) => {
    setAnchorElMenuDay(null);
    setSipOption({...sipOption, day})
  };

  const list = (anchor) => {
      return (
        <Box className={Styles.sipDrawer} role="presentation">
          <Box className={Styles.sipDrawerHeading}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography className={Styles.basketTitle}>
                {item.basketName}
              </Typography>
              <ClearIcon
                onClick={toggleDrawer('right', false)}
                sx={{ '&:hover': { cursor: 'pointer' } }}
              />
            </Box>
            <Typography className={Styles.basketPrice}>
              {/* {item.min_investment.amount}{' '} */}
              80
              <span style={{ color: 'rgb(89,170,0)', fontSize: '15px' }}>
                +0.06 (4.41%)
              </span>
            </Typography>
            <Typography className={Styles.sipLogo}>SIP</Typography>
          </Box>
          <Divider sx={{ backgroundColor: 'rgb(174 181 187)' }} />
          <Box className={Styles.sipDrawerBody}>
            <Box className={Styles.drawerBodydFirstPart}>
              <Typography className={Styles.drawerTypography}>
                Buy Every Month
              </Typography>
              <Typography className={Styles.drawerTypographyMonthy}>
                <Checkbox
                  name="monthly"
                  onChange={durationHandler}
                  checked={sipOption.duration == 'monthly' ? true : false}
                />{' '}
                Monthly
              </Typography>
              <Typography className={Styles.drawerTypographyWeekly}>
                <Checkbox
                  name="weekly"
                  onChange={durationHandler}
                  checked={sipOption.duration == 'weekly' ? true : false}
                />{' '}
                Weekly
              </Typography>
              <Typography className={Styles.drawerTypography}>
                Buy Every week
              </Typography>
            </Box>
            <Box className={Styles.drawerBodySecondPart}>
              {sipOption.units == 'shares' ? (
                <Typography>Shares</Typography>
              ) : (
                <Typography>SIP Amount</Typography>
              )}
              {sipOption.units == 'shares' ? (
                <TextField
                  type={'number'}
                  sx={{ width: 120 }}
                  value={sipOption.shareQty}
                  onChange={(e) =>
                    setSipOption({ ...sipOption, shareQty: e.target.value })
                  }
                />
              ) : (
                <Typography
                  className={Styles.shareQty}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  ${' '}
                  <TextField
                    type={'number'}
                    sx={{ width: 120 }}
                    value={sipOption.totalAmount}
                    onChange={(e) =>
                      setSipOption({
                        ...sipOption,
                        totalAmount: e.target.value
                      })
                    }
                  />
                </Typography>
              )}
              <Divider className={Styles.divider} />
              <Typography>
                <Checkbox onChange={sipUnitCHangeHandler} /> Change to{' '}
                {sipOption.units == 'shares' ? 'Amount' : 'Shares'}
              </Typography>
            </Box>
            <Box className={Styles.drawerBodyThirdPart}>
              <Typography>Day of investment</Typography>
              {sipOption.duration == 'monthly' ? (
                // <TextField
                //   onChange={investmentDayHandler}
                //   value={sipOption.date}
                //   id="date"
                //   label="Select"
                //   type="date"
                //   InputLabelProps={{
                //     shrink: true
                //   }}
                //   className={Styles.dayOfInvestment}
                // />
                <DesktopDatePicker
                    label="Date desktop"
                    inputFormat="MM/dd/yyyy"
                    value={sipOption.date}
                    onChange={investmentDayHandler}
                    // onChange={(e) => console.log(e)}
                    renderInput={(params) => <TextField {...params} />}
                    className={Styles.dayOfInvestment}
                    disablePast
                />
              ) : (
                <Typography
                  onClick={handleClickMenuDay}
                  sx={{ '&:hover': { cursor: 'pointer' } }}
                >
                  {sipOption.day == ''
                    ? 'Select'
                    : sipOption.day == 'Not Selected'
                    ? 'Select'
                    : sipOption.day}
                </Typography>
              )}
              <Divider className={Styles.divider} />
              {sipOption.duration == 'monthly' ? (
                <Typography>Every Month</Typography>
              ) : (
                <Typography>Every Week</Typography>
              )}
            </Box>
            <Box className={Styles.drawerBodyFourthPart}>
              <Typography className={Styles.sipWarning}>
                Amount will be deducted from your trading account.
              </Typography>
              <button
                className={Styles.startSipButton}
                style={{
                  backgroundColor:
                    sipOption.duration == 'monthly'
                      ? sipOption.date == ''
                        ? 'rgb(167,171,182)'
                        : 'rgb(89,170,0)'
                      : sipOption.day == ''
                      ? 'rgb(167,171,182)'
                      : sipOption.day == 'Not Selected'
                      ? 'rgb(167,171,182)'
                      : 'rgb(89,170,0)'
                }}
                onClick={EditSipHandler}
              >
                Edit SIP
              </button>
            </Box>
          </Box>
        </Box>



      );
  };


  const EditSipHandler = async () => {
    if(sipOption.duration == "monthly" && sipOption.date == ""){
      alert("Please Select Date")
      return
    }

    if(sipOption.duration == "weekly" && (sipOption.day == "" || sipOption.day == "Not Selected")){
      alert("Please Select Day")
      return
    }

    editSip(sipOption, item.sip_table_id)

    // console.log(sipOption)

    // try{
    //   let dataObj
    //   if(sipOption.duration == "monthly"){
    //     if(sipOption.units == "shares"){
    //       dataObj = {
    //         user_id:userDetails.id,
    //         date:sipOption.date == "" ? "" : Number(sipOption.date.slice(8)),
    //         frequency:sipOption.duration,
    //         invest_type:sipOption.units,
    //         qty:sipOption.shareQty,
    //         status:"Active",
    //         basketName:basketDetails.name,
    //         basket_id:basketDetails.id
    //       }
    //     }else{
    //       dataObj = {
    //         user_id:userDetails.id,
    //         date:sipOption.date == "" ? "" : Number(sipOption.date.slice(8)),
    //         frequency:sipOption.duration,
    //         invest_type:sipOption.units,
    //         amount:sipOption.totalAmount,
    //         status:"Active",
    //         basketName:basketDetails.name,
    //         basket_id:basketDetails.id
    //       }
    //     }
    //   }else{
    //     if(sipOption.units == "shares"){
    //       dataObj = {
    //         user_id:userDetails.id,
    //         day:sipOption.day,
    //         frequency:sipOption.duration,
    //         invest_type:sipOption.units,
    //         qty:sipOption.shareQty,
    //         status:"Active",
    //         basketName:basketDetails.name,
    //         basket_id:basketDetails.id
    //       }
    //     }else{
    //       dataObj = {
    //         user_id:userDetails.id,
    //         day:sipOption.day,
    //         frequency:sipOption.duration,
    //         invest_type:sipOption.units,
    //         amount:sipOption.totalAmount,
    //         status:"Active",
    //         basketName:basketDetails.name,
    //         basket_id:basketDetails.id
    //       }
    //     }
    //   }

    //   let sipResponse = await supabase
    //       .from("sip_table")
    //       .insert([dataObj])
        
    //   if(sipResponse.error){
    //     handleSnackBarClick();
    //     setSnackBarColor('error');
    //     setSnackBarMsg('Error Setting SIP Try Again Later');
    //   }

    //   if(sipResponse.data || sipResponse.status == 201){
    //     handleSnackBarClick();
    //     setSnackBarColor('success');
    //     setSnackBarMsg('SIP Set SuccessFully');
    //   }
    // }catch(err){
    //   console.log(err)
    // }


  }


  return (
    <TableRow hover className={Styles.tableRow}>
      <TableCell align="left" onClick={handleClickMenuList}>
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          noWrap
        >
          {item.basketName}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          noWrap
        >
          1.49 <span style={{ color: 'rgb(101,176,20)' }}>+0.07 (4.93%)</span>
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          noWrap
        >
          {item.frequency.toUpperCase()}
        </Typography>
      </TableCell>
      <TableCell align="left">
        {item.frequency == 'monthly' ? (
          <Typography
            variant="body1"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
            noWrap
          >
            {displayDate} {item.date}
          </Typography>
        ) : (
          <Typography
            variant="body1"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
            noWrap
          >
            {/* {item.day} */}
            {upcomingWeek}
          </Typography>
        )}
      </TableCell>
      <TableCell align="left">
        {item.invest_type == 'shares' ? (
          <Typography
            variant="body1"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
            noWrap
          >
            qty - {item.qty}
          </Typography>
        ) : (
          <Typography
            variant="body1"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
            noWrap
          >
            ${item.amount}
          </Typography>
        )}
      </TableCell>
      <Drawer
            anchor={"right"}
            open={drawerState["right"]}
            onClose={toggleDrawer("right", false)}
          >
            {list("right")}
          </Drawer>

          <Menu
          id="basic-menu"
          anchorEl={anchorElMenuDay}
          open={openMenuDay}
          onClose={() => handleCloseMenuDay("Not Selected")}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
      >
        <MenuItem onClick={() => handleCloseMenuDay("Mon")}>Mon</MenuItem>
        <MenuItem onClick={() => handleCloseMenuDay("Tue")}>Tue</MenuItem>
        <MenuItem onClick={() => handleCloseMenuDay("Wed")}>Wed</MenuItem>
        <MenuItem onClick={() => handleCloseMenuDay("Thu")}>Thu</MenuItem>
        <MenuItem onClick={() => handleCloseMenuDay("Fri")}>Fri</MenuItem>
      </Menu>

      <Menu
        id="basic-menu"
        anchorEl={anchorElMenuList}
        open={openMenuList}
        onClose={() => handleCloseMenuList('menu close')}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
      >
        <MenuItem onClick={toggleDrawer("right", true)}>Edit</MenuItem>
        <MenuItem onClick={() => handleCloseMenuList('delete')}>Delete</MenuItem>
      </Menu>
    </TableRow>
  );
};

export default SipCard;
