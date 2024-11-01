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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useEffect, useState } from "react";

interface Props {
  show: boolean;
  image: File | null;
  transaction: Transaction | undefined;
  closeHandler: () => void;
  submitHandler: () => Promise<void | boolean>;
}

function TransactionModal({
  show,
  image,
  transaction,
  closeHandler,
  submitHandler,
}: Props) {
  const [imageSource, setImageSource] = useState<string>("");
  const [success, setSuccess] = useState<boolean | null>(true);

  //Clean up
  useEffect(() => {
    if (!show) {
      setImageSource("");
      setSuccess(null);
    }
  }, [show]);

  useEffect(() => {
    if (!image) {
      setImageSource("");
      return;
    }

    const getImageSource = async () => {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (reader.result) {
          setImageSource(reader.result as string);
        } else {
          console.error("Failed to load image");
        }
      };

      reader.onerror = () => {
        console.error("File could not be read");
      };

      reader.readAsDataURL(image);
    };

    getImageSource();
  }, [image]);

  function generateRow(cells: [string, string, string]) {
    return (
      <TableRow>
        <StyledTableCell align="left">{cells[0]}</StyledTableCell>
        <StyledTableCell align="left">{cells[1]}</StyledTableCell>
        <StyledTableCell align="right">{cells[2]}</StyledTableCell>
      </TableRow>
    );
  }

  async function onSubmitPressed() {
    const success = await submitHandler();
    if (typeof success === "boolean") setSuccess(success);
  }

  if (typeof success === "boolean") {
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
        <DialogContent
          dividers
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {success ? (
            <>
              <CheckCircleIcon sx={{ fontSize: 80 }} color="success" />
              <Typography variant="h6">Transaction Saved!</Typography>
            </>
          ) : (
            <>
              <CancelIcon sx={{ fontSize: 80 }} color="error" />
              <Typography variant="h6">Failed to Save Transaction</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHandler}> Close</Button>
        </DialogActions>
      </Dialog>
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
        {imageSource && (
          <img src={imageSource} width={"100%"} height={"250px"} />
        )}
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
        <Button onClick={onSubmitPressed}>Save changes</Button>
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
