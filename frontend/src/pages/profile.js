import React, { useState, useEffect } from "react";
import axios from "axios";

import Toast from 'react-bootstrap/Toast';
import '../css/profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faSync } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import Button from "react-bootstrap/esm/Button";
import Navbar from '../components/side-navbar';
import LogoutBar from "../components/Logoutbar";
import { TextField, Box, Input } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { green } from "@mui/material/colors";


function Profile() {
  const profilePic={margin:"20px"}

  const [user, setUser] = useState(null);
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [qualification, setQualification] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
const [gender, setGender] = useState(""); // Gender state
const [dob, setDOB] = useState(""); // Date of Birth state
const [street, setStreet] = useState(""); // Street state
const [city, setCity] = useState(""); // City state
const [state, setState] = useState(""); // State state
const [country, setCountry] = useState(""); 
const [isAddressExpanded, setAddressExpanded] = useState(false); // New state
const [showA, setShowA] = useState(false);
const [isFormValid, setFormValid] = useState(false);
const currentDate = format(new Date(), 'yyyy-MM-dd');

// Helper function to generate the absolute URL for an image
const getAbsoluteImageUrl = (relativePath) => {
  return `http://127.0.0.1:3002/${relativePath}`;
}


const validateForm = () => {
  const isPhoneNumberValid = /^[6-9]\d{9}$/.test(phoneNumber);
  const isQualificationValid = qualification.trim() !== "";
  const isGenderValid = gender !== "";
  const isDOBValid = dob !== "";
  const isStreetValid = street.trim() !== "";
  const isCityValid = city.trim() !== "";
  const isStateValid = state.trim() !== "";
  const isCountryValid = country.trim() !== "";
  const isFirstnameValid = firstName !== "";
  const isLastnameValid = lastName !== "";

  return (
    isPhoneNumberValid &&
    isQualificationValid &&
    isGenderValid &&
    isDOBValid &&
    isStreetValid &&
    isCityValid &&
    isStateValid &&
    isCountryValid &&
    isFirstnameValid &&
    isLastnameValid
  );
};

useEffect(() => {
  setFormValid(validateForm());
}, [firstName, lastName, phoneNumber, qualification, gender, dob, street, city, state, country]);

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token available.");
          return;
        }

        const response = await axios.get("http://127.0.0.1:3002/user/challenges", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        
        const userData = response.data.user;
        setUser(userData);
        const storedImageURL = userData.profileImage;
        setImagePreview(storedImageURL);

        setFirstname(userData.firstName || "");
        setLastname(userData.lastName || "");
        setPhoneNumber(userData.phoneNumber || "");
        setQualification(userData.qualification || "");
        setGender(userData.gender || "");
        setDOB(userData.dob || "");
        setStreet(userData.street || "");
        setCity(userData.city || "");
        setState(userData.state || "");
        setCountry(userData.country || "");
      } catch (error) {
        console.error(error);
      }
    }

    fetchUser();
  }, []);
  
  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleQualificationChange = (event) => {
    setQualification(event.target.value);
  };

  const handlefirstNameChange = (event) => {
    setFirstname(event.target.value);
  };

  const handlelastNameChange = (event) => {
    setLastname(event.target.value);
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setProfileImage(selectedImage);
    const previewURL = URL.createObjectURL(selectedImage);
    setImagePreview(previewURL);
  };

  const handleUpdateClick = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token available.");
        return;
      }
      else{
        if (!validateForm()) {
          console.error("Form validation failed.");
          return;
      }}
    
  
      const formData = new FormData();
      formData.append("profileImage", profileImage);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("phoneNumber", phoneNumber);
      formData.append("qualification", qualification);
      formData.append("gender", gender); // Added gender
      formData.append("dob", dob);
      formData.append("street", street); // Added street
      formData.append("city", city); // Added city
      formData.append("state", state); // Added state
      formData.append("country", country);
      
        // After setting other user information
        //localStorage.setItem("userProfileImage", imagePreview);
  
      await axios.put(
        "http://127.0.0.1:3002/user/update",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      console.log("Update successful");
      setShowA(true);
    } catch (error) {
      console.error(error);
    }
  };
  
  
  if (!user) {
    return <div>Loading...</div>;
  }

  const toggleAddressSection = () => {
    setAddressExpanded(!isAddressExpanded);
  };

  return (
    
    <div>
     
      <section className="vh-100">
      <Navbar>
      <LogoutBar></LogoutBar>
  <div className="container py-5 h-100">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col col-lg-13 mb-4 mb-lg-0">
        <div className="card mb-3">
          <div className="row g-0">
            <div className="col-md-4 gradient-custom text-center text-white">
            <label htmlFor="profileImage" style={{ marginTop: '20px', fontWeight:700}}>Profile Image:</label>
               
              <div className="profile-image-wrapper" style={{ marginLeft: '70px' }}>
                {imagePreview ? (
              <img
                className="profile-image"
                src={getAbsoluteImageUrl(imagePreview)} // Use the absolute URL here
                alt="Profile Preview"
              />
            ) : (
              <div className="empty-profile-image"></div>
            )}
           </div>
           <label htmlFor="profileImage" className="image-upload-label">
  <i class="far fa-edit mb-5"></i>
</label>
<input
  type="file"
  id="profileImage"
  accept="image/*"
  onChange={handleImageChange}
  style={{ display: 'none' }}
/>
           <div className="emailtext">
            <p>{user.email}</p>
            </div>
           <div className="upshare"> 
            <div className="d-flex justify-content-first" id="shareicons">
                   <a href="https://www.facebook.com/" target="_blank" style={{color:"white"}}><i class="fab fa-facebook-f fa-lg me-3"></i></a>
                  <a href="https://twitter.com/" target="_blank" style={{color:"white"}}><i class="fab fa-twitter fa-lg me-3"></i></a>
                  <a href="https://www.instagram.com/" target="_blank" style={{color:"white"}}><i class="fab fa-instagram fa-lg"></i></a>
            </div>
           <div id="upadtebu">
              <Button className="updatebut" onClick={handleUpdateClick} disabled={!isFormValid}>
                <FontAwesomeIcon icon={faSync} className="mr-2" /> Update
                </Button>
            </div>
          </div> 


            </div>
            
            <div className="col-md-8">
              <div className="card-body p-4">
                <h6 style={{fontWeight:700}}>Information</h6>
                <hr className="mt-0 mb-4"/>
                <div className="row pt-1">
                  <div className="col-6 mb-3">
                    <div>
                      <TextField label="First Name" variant="filled" color="success" focused type="tel" id="firstname" value={firstName} onChange={handlefirstNameChange} placeholder="Enter your Firstname" />
                      </div>
                      <div>
                        <br></br>
                        <TextField label="Qualification" variant="filled" color="success" focused type="tel" id="qualification" value={qualification} onChange={handleQualificationChange} placeholder="Enter your Qualification" />
                        </div>
                        <div>
                          <br></br>

                          <div>
      <FormControl sx={{ m: 1, minWidth: 215 }}>
        <InputLabel id="demo-simple-select-autowidth-label" variant="filled" color="success" focused>Gender</InputLabel>
        <Select variant="filled" color="success" focused
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={gender}
          onChange={(event) => setGender(event.target.value)}
          autoWidth
          label="Gender"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
        </Select>
      </FormControl>
    </div>
                          </div>
                      <br></br>
                     
                  </div>
                  <div className="col-6 mb-3">
                      <TextField label="Last Name" variant="filled" color="success" focused type="tel" id="lastname" value={lastName} onChange={handlelastNameChange} placeholder="Enter your Lastname"/>
                      <div>
                        <br></br>
                        <TextField label="Phone Number" variant="filled" color="success" focused type="tel" id="phoneNumber" name="phoneNumber" value={phoneNumber} onChange={handlePhoneNumberChange} placeholder="10 digit phone number" required />
                      </div>
                        
                          <div>
                        <br></br>
                      <label htmlFor="dob">Date of Birth:</label><br></br>
                      <input style={{height:"40px", width:"210px", borderColor:"green", borderTopColor:"green"}} variant="filled" color="success" focused type="date" id="dob" value={dob}  max={currentDate} onChange={(event) => setDOB(event.target.value)}/>
                      </div>
                          </div>
                        </div>                
  
                <h6 style={{fontWeight:700}}>Address</h6>
                <hr className="mt-0 mb-4"/>
                <div className="row pt-1">
                <div className="col-6 mb-3">
            <div>
    <TextField label="Street" variant="filled" color="success" focused type="tel" id="street" value={street} onChange={(event) => setStreet(event.target.value)} placeholder="Street"/>
    </div><br></br>
<div>
    <TextField label="City" variant="filled" color="success" focused type="tel" id="city" value={city} onChange={(event) => setCity(event.target.value)}  placeholder="City"/>
 </div>
 </div><br></br>
 <div className="col-6 mb-3">
  <div>
    <TextField label="State" variant="filled" color="success" focused type="tel" id="state" value={state} onChange={(event) => setState(event.target.value)}  placeholder="State"/>
</div><br></br>
<div>
    <TextField label="Country" variant="filled" color="success" focused type="tel" id="country" value={country} onChange={(event) => setCountry(event.target.value)}  placeholder="Country"
    />
 </div>
 </div>
 </div>
  
 
               
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </Navbar>
</section>
    



    <Toast
        className="center-toast" // Add this class for centering
        show={showA}
        onClose={() => setShowA(false)}
      >
        <Toast.Header>
          <img
            src="holder.js/20x20?text=%20"
            className="rounded me-2"
            alt=""
          />
          <strong className="me-auto">Profile Update</strong>
          <small>Just now</small>
        </Toast.Header>
        <Toast.Body>Your profile has been successfully updated!</Toast.Body>
      </Toast>
      
</div>

  );
}

export default Profile;