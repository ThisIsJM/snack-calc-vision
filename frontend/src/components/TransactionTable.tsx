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
import { useState } from "react";
import TransactionDetailsModal from "./TransactionDetailsModal";

interface Props {
  readonly transactions: Transaction[];
}

interface ShowDetailsProps {
  show: boolean;
  transaction: undefined | Transaction;
}

const TABLE_HEADERS = ["id", "Transaction Date", "Grand Total", "Actions"];

function TransactionTable({ transactions }: Props) {
  const [showDetails, setShowDetails] = useState<ShowDetailsProps>({
    show: false,
    transaction: undefined,
  });

  function formatDate(date: Date) {
    return format(date, "MMM dd, yyyy hh:mm a");
  }

  function displayDetails(transactionId: number | undefined) {
    if (!transactionId) return;

    const transaction = transactions.find((t) => t.id === transactionId);
    setShowDetails({ transaction, show: true });
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {TABLE_HEADERS.map((header) => (
              <TableCell key={header}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.id}</TableCell>
              <TableCell>
                {transaction.created_at !== undefined &&
                  formatDate(new Date(transaction.created_at))}
              </TableCell>
              <TableCell>{transaction.grand_total.toFixed(2)} PHP</TableCell>
              <TableCell>
                <Button onClick={() => displayDetails(transaction.id)}>
                  Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TransactionDetailsModal
        {...showDetails}
        closeHandler={() =>
          setShowDetails({ transaction: undefined, show: false })
        }
      />
    </TableContainer>
  );
}

export default TransactionTable;
