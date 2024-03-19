import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Toast from 'react-bootstrap/Toast';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faSync } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import AdminNavbar from './adminNavbar';
import { TextField, Box } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { green } from "@mui/material/colors";

const AdminProfile = () => {
   
  const [adminEmail, setAdminEmail] = useState('');
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileImage, setProfileImage] = useState(null);
const [imagePreview, setImagePreview] = useState(null);
const [gender, setGender] = useState("");
const [dob, setDOB] = useState("");
const [street, setStreet] = useState("");
const [city, setCity] = useState("");
const [state, setState] = useState("");
const [country, setCountry] = useState(""); 
const [isAddressExpanded, setAddressExpanded] = useState(false);
const [showA, setShowA] = useState(false);
const [isFormValid, setFormValid] = useState(false);
const currentDate = format(new Date(), 'yyyy-MM-dd');
const serverBaseUrl = "http://127.0.0.1:3002";
const [storedProfileImage, setStoredProfileImage] = useState(localStorage.getItem("profileImage"));

const validateForm = () => {
  const isPhoneNumberValid = /^[6-9]\d{9}$/.test(phoneNumber);
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
  async function fetchAdminProfile() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token available.");
        return;
      }
      const response = await axios.get("http://127.0.0.1:3002/admin/email", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setAdminEmail(response.data.adminEmail);

      const profileResponse = await axios.get("http://127.0.0.1:3002/admin/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setFirstname(profileResponse.data.firstName || "");
      setLastname(profileResponse.data.lastName || "");
      setPhoneNumber(profileResponse.data.phoneNumber || "");
      setGender(profileResponse.data.gender || "");
      setDOB(profileResponse.data.dob || "");
      setStreet(profileResponse.data.street || "");
      setCity(profileResponse.data.city || "");
      setState(profileResponse.data.state || "");
      setCountry(profileResponse.data.country || "");

      setStoredProfileImage(localStorage.getItem("profileImage"));
    } catch (error) {
      console.error("API Error:", error);
    }
  }

  
   // Retrieve the stored image URL from localStorage
  const storedImageURL = localStorage.getItem("profileImageURL");
  if (storedImageURL) {
    setImagePreview(storedImageURL); // Set the imagePreview state
    setStoredProfileImage(storedImageURL); // Set the storedProfileImage state
  }
  fetchAdminProfile();
}, []);


useEffect(() => {
  setFormValid(validateForm());
}, [firstName, lastName, phoneNumber, gender, dob, street, city, state, country]);

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setProfileImage(selectedImage);
  
    const previewURL = URL.createObjectURL(selectedImage);
    setImagePreview(previewURL);
  
    // Store the selected image URL in local storage
    localStorage.setItem("profileImageURL", previewURL);
  };
  
  
  useEffect(() => {
    // Retrieve the stored image URL from localStorage
    const storedImageURL = localStorage.getItem("profileImageURL");
    if (storedImageURL) {
      setStoredProfileImage(storedImageURL);
      setImagePreview(storedImageURL); // Set the imagePreview as well
    }
  }, []);

  useEffect(() => {
    setFormValid(validateForm());
     // Retrieve the stored image URL from localStorage
  const storedImageURL = localStorage.getItem("profileImageURL");
  if (storedImageURL) {
    setStoredProfileImage(storedImageURL);
  }
  }, [firstName, lastName, phoneNumber, gender, dob, street, city, state, country]);
  

  const handleUpdateClick = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token available.");
        return;
      }
      
      if (!validateForm()) {
        console.error("Form validation failed.");
        return;
      }
  
      const formData = new FormData();
      formData.append("profileImage", profileImage);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("phoneNumber", phoneNumber);
      formData.append("gender", gender);
      formData.append("dob", dob);
      formData.append("street", street);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("country", country);
  

      await axios.put(
        `${serverBaseUrl}/admin/update`, // Update the URL
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update the image preview with the new URL
    const updatedPreviewURL = profileImage
    ? URL.createObjectURL(profileImage) // Create an object URL for the updated image
    : null;
  setImagePreview(updatedPreviewURL);

  // Update the storedProfileImage state and localStorage
  setStoredProfileImage(updatedPreviewURL);
  localStorage.setItem("profileImageURL", updatedPreviewURL);

      console.log("Update successful");
      setShowA(true);
  
    } catch (error) {
      console.error(error);
    }
  };

  const toggleAddressSection = () => {
    setAddressExpanded(!isAddressExpanded);
  };

  return (

    <div>
      <section>
      <AdminNavbar></AdminNavbar>
  <div className="container py-5 h-100">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col col-lg-12 mb-4 mb-lg-0">
        <div className="card mb-3">
          <div className="row g-0">
            <div className="col-md-4 gradient-custom text-center text-white">
            <label htmlFor="profileImage"  style={{ marginTop: '20px', fontWeight:700}}>Profile Image:</label>

<div className="profile-image-wrapper" style={{ marginLeft: '70px' }}>
  {imagePreview ? (
    <img className="profile-image" src={imagePreview} alt="Profile Preview" />
  ) : storedProfileImage ? (
    <img
      className="profile-image"
      src={storedProfileImage}
      alt="Profile"
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
  style={{ display: 'none' }} // Hide the actual input element
/>
<div className="emailtext">
<p>{adminEmail}</p>
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
                <h6>Information</h6>
                <hr className="mt-0 mb-4"/>
                <div className="row pt-1">
                  <div className="col-6 mb-3">
                    <div>
                    <TextField label="First Name" variant="filled" color="success" focused type="tel" id="firstName" value={firstName} onChange={(event) => setFirstname(event.target.value)} placeholder="Enter your Firstname" />
                      </div>
                      <div><br></br>
                      <TextField label="Phone Number" variant="filled" color="success" focused type="number" id="phoneNumber" name="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="10 digit phone number" required/>
                      </div>
                  </div>
                  <div className="col-6 mb-3">
                  <TextField label="Last Name" variant="filled" color="success" focused type="tel" id="lastName" value={lastName} onChange={(event) => setLastname(event.target.value)} placeholder="Enter your Lastname"/>
                        <div>
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
                          </div>
                          </div>
                          <div>
                      <label htmlFor="dob">Date of Birth:</label>
                      <input style={{height:"40px", width:"210px", borderColor:"green", borderTopColor:"green"}} variant="filled" color="success" focused  type="date" id="dob" value={dob} max={currentDate} onChange={(event) => setDOB(event.target.value)} />
                      </div>
                        </div>                
  <br></br>
                <h6>Address</h6>
                <hr className="mt-0 mb-4"/>
                <div className="row pt-1">
                <div className="col-6 mb-3">
            <div>
    <TextField label="Street" variant="filled" color="success" focused type="tel" id="street" value={street} onChange={(event) => setStreet(event.target.value)} placeholder="Street"/>
    </div>
<div>
  <br></br>
    <TextField label="City" variant="filled" color="success" focused type="tel" id="city" value={city} onChange={(event) => setCity(event.target.value)} placeholder="City"/>
 </div>
 </div><br></br>

 <div className="col-6 mb-3">
 <div>
 <TextField label="State" variant="filled" color="success" focused type="tel" id="state" value={state} onChange={(event) => setState(event.target.value)} placeholder="State"/>
 </div><br></br>
<div>
<TextField label="Country" variant="filled" color="success" focused type="tel" id="country" value={country} onChange={(event) => setCountry(event.target.value)} placeholder="Country"
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
};

export default AdminProfile;