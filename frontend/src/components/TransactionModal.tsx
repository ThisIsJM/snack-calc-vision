import Transaction from "../models/transaction";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useEffect, useState } from "react";
import TransactionDetails from "./TransactionDetails";

interface Props {
  readonly show: boolean;
  readonly image: File | null;
  readonly transaction: Transaction | undefined;
  readonly closeHandler: () => void;
  readonly submitHandler: () => Promise<void | boolean>;
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
          <img
            src={imageSource}
            width={"100%"}
            height={"250px"}
            alt="transaction-image"
          />
        )}
        {transaction && <TransactionDetails transaction={transaction} />}
      </DialogContent>
      <DialogActions>
        <Button onClick={closeHandler}> Cancel</Button>
        <Button onClick={onSubmitPressed}>Save changes</Button>
      </DialogActions>
    </Dialog>
  );
}

export default TransactionModal;
