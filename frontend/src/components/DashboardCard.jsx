import arrow from "../assets/Arrow.svg";
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';

function DashboardCard({ title, image, onClick }) {
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 400,
        height: 250,
        p: 3,
        mx: 'auto',
        bgcolor: 'background.paper',
        color: 'text.primary',
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
        <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            width: 300,
            height: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {title}
        </Typography>
      </CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
        <IconButton onClick={onClick} color="primary" size="large">
          <img src={arrow} alt="Arrow Button" style={{ width: 32, height: 32 }} />
        </IconButton>
      </Box>
      {image && <Box sx={{ mt: 2 }}><img src={image} alt="Diagram" style={{ width: 290, height: 270 }} /></Box>}
    </Card>
  );
}

export default DashboardCard;
