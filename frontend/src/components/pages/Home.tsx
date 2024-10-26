import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import styled from "styled-components";
import Transaction from "../../models/transaction";
import { useEffect, useState } from "react";
import { getTransactionsAPI } from "../../api";

const TABLE_HEADERS = ["id", "Transaction Date", "Grand Total", "Actions"];
/**
 * TODO
 * INSTALL DATE-FNS
 */
function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const getTransactionHistory = async () => {
      const transactions = await getTransactionsAPI();
      setTransactions(transactions);
    };

    getTransactionHistory();
  }, []);

  return (
    <Container>
      <Typography variant="h6">Transaction History</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {TABLE_HEADERS.map((header) => (
                <TableCell>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow>
                <TableCell>{transaction.id}</TableCell>
                <TableCell>
                  {transaction.created_at !== undefined &&
                    new Date(transaction.created_at)?.toTimeString()}
                </TableCell>
                <TableCell>{transaction.grand_total.toFixed(2)} PHP</TableCell>
                <TableCell>
                  <Button>Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Home;

const Container = styled.div`
  padding: 10px;
  color: ${grey[600]};
`;
