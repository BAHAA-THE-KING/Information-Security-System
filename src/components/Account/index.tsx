import {
  Box,
  Button,
  Card,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router";
import {
  Logout as LogoutIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import axios from "axios";
import { Popup } from "../Popup";
import { RSAUtility } from "../../utils/RSAUtility";

export function Account() {
  const navigate = useNavigate();
  const [popupState, setPopupState] = useState<"withdraw" | "deposit" | null>(
    null
  );
  const [balance, setBalance] = useState<string>("Loading...");
  const [loading, setLoading] = useState<boolean>(false);

  const token = localStorage.getItem("token");

  const sendPublicKey = async () => {
    try {
      const publicKey = RSAUtility.generateKeyPair();
      await axios.post(
        "http://localhost:3000/api/public-key",
        { public_key: publicKey },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error sending public key:", error);
    }
  };

  const refreshBalance = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/balance", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const decryptedBalance = RSAUtility.decrypt(
        response.data.encrypted_balance
      );
      setBalance(`${decryptedBalance} S.P.`);
    } catch (error) {
      console.error("Error refreshing balance:", error);
      setBalance("Error fetching balance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    sendPublicKey();
    refreshBalance();
  }, []);

  return (
    <>
      <Box
        width={"100%"}
        height={"100%"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"flex-start"}
        alignItems={"center"}
        bgcolor={"#ABCDAB"}
      >
        <Box
          width={"100%"}
          height={"50px"}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          bgcolor={(theme) => theme.palette.primary.dark}
        >
          <Box mx={3}>
            <Typography color="white" fontSize={40}>
              MyAccount
            </Typography>
          </Box>
          <Box mx={3}>
            <Button
              variant="text"
              endIcon={<LogoutIcon />}
              sx={{
                color: "white",
                borderRadius: "10000px",
              }}
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("privateKey");
                navigate("/login");
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>
        <Card
          sx={{
            width: "500px",
            height: "250px",
            borderRadius: "10px",
            mt: 3,
            p: 5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            width={"500px"}
            height={"250px"}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Typography variant="subtitle1">Your balance is:</Typography>
            <Typography variant="h2">
              {balance}
              <IconButton color="primary" onClick={refreshBalance}>
                {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
              </IconButton>
            </Typography>
          </Box>
          <Box
            width={"500px"}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Button
              variant="contained"
              color="error"
              onClick={() => setPopupState("withdraw")}
            >
              Withdraw
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={() => setPopupState("deposit")}
            >
              Deposit
            </Button>
          </Box>
        </Card>
      </Box>
      {popupState ? (
        <Popup close={() => setPopupState(null)} popupState={popupState} />
      ) : null}
    </>
  );
}
