import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid2 as Grid,
  IconButton,
  TextField,
  Typography,
  Link,
  Alert,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import bgImage from "../../assets/bg.png";
import { Link as RouterLink, useNavigate } from "react-router";
import axios from "axios";

interface FormData {
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
}

export function Register() {
  const navigate = useNavigate();
  const [isPassword, setIsPassword] = useState<boolean>(true);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    userName: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setErrorMessage(null);
    setIsLoading(true);

    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      user_name: formData.userName,
      password: formData.password,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/signup",
        payload
      );
      const data = response.data;

      if (data.success) {
        // Save token to localStorage
        localStorage.setItem("token", data.data.token);
        navigate("/account"); // Redirect to account page
      } else {
        setErrorMessage(data.message || "Signup failed. Please try again.");
      }
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      width={"100%"}
      height={"100%"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Box
        width={"50%"}
        height={"100%"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Grid
          container
          sx={{
            width: "80%",
            height: "50%",
          }}
          spacing={2}
        >
          <Grid size={12} textAlign={"center"}>
            <Typography variant="h4">Create a new account</Typography>
          </Grid>
          <Grid size={12}>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          </Grid>
          <Grid size={12}>
            <TextField
              name="firstName"
              variant="outlined"
              placeholder="First Name"
              fullWidth
              value={formData.firstName}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              name="lastName"
              variant="outlined"
              placeholder="Last Name"
              fullWidth
              value={formData.lastName}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              name="userName"
              variant="outlined"
              placeholder="Username or Email"
              fullWidth
              value={formData.userName}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              name="password"
              variant="outlined"
              placeholder="Password"
              fullWidth
              type={isPassword ? "password" : "text"}
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setIsPassword(!isPassword)}>
                    {isPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid size={12}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isLoading}
              fullWidth
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </Grid>
          <Grid size={12} textAlign={"center"}>
            <Typography>Already have an account?</Typography>
            <Typography>
              <RouterLink to="/login">
                <Link>Login Instead</Link>
              </RouterLink>
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box
        width={"50%"}
        height={"100%"}
        sx={(theme) => ({
          [theme.breakpoints.down("md")]: {
            display: "none",
          },
        })}
      >
        <img src={bgImage} width={"100%"} height={"100%"} alt="Background" />
      </Box>
    </Box>
  );
}
