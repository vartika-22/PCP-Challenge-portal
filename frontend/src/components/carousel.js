import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Paper, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import SearchBar from '../components/searchbar';
import Leaderboard from '../pages/Leaderdemo';
import Navbar from './side-navbar';
import '../css/carousel.css';
import Takechallenge from './takechallenge';
import LogoutBar from './Logoutbar';

const StyledCarouselItem = styled(Paper)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent:'center',
  padding: '10px',
  
  borderRadius: '8px',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.6)',
  margin: '0 10px',
  marginLeft:'10px',
  
});

const CarouselComponent = () => {
  const carouselItems = [
    {
      id: 1,
      heading: 'Java Programming',
      caption: 'Java is a versatile and widely-used programming language...',
      route: '/', // Change this to your desired route
    },
    {
      id: 2,
      heading: 'JavaScript Programming',
      caption: 'JavaScript is a popular scripting language...',
      route: '/javascript', // Change this to your desired route
    },
    {
      id: 2,
      heading: 'JavaScript Programming',
      caption: 'JavaScript is a popular scripting language...',
      route: '/javascript', // Change this to your desired route
    },
    {
      id: 2,
      heading: 'JavaScript Programming',
      caption: 'JavaScript is a popular scripting language...',
      route: '/javascript', // Change this to your desired route
    },
    {
      id: 2,
      heading: 'JavaScript Programming',
      caption: 'JavaScript is a popular scripting language...',
      route: '/javascript', // Change this to your desired route
    },
    {
      id: 2,
      heading: 'JavaScript Programming',
      caption: 'JavaScript is a popular scripting language...',
      route: '/javascript', // Change this to your desired route
    },
  ];

  const CustomPrevArrow = (props) => (
    <ChevronLeft {...props} style={{ color: 'black', backgroundcolor:'black', zIndex: 1 }} />
  );

  const CustomNextArrow = (props) => (
    <ChevronRight {...props} style={{ color: 'black', backgroundcolor:'black', zIndex: 1 }} />
  );

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div>
    <Navbar>
      <LogoutBar></LogoutBar>
      
      <Slider {...settings} className="carousel-slider">
        {carouselItems.map((item) => (
          <div key={item.id}>
            <Link className="link-to-s" to={item.route}>
              <StyledCarouselItem elevation={3} className="carousel-item"
              
              
              >
                <div className='carousel-sub-item'>
                  <Typography variant="h5" className="heading">
                    {item.heading}
                  </Typography>
                  <Typography variant="body2" className="caption">
                    {item.caption}
                  </Typography>
                </div>
              </StyledCarouselItem>
            </Link>
          </div>
        ))}
      </Slider>
      <Takechallenge></Takechallenge>
      <Leaderboard />
      </Navbar>
    </div>
  );
};

export default CarouselComponent;
