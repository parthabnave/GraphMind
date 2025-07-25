import arrow from "../assets/Arrow.svg";
import { Card, CardContent, Typography, Box } from '@mui/material';

function HomePageCard({ title, titleColor = 'primary.main', boxBackground = 'background.paper', learnMoreColor = 'text.secondary', image }) {
  return (
    <Card
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mx: 'auto',
        bgcolor: boxBackground,
        width: 650,
        height: 300,
        p: 3,
      }}
    >
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <Box>
          <Typography
            variant="h5"
            component="span"
            sx={{
              fontWeight: 'bold',
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              display: 'inline-block',
              bgcolor: titleColor,
              color: 'white',
            }}
          >
            {title}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <img src={arrow} alt="Arrow" style={{ width: 24, height: 24 }} />
              <Typography variant="body1" sx={{ color: learnMoreColor, fontWeight: 'medium' }}>
                Learn more
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
      {image && (
        <Box sx={{ ml: 2 }}>
          <img src={image} alt="Diagram" style={{ width: 290, height: 270 }} />
        </Box>
      )}
    </Card>
  );
}

export default HomePageCard;
