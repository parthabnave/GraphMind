
import React from 'react';
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container, Grid, Card, CardContent, CardMedia, Box, TextField } from '@mui/material';
import Announcement from "../assets/Home_page_announcement.svg";
import UseCaseDesign from "../assets/UseCaseDesign.svg";
import System_ArchDiagram from "../assets/System_Arch.svg";
import ERDia from "../assets/ERDiagram.svg";
import twitter from "../assets/twitter.svg";
import facebook from "../assets/facebook.svg";
import linkedin from "../assets/linkedin.svg";

function Home() {
    return (
        <>
            <Navbar />
            <IntroCard />
            <ServiceHeader />
            <Cards />
            <Footer />
        </>
    );
}

function IntroCard() {
    const navigate = useNavigate();
    return (
        <Container sx={{ my: 4 }}>
            <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={12}>
                    <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Transforming Text into UML Diagrams with AI!
                    </Typography>
                    <Typography variant="h6" color="text.secondary" paragraph>
                        Our AI-powered tool instantly converts your text into structured UML diagrams. Simplify software design with accurate, effortless diagram generation.
                    </Typography>
                    <Button variant="contained" size="large" onClick={() => navigate("/login")}>
                        Start creating!
                    </Button>
                </Grid>
                
            </Grid>
        </Container>
    );
}

function ServiceHeader() {
    return (
        <Container sx={{ my: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                Services
            </Typography>
            <Typography variant="body1" color="text.secondary">
                With Graph-Mind, you are able to streamline your workflow with the precision of AI. Currently, it supports the following UML diagrams, (with more to come!)
            </Typography>
        </Container>
    );
}

function Cards() {
    const cardData = [
        { title: "Use Case Diagram" },
        { title: "System Architecture Diagram" },
        { title: "ER Diagram" },
    ];

    return (
        <Container sx={{ my: 4 }}>
            <Grid container spacing={4}>
                {cardData.map((card, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div" textAlign="center">
                                    {card.title}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

function Footer() {
    return (
        <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 6 }}>
            <Container maxWidth="lg">
                <Grid container spacing={5}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Graph-Mind
                        </Typography>
                        <img src={linkedin} alt="linkedin" />
                        <img src={facebook} alt="facebook" />
                        <img src={twitter} alt="twitter" />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Contact Us
                        </Typography>
                        <Typography>Email: graphmind@gmail.com</Typography>
                        <Typography>Phone: +123 456 7890</Typography>
                        <Typography>Address: 123 Street, City, Country</Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom>
                            Tell us your experience
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Write your review..."
                            variant="outlined"
                            sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
                        />
                        <Button variant="contained" sx={{ mt: 1 }}>Submit Review</Button>
                    </Grid>
                </Grid>
                <Box mt={5}>
                    <Typography variant="body2" align="center">
                        © 2025 All rights reserved
                    </Typography>
                    <Typography variant="body2" align="center">
                        <a href="#" style={{ color: 'primary.contrastText' }}>Privacy Policy</a>
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

function Navbar() {
    const navigate = useNavigate();
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
                <Button variant="outlined" onClick={() => navigate("/login")}>Sign Up</Button>
            </Toolbar>
        </AppBar>
    );
}

export default Home;
