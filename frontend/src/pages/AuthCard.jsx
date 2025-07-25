import { useState } from "react";
import Login from "./Login";
import Signup from "./SignUp";
import { Card, CardContent, Button, Box, Typography, AppBar, Toolbar } from '@mui/material';
import googleIcon from "../assets/google_icon.svg";
import githubIcon from "../assets/github_icon.svg";

function AuthCard() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'background.default' }}>
      <Card sx={{ minWidth: 400, p: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Button onClick={() => setIsLogin(true)} variant={isLogin ? "contained" : "outlined"}>Login</Button>
            <Button onClick={() => setIsLogin(false)} variant={!isLogin ? "contained" : "outlined"}>Signup</Button>
          </Box>
          {isLogin ? <Login /> : <Signup />}
          <Typography sx={{ my: 2, textAlign: 'center' }}>OR</Typography>
          <Button fullWidth variant="outlined" startIcon={<img src={googleIcon} alt="Google" />}>
            Continue with Google
          </Button>
          <Button fullWidth variant="outlined" startIcon={<img src={githubIcon} alt="GitHub" />} sx={{ mt: 1 }}>
            Continue with GitHub
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

function LoginBoard() {
  return (
    <>
      <Navbar />
      <AuthCard />
    </>
  );
}

function Navbar() {
    return (
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Graph-Mind
          </Typography>
          <Button color="inherit">About us</Button>
          <Button color="inherit">Services</Button>
          <Button color="inherit">Use Cases</Button>
          <Button color="inherit">Pricing</Button>
          <Button color="inherit">Blog</Button>
        </Toolbar>
      </AppBar>
    )
  }

export default LoginBoard;