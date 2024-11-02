import {
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import Transaction from "../models/transaction";

interface Props {
  readonly transaction: Transaction;
}

function TransactionDetails({ transaction }: Props) {
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
    <>
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
    </>
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

export default TransactionDetails;
