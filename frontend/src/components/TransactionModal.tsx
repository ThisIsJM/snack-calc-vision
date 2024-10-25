import styled from "styled-components";
import Transaction from "../models/transaction";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

interface Props {
  show: boolean;
  transaction: Transaction | undefined;
  closeHandler: () => void;
  submitHandler: () => void;
}

function TransactionModal({
  show,
  transaction,
  closeHandler,
  submitHandler,
}: Props) {
  function generateRow(cells: [string, string, string]) {
    return (
      <TableRow>
        <StyledTableCell align="left">{cells[0]}</StyledTableCell>
        <StyledTableCell align="left">{cells[1]}</StyledTableCell>
        <StyledTableCell align="right">{cells[2]}</StyledTableCell>
      </TableRow>
    );
  }

  return (
    <Dialog
      aria-labelledby="customized-dialog-title"
      open={show}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Transaction Information
      </DialogTitle>
      <DialogContent dividers>
        <Table size="small">
          <colgroup>
            <col width="10%" />
            <col width="80%" />
            <col width="10%" />
          </colgroup>
          <TableHead>{generateRow(["QNTY", "ITEM", "PRICE"])}</TableHead>
          <TableBody>
            {transaction?.item_list.map((item) =>
              generateRow([
                item.quantity.toString(),
                item.name,
                item.total_price.toFixed(2).toString(),
              ])
            )}
          </TableBody>
        </Table>
        <Divider orientation="horizontal" />
        <GrandTotalContainer>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            GRAND TOTAL:
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {transaction?.grand_total.toFixed(2)} PHP
          </Typography>
        </GrandTotalContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeHandler}> Cancel</Button>
        <Button onClick={submitHandler}>Save changes</Button>
      </DialogActions>
    </Dialog>
  );
}

const StyledTableCell = styled(TableCell)`
  border: none;

  white-space: nowrap;
  text-overflow: ellipsis;
`;

const GrandTotalContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 10px;
  padding-right: 15px;
`;

export default TransactionModal;
