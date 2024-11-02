import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Transaction from "../models/transaction";
import { format } from "date-fns";

interface Props {
  transactions: Transaction[];
}

const TABLE_HEADERS = ["id", "Transaction Date", "Grand Total", "Actions"];

function TransactionTable({ transactions }: Props) {
  function formatDate(date: Date) {
    return format(date, "MMM dd, yyyy hh:mm a");
  }

  return (
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
                  formatDate(new Date(transaction.created_at))}
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
  );
}

export default TransactionTable;
