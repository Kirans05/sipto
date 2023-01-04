import { useState } from 'react';
import { format } from 'date-fns';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Select,
  MenuItem,
  Typography,
  useTheme,
  CardHeader,
  Skeleton
} from '@mui/material';

import Label from 'src/components/Label';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import Styles from "../../../../Styles/Transaction.module.css"


// const getStatusLabel = (cryptoOrderStatus) => {
//   const map = {
//     failed: {
//       text: 'Failed',
//       color: 'error'
//     },
//     completed: {
//       text: 'Completed',
//       color: 'success'
//     },
//     pending: {
//       text: 'Pending',
//       color: 'warning'
//     }
//   };

//   const { text, color } = map[cryptoOrderStatus];

//   return <Label color={color}>{text}</Label>;
// };

const applyFilters = (cryptoOrders, filters) => {
  return cryptoOrders.filter((cryptoOrder) => {
    let matches = true;

    if (filters.status && cryptoOrder.status !== filters.status) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (cryptoOrders, page, limit) => {
  return cryptoOrders.slice(page * limit, page * limit + limit);
};

const RecentOrdersTable = ({ transactionDetails }) => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [filters, setFilters] = useState({
    status: null
  });

  const statusOptions = [
    {
      id: 'all',
      name: 'All'
    },
    {
      id: 'completed',
      name: 'Completed'
    },
    {
      id: 'pending',
      name: 'Pending'
    },
    {
      id: 'failed',
      name: 'Failed'
    }
  ];

  const handleStatusChange = (e) => {
    let value = null;

    if (e.target.value !== 'all') {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value
    }));
  };

  const handlePageChange = (_event, newPage) => {
    console.log(newPage)
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    console.log(event)
    setLimit(parseInt(event.target.value));
  };

  const filteredtransactionDetails = applyFilters(transactionDetails, filters);
  const paginatedtransactionDetails = applyPagination(
    filteredtransactionDetails,
    page,
    limit
  );
  const theme = useTheme();

  return (
    <Card>
      {/* <CardHeader
        action={
          <Box width={150}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status || 'all'}
                onChange={handleStatusChange}
                label="Status"
                autoWidth
              >
                {statusOptions.map((statusOption) => (
                  <MenuItem key={statusOption.id} value={statusOption.id}>
                    {statusOption.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        }
        title="Recent Orders"
      /> */}
      <Typography className={Styles.transactionTitle}>Recent Transactions</Typography>
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align='left'>Message</TableCell>
              <TableCell align='center'>Transaction ID</TableCell>
              <TableCell align='left'>Type</TableCell>
              <TableCell align='left'>Amount</TableCell>
              <TableCell align='left'>Status</TableCell>
              {/* <TableCell align="right">Actions</TableCell> */}
            </TableRow>
          </TableHead>
          {
            transactionDetails.length == 0 ?
            <TableBody>
            {
              [1,2,3,4,5,6,7,8].map(item => {
                return <TableRow hover >
                <TableCell align='left'>
                <Skeleton
                      variant="rectangular"
                      className={Styles.transactionSkeleton}
                      />
                </TableCell>
                <TableCell align='center'>
                <Skeleton
                      variant="rectangular"
                      className={Styles.transactionSkeleton}
                      />
                </TableCell>
                <TableCell align='left'>
                <Skeleton
                      variant="rectangular"
                      className={Styles.transactionSkeleton}
                      />
                </TableCell>
                <TableCell align='left'>
                <Skeleton
                      variant="rectangular"
                      className={Styles.transactionSkeleton}
                      />
                </TableCell>
                <TableCell align='left'>
                <Skeleton
                      variant="rectangular"
                      className={Styles.transactionSkeleton}
                      />
                </TableCell>
                </TableRow>
              })
            }
            </TableBody>
            : <TableBody>
            {transactionDetails.map((item, index) => {
              return (
                <TableRow hover key={index}>
                  <TableCell align='left'>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                      sx={{color:item.message.endsWith("sell") ? "rgb(224,13,12)" : item.message.endsWith("buy") ? "rgb(41,207,153)" : "white"}}
                    >
                      {item.message}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {new Date(item.created_at).toString().substring(0,24)}
                    </Typography>
                  </TableCell>
                  <TableCell align='center'>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {item.transaction_table_id}
                    </Typography>
                  </TableCell>
                  <TableCell align='left'>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {item.type}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {item.sourceDesc}
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
                      {item.amountCrypto}
                      {item.cryptoCurrency}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {numeral(item.amount).format(
                        `${item.currency}0,0.00`
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography color="rgb(75,171,37)">Complete</Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          }
          
        </Table>
      </TableContainer>
      {/* <Box p={2}>
        <TablePagination
          component="div"
          count={paginatedtransactionDetails.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box> */}
    </Card>
  );
};

RecentOrdersTable.propTypes = {
  cryptoOrders: PropTypes.array.isRequired
};

RecentOrdersTable.defaultProps = {
  cryptoOrders: []
};

export default RecentOrdersTable;
