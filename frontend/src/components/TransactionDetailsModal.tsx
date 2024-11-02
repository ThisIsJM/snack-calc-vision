import Transaction from "../models/transaction";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import TransactionDetails from "./TransactionDetails";

interface Props {
  readonly show: boolean;
  readonly transaction: Transaction | undefined;
  readonly closeHandler: () => void;
}

function TransactionDetailsModal({ show, transaction, closeHandler }: Props) {
  return (
    <Dialog
      aria-labelledby="customized-dialog-title"
      open={show}
      onClose={closeHandler}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Transaction Information
      </DialogTitle>
      <DialogContent dividers>
        {transaction && <TransactionDetails transaction={transaction} />}
      </DialogContent>
    </Dialog>
  );
}

export default TransactionDetailsModal;
