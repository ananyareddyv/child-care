import React from 'react';
import { Container, Typography, AppBar, Toolbar, IconButton, Grid, Paper } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Home = () => {
  return (
    <div>
      <AppBar position="fixed" >
        <Toolbar>
          <IconButton color="inherit">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            ABC Childcare Center
          </Typography>
        </Toolbar>
      </AppBar>

      <header style={{ background: '#303f9f', color: '#fff', padding: '60px 0', textAlign: 'center', marginTop: '64px' }}>
        <Container>
          <Typography variant="h3" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
            Welcome to ABC Childcare Center
          </Typography>
          <Typography variant="subtitle1">Your Child's Home Away from Home</Typography>
        </Container>
      </header>

      <Container style={{ marginTop: '20px', textAlign: 'justify' }}>
        <Typography variant="h2" gutterBottom>
          About Us
        </Typography>
        <Typography paragraph>
          At ABC Childcare Center, we are committed to providing a safe and nurturing environment for your children. Our team of dedicated professionals is here to support your child's growth and development in their early years. We believe in the importance of early education and social interaction, and we strive to create a place where children can learn, play, and make lasting memories.
        </Typography>

        <Typography variant="h2" gutterBottom>
          Our Facilities
        </Typography>
        <Typography paragraph>
          Our state-of-the-art facilities are equipped to cater to the unique needs of children at different stages of development. We offer a range of age-appropriate classrooms, outdoor play areas, and learning materials to ensure that each child's experience with us is engaging and enriching. Our staff is well-trained and passionate about fostering a positive learning environment for your child.
        </Typography>

        <Typography variant="h2" gutterBottom>
          Image Gallery
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper style={{ padding: '10px', textAlign: 'center' }}>
              <img src="image1.jpg" alt="Indoor Activities" style={{ maxWidth: '100%', height: 'auto' }} />
              <Typography variant="subtitle1" style={{ marginTop: '10px' }}>Indoor Activities</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper style={{ padding: '10px', textAlign: 'center' }}>
              <img src="image2.jpg" alt="Outdoor Play Area" style={{ maxWidth: '100%', height: 'auto' }} />
              <Typography variant="subtitle1" style={{ marginTop: '10px' }}>Outdoor Play Area</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper style={{ padding: '10px', textAlign: 'center' }}>
              <img src="image3.jpg" alt="Educational Materials" style={{ maxWidth: '100%', height: 'auto' }} />
              <Typography variant="subtitle1" style={{ marginTop: '10px' }}>Educational Materials</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default Home;