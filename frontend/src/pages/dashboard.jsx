import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container, Grid, Card, CardContent, CardActions } from '@mui/material';
import userIcon from "../assets/user_icon.svg";

function Dashboard() {
  const [data, setData] = useState({ name: "Loading...", history: [] });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:5000/dashboard", {
          headers: {
            token: `Bearer ${token}`,
          },
        });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const navigate = useNavigate();

  const handleSearch = async (id) => {
    try {
      const diagram_id = data.history[id]._id;
      const response = await axios.post(`http://localhost:5000/getdata`, {
        diagram_id: diagram_id,
      });

      if (response.data.moveOn) {
        localStorage.setItem("projectName", response.data.formattedData.title);
        localStorage.setItem("useCaseElements", JSON.stringify(response.data.formattedData.entities));
        localStorage.setItem("useCaseLinks", JSON.stringify(response.data.formattedData.relationships));
        navigate("/UseCaseEditor", {
          state: {
            entities: response.data.formattedData.entities,
            relationships: response.data.formattedData.relationships
          }
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const userName = data.name;
  const diagrams = data.history || [];

  return (
    <>
      <Navbar name={userName} />
      <Container sx={{ mt: 4 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Hi, {userName}!
            </Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" size="large">
              Create New Diagram!
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {diagrams.length > 0 ? (
            diagrams.map((diagram, index) => (
              <Grid item xs={12} sm={6} md={4} key={diagram.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {diagram.title}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => handleSearch(index)}>View</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography>No diagrams found.</Typography>
          )}
        </Grid>
      </Container>
    </>
  );
}

function Navbar({ name }) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Graph-Mind
        </Typography>
        <Button color="inherit">About us</Button>
        <Button color="inherit">Services</Button>
        <Button color="inherit" startIcon={<img src={userIcon} alt="Usericon" />}>
          {name}
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Dashboard;