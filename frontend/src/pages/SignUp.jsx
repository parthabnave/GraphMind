import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Box, Typography } from '@mui/material';
import userIcon from "../assets/user_icon.svg";
import passwordIcon from "../assets/password.svg";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/getStarted/register", formData);
      setMessage(response.data.msg);
      localStorage.setItem("token", response.data.token);
      navigate("/dash");
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.msg);
      } else if (error.request) {
        setMessage("No response from server. Please check your connection.");
      } else {
        setMessage("Error: " + error.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          type="text"
          label="Username"
          variant="outlined"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          autoComplete="name"
          InputProps={{
            startAdornment: <img src={userIcon} alt="User Icon" />,
          }}
        />
        <TextField
          type="email"
          label="Email"
          variant="outlined"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          autoComplete="email"
          InputProps={{
            startAdornment: <img src={userIcon} alt="Email Icon" />,
          }}
        />
        <TextField
          type="password"
          label="Password"
          variant="outlined"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          autoComplete="new-password"
          InputProps={{
            startAdornment: <img src={passwordIcon} alt="Password Icon" />,
          }}
        />
        <Button type="submit" variant="contained">Sign Up</Button>
        {message && <Typography color="error">{message}</Typography>}
      </Box>
    </form>
  );
}

export default Signup;