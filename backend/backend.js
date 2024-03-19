const express = require("express");

const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const cors = require("cors");

const app = express();

const path = require("path");

const fs = require("fs");

const multer = require("multer");
const bodyParser = require("body-parser");

const secretkey = "PCP";
const crypto = require('crypto'); 
app.use(express.json());

app.use(cors({ origin: "http://localhost:3000" }));
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/PCP", {
  useNewUrlParser: true,

  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  email:{
  type:String,
  
  required: true, // Make it required

  unique: true, }  ,
  password: String,
  resetToken: String,
  resetTokenExpiry: Date,
  isAdmin: Boolean,
  isAdminApproved: {

    type: Boolean,
    
    default: false,
    
    },
  score: Number,
  totalScore: {
    type: Number,
    default: 0,
  },
  assignedQuizzes: [
    {
      quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
      },
      completed: {
        type: Boolean,
        default: false,
      },
      score: {
        type: Number,
        default: 0,
      },
      questionResults: [
        {
          questionIndex: Number,
          selectedOption: Number,
          isCorrect: Boolean,
        },
      ],
    },
    
  ],
  phoneNumber: String, // Add phoneNumber field

  qualification: String, // Add qualification field

  gender: String, // Add gender field

  dob: String, // Add dob field

  street: String, // Add street field

  city: String, // Add city field

  state: String, // Add state field

  country: String, // Add country field

  profileImageURL: String, // Add profileImageURL field

  profileImage: String,
  firstName:String,
  lastName: String

  
});
userSchema.methods.calculateTotalScore = function () {
  this.totalScore = this.assignedQuizzes.reduce((total, quiz) => total + quiz.score, 0);
};

const User = mongoose.model("User", userSchema);


app.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

    await user.save();

    // Create a transporter
   

    // Send reset email
    const mailOptions = {
      from: 'PCP Admin',
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <p>Dear User,</p>
        <p>You've requested a password reset. Please click the link below to reset your password:</p>
        <a href="http://localhost:3000/reset-password/${resetToken}">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,</p>
        <p>PCP Admin</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'An error occurred while sending the email' });
      } else {
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Password reset email sent successfully' });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});
//end of reset mail
//start of other endpint
app.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({ resetToken: token });

    if (!user) {
      return res.status(404).json({ error: 'User not found or invalid token' });
    }

    if (user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ error: 'Token has expired' });
    }

    // Update the password and reset token
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});


// In your server.js or routes configuration

app.post("/submit-quiz", async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decodedToken = jwt.verify(token, secretkey);

    const { quizId, answers } = req.body;

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    const user = await User.findById(decodedToken.userId);

    const assignedQuiz = user.assignedQuizzes.find((aq) =>
      aq.quiz.equals(quizId)
    );

    if (assignedQuiz.completed) {
      return res.status(400).json({ error: "Quiz already completed" });
    }

    let score = 0;

    answers.forEach((userAnswer) => {
      const correctOption =
        quiz.questions[userAnswer.questionIndex].correctOption;
      if (userAnswer.selectedOption === correctOption) {
        score++;
      }
    });

    // Collect question results with information about correctness
    const questionResults = answers.map((userAnswer) => {
      const correctOption =
        quiz.questions[userAnswer.questionIndex].correctOption;
      return {
        questionIndex: userAnswer.questionIndex,
        selectedOption: userAnswer.selectedOption,
        isCorrect: userAnswer.selectedOption === correctOption,
      };
    });

    // Update the assigned quiz as completed and store question results
    assignedQuiz.completed = true;
    assignedQuiz.score = score;
    assignedQuiz.questionResults = questionResults;

    // Calculate the total score based on completed quizzes
    const totalScore = user.assignedQuizzes.reduce((acc, aq) => {
      if (aq.completed) {
        return acc + aq.score;
      }
      return acc;
    }, 0);

    // Update the user's total score and save changes
    user.totalScore = totalScore;
    await user.save();

    const mailOptions = {
      from: 'PCP Admin',
      to: user.email,
      subject: 'Your Quiz Score and Update',
      text: `Dear User,\n\n` +
        `Congratulations! You scored ${score} points in the quiz "${quiz.title}". Your total score has been updated to ${totalScore} points. Keep up the excellent work!\n\n` +
        'Thank you for using our platform.\n\n' +
        'Best regards,\n' +
        'PCP Admin\n\n' +
        'Note: This is a system-generated email. Please do not reply to this message.',
    };
    

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(200).json({
      message: "Quiz submitted successfully",
      score,
      totalScore,
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});
app.get("/user/total-score", async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decodedToken = jwt.verify(token, secretkey);
    
    const user = await User.findById(decodedToken.userId);
    res.status(200).json({ totalScore: user.totalScore });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});


// Modify the /signup endpoint to assign a quiz to non-admin users
// Update the /signup endpoint to assign multiple quizzes
app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({ error: "Email already exists" });

    }
    const saltRounds =10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      email,
      password: hashedPassword,
      isAdmin: false,
    });

    const quizzesToAssign = await Quiz.find();

    quizzesToAssign.forEach((quiz) => {
      user.assignedQuizzes.push({ quiz: quiz._id });
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully and quizzes assigned" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});
// Update the /assign-quizzes-to-existing-users endpoint to assign multiple quizzes
// Update the /assign-quizzes-to-existing-users endpoint to assign all quizzes to existing users
app.post("/assign-quizzes-to-existing-users", async (req, res) => {
  try {
    const existingUsers = await User.find();
    const availableQuizzes = await Quiz.find();

    for (const user of existingUsers) {
      const newQuizzes = availableQuizzes.filter((quiz) => {
        return !user.assignedQuizzes.some((assignedQuiz) =>
          assignedQuiz.quiz.equals(quiz._id)
        );
      });

      newQuizzes.forEach((quiz) => {
        user.assignedQuizzes.push({ quiz: quiz._id });
      });

      await user.save();
    }

    res.status(200).json({ message: "New quizzes assigned to existing users" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});


app.post("/login", async (req, res) => {

  try {
  
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  
  if (!user) {
  
  return res.status(401).json({ error: "Invalid email or password" });
  
  }
  
  const passwordMatch = await bcrypt.compare(password, user.password);
  
  if (!passwordMatch) {
  
  return res.status(401).json({ error: "Invalid email or password" });
  
  }
  
  // Check if the user is an admin
  
  if (user.isAdmin) {
  
  if (!user.isAdminApproved) {
  
  return res.status(401).json({ error: "Admin approval pending" });
  
  }
  
  }
  
  const token = jwt.sign(
  
  { userId: user._id, isAdmin: user.isAdmin },
  
  secretkey,
  
  { expiresIn: "1h" }
  
  );
  
  res.status(200).json({ token, user: { _id: user._id, email: user.email, isAdmin: user.isAdmin } });
  
  } catch (error) {
  
  res.status(500).json({ error: "An error occurred" });
  
  }
  
  });


  app.post("/admin/signup", async (req, res) => {

    try {
    
    const { email, password } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const admin = new User({
    
    email,
    
    password: hashedPassword,
    
    isAdmin: true,
    
    });
    
    await admin.save();
    
    res.status(201).json({ message: "Admin registered successfully" });
    
    } catch (error) {
    
    res.status(500).json({ error: "An error occurred" });
    
    }
    
    });

function isAdmin(req, res, next) {
  const token = req.header("Authorization").replace("Bearer ", "");

  const decodedToken = jwt.verify(token, secretkey);

  if (!decodedToken.isAdmin) {
    return res.status(403).json({ error: "Access denied" });
  }

  next();
}

const quizSchema = new mongoose.Schema({
  title: String,
  questions: [
    {
      question: String,
      options: [String],
      correctOption: Number,
    },
  ],
  assignedTo: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      completed: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

const Quiz = mongoose.model("Quiz", quizSchema);

// Add this route to your backend code

// Add this route to your backend code
app.get("/quiz/:quizId", async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/user/challenges", async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decodedToken = jwt.verify(token, secretkey);

    const user = await User.findById(decodedToken.userId).populate({
      path: "assignedQuizzes.quiz",
      model: "Quiz",
    });

    res.status(200).json({ user:user, assignedQuizzes: user.assignedQuizzes });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});



const upload = multer({ dest: "uploads/" });

app.post("/admin/aq", isAdmin, upload.single("file"), async (req, res) => {

 

  const uploadedFile = req.file;

 

 

 

  const filePath = path.join(__dirname, uploadedFile.path);

 

 

 

  try {

 

    const quizData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

 

 

 

    const quiz = new Quiz(quizData);

 

 

 

    await quiz.save();

 

 

 

    res.status(201).json({ message: "Quiz uploaded successfully" });

 

  } catch (error) {

 

    res

 

      .status(500)

 

      .json({ error: "An error occurred while processing the uploaded file" });

 

  } finally {

 

    fs.unlinkSync(filePath);

 

  }

 

});
// Add this route to fetch the list of users
app.get("/users", isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "email");
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});


app.get("/leaderboard", async (req, res) => {
  try {
    const users = await User.find({}, "email isAdmin totalScore");

    const leaderboardData = users
      .filter((user) => !user.isAdmin) // Exclude admin users
      .map((user) => ({
        email: user.email,
        totalScore: user.totalScore,
      }));

    // Sort leaderboard data by total score
    leaderboardData.sort((a, b) => b.totalScore - a.totalScore);

    res.status(200).json(leaderboardData);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.delete("/admin/quiz/:quizId", isAdmin, async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const deletedQuiz = await Quiz.findByIdAndDelete(quizId);

    // Remove the reference to this quiz from all users' assignedQuizzes array
    await User.updateMany({}, { $pull: { assignedQuizzes: { quiz: quizId } } });

    // Recalculate and update total scores for all users
    const users = await User.find();
    for (const user of users) {
      user.calculateTotalScore();
      await user.save();

      const mailOptions = {
        from: 'PCP Admin',
        to: user.email,
        subject: 'Important: Quiz Deleted',
        text: `Dear User,\n\n` +
          `We want to inform you that the quiz "${deletedQuiz.title}" has been deleted by an administrator. We apologize for any inconvenience this may cause.\n\n` +
          'Thank you for your understanding.\n\n' +
          'Best regards,\n' +
          'PCP Admin\n\n' +
          'Note: This is a system-generated email. Please do not reply to this message.',
      };
      

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    }

    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});


const nodemailer = require('nodemailer');

// Create a transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', // e.g., 'Gmail'
  auth: {
    user: 'sairajdeep1454@gmail.com',
    pass: 'jdoyyiqzrupcspkc',
  },
});
app.get('/users-analytics', isAdmin, async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }, 'email totalScore assignedQuizzes')
      .populate('assignedQuizzes.quiz', 'title marks'); // Assuming assignedQuizzes contains a reference to the Quiz schema

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Add this route to your backend code
app.post('/admin/send-quiz-upload-emails', isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, 'email');

    for (const user of users) {
      const mailOptions = {
        from: 'PCP Admin ',
        to: user.email,
        subject: 'New Quiz Uploaded',
        text: `Dear User,\n\n` +
          `A new quiz has been uploaded by an administrator. Please log in to your account to attend the quiz.\n\n` +
          'Thank you for using our platform.\n\n' +
          'Best regards,\n' +
          'PCP Admin\n\n' +
          'Note: This is a system-generated email. Please do not reply to this message.',
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    }

    res.status(200).json({ message: 'Quiz upload emails sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Endpoint to fetch admin email

app.get("/admin/email", isAdmin, async (req, res) => {

  try {

    const token = req.header("Authorization").replace("Bearer ", "");

    const decodedToken = jwt.verify(token, secretkey);

 

    const admin = await User.findById(decodedToken.userId);

 

    if (!admin || !admin.isAdmin) {

      return res.status(404).json({ error: "Admin not found" });

    }

 

    res.status(200).json({ adminEmail: admin.email, adminId: admin._id });

  } catch (error) {

    res.status(500).json({ error: "An error occurred" });

  }

});

 

// Update user information and profile image
app.put("/user/update", upload.single("profileImage"), async (req, res) => {

  try {

    const token = req.header("Authorization").replace("Bearer ", "");
    const decodedToken = jwt.verify(token, secretkey);
    const {
      firstName,
      lastName,
      phoneNumber,
      qualification,
      gender,
      dob,
      street,
      city,
      state,
      country,
    } = req.body;

    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Update the user's profile information

    user.firstName = firstName;
    user.lastName = lastName;
    user.phoneNumber = phoneNumber;
    user.qualification = qualification;
    user.gender = gender;
    user.dob = dob;
    user.street = street;
    user.city = city;
    user.state = state;
    user.country = country;

    if (req.file) {
      const uploadedFile = req.file;
      user.profileImage = uploadedFile.path;
    }

    await user.save();
    res.status(200).json({ message: "User information updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

 

 

 

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.put("/admin/update", isAdmin, upload.single("profileImage"), async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decodedToken = jwt.verify(token, secretkey);
    const {
      firstName,
      lastName,
      phoneNumber,
      gender,
      dob,
      street,
      city,
      state,
      country,
    } = req.body;
    const admin = await User.findById(decodedToken.userId);

    if (!admin || !admin.isAdmin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    // Update the admin's profile information
    admin.firstName = firstName;
    admin.lastName = lastName;
    admin.phoneNumber = phoneNumber;
    admin.gender = gender;
    admin.dob = dob;
    admin.street = street;
    admin.city = city;
    admin.state = state;
    admin.country = country;

    if (req.file) {
      const uploadedFile = req.file;
      admin.profileImage = uploadedFile.path;
      admin.profileImageURL = uploadedFile.path; // Store the image URL in admin's data
    }
 
    await admin.save();
    res.status(200).json({ message: "Admin information updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});
 

 

 

app.get("/admin/profile", isAdmin, async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decodedToken = jwt.verify(token, secretkey);

    const admin = await User.findById(decodedToken.userId);
    if (!admin || !admin.isAdmin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.status(200).json({
      firstName: admin.firstName,
      lastName: admin.lastName,
      phoneNumber: admin.phoneNumber,

      gender: admin.gender,

      dob: admin.dob,

      street: admin.street,

      city: admin.city,

      state: admin.state,

      country: admin.country,

    });

  } catch (error) {

    res.status(500).json({ error: "An error occurred" });

  }

});



app.post("/admin/send-approval-request", async (req, res) => {

  try {
  
  const { email, description } = req.body;
  
  const mailOptions = {
  
  from: "PCP Admin",
  
  to: "ramanpannu1411@gmail.com", // Replace with the super admin's email address
  
  subject: "Admin Approval Request",
  
  html: `
  
  <p>You have received an admin approval request from the following user:</p>
  
  <p>Email: ${email}</p>
  
  <p>Description: ${description}</p>
  
  <p>Please review the request and take appropriate action:</p>
  
  <a href="http://localhost:3002/admin/approve?email=${email}">Approve</a>
  
  <p>Best regards,</p>
  
  <p>PCP Admin</p>
  
  `,
  
  };
  
  // Send the approval request email
  
  transporter.sendMail(mailOptions, (error, info) => {
  
  if (error) {
  
  console.error("Error sending email:", error);
  
  res.status(500).json({ error: "An error occurred" });
  
  } else {
  
  console.log("Email sent:", info.response);
  
  res.status(200).json({ message: "Approval request email sent successfully" });
  
  }
  
  });
  
  } catch (error) {
  
  res.status(500).json({ error: "An error occurred" });
  
  }
  
  });
  
  // ... Other imports and middleware
  
  // Approve admin
  
  app.get("/admin/approve", async (req, res) => {

    try {
  
      const { email } = req.query;
  
   
  
      // Find the user with the provided email in the database
  
      const user = await User.findOne({ email });
  
   
  
      if (!user) {
  
        return res.status(404).json({ error: "User not found" });
  
      }
  
   
  
      // Update the user's isAdminApproved field to true
  
      user.isAdminApproved = true;
  
      await user.save();
  
   
  
      // Send an approval email to the user
  
      const mailOptions = {
  
        from: "PCP Admin",
  
        to: user.email,
  
        subject: "Admin Approval Granted",
  
        html: `
  
          <p>Dear User,</p>
  
          <p>Your admin approval request has been granted. You are now approved as an admin on our platform.</p>
  
          <p>Thank you for being a part of our community.</p>
  
          <p>Best regards,</p>
  
          <p>PCP Admin</p>
  
        `,
  
      };
  
   
  
      transporter.sendMail(mailOptions, (error, info) => {
  
        if (error) {
  
          console.error("Error sending email:", error);
  
        } else {
  
          console.log("Approval email sent:", info.response);
  
        }
  
      });
  
   
  
      // Send a response indicating successful approval
  
      res.status(200).json({ message: "User approved successfully" });
  
    } catch (error) {
  
      console.error("Error approving user:", error);
  
      res.status(500).json({ error: "An error occurred" });
  
    }
  
  });
  // Deny admin
  

app.listen(3002, () => {
  console.log("Server is running on port 3002");
});