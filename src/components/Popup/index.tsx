import {
  Button,
  Card,
  Grid2 as Grid,
  IconButton,
  Modal,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useState } from "react";
import axios from "../../utils/axios";
import { RSAUtility } from "../../utils/RSAUtility";

type Props = {
  popupState: "withdraw" | "deposit";
  close: () => void;
};

export function Popup({ close, popupState }: Props) {
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const handleTransaction = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const endpoint = popupState === "withdraw" ? "/withdraw" : "/deposit";

      // Fetch the public key from the server
      const publicKeyResponse = await axios.get("/public-key");
      const publicKey = publicKeyResponse.data.public_key;

      // Encrypt the amount using RSAUtility
      const encryptedAmount = RSAUtility.encrypt(amount, publicKey);

      if (!encryptedAmount) {
        throw new Error("Failed to encrypt the amount");
      }

      // Send the encrypted amount to the server
      await axios.post(
        endpoint,
        { amount: encryptedAmount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(
        popupState === "withdraw"
          ? "Withdrawal successful!"
          : "Deposit successful!"
      );
      setAmount(""); // Reset the input field
    } catch {
      setError(
        "An error occurred while processing your transaction. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open
      onClose={close}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Card sx={{ width: "650px", height: "400px", p: 4 }}>
        <Grid container>
          <Grid size={12} display={"flex"} justifyContent={"flex-end"}>
            <IconButton onClick={close}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid size={12} display={"flex"} justifyContent={"center"}>
            <Typography variant="h4" textAlign={"center"}>
              {popupState === "withdraw"
                ? "Enter the withdrawal amount"
                : "Enter the deposit amount"}
            </Typography>
          </Grid>
          <Grid size={12} height={"30px"}></Grid>
          <Grid
            size={12}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"flex-end"}
          >
            <TextField
              variant="outlined"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              sx={{ my: 3, width: "80%" }}
              type="number"
              error={!!error}
              helperText={error || ""}
            />
          </Grid>
          <Grid
            size={12}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"flex-end"}
          >
            <Button
              variant="contained"
              onClick={handleTransaction}
              disabled={loading || !amount}
              sx={{ width: "50%", height: "50px" }}
            >
              {loading ? <CircularProgress size={24} /> : "Submit"}
            </Button>
          </Grid>
          <Grid size={12} display={"flex"} justifyContent={"center"} mt={2}>
            {success && <Typography color="success.main">{success}</Typography>}
          </Grid>
        </Grid>
      </Card>
    </Modal>
  );
}
