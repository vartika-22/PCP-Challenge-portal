import './App.css';
import Login from './components/Login';
import {BrowserRouter , Routes,Route,useParams} from 'react-router-dom';
import Navbar from './components/side-navbar';
import CarouselComponent from './components/carousel';
import SearchBar from './components/searchbar';
import SignUp from './components/signup';
// import 'bootstrap/dist/css/bootstrap.min.css';
import Leaderboard from './pages/Leaderboard';
import AnalyticsPage from './pages/analytics.js';
import Challenges from './pages/Challenges';
import ExamPage2 from './pages/ExamPage2';
import ExamPage1 from './pages/ExamPage1';
import Userdetails from './pages/userdetails';
import Profile from './pages/profile';
import AdminSignup from './pages/adminsignin';
import UploadQuiz from './pages/adminquizupload';
import QuizPage from './pages/quiz';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminProfile from './pages/adminProfile';
import AdminLeaderboard from './pages/adminLeaderboard';
import AdminAnalytics from './pages/adminAnalytics';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';



function App() {
  
const isAdmin=localStorage.getItem('isAdmin')==='true';
const  quizId  = useParams();
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
      
      <Route path='/' element={<Login/>}/>
      <Route path='/signup' element={<SignUp/>}/>
      <Route path='/nav' element={<Navbar/>}/>
      <Route path='/dash' element={<CarouselComponent/>}/>
      <Route path='/Analytics' element={<AnalyticsPage/>}/>
      <Route path='/Leaderboard' element={<Leaderboard/>}/>
      <Route path='/Challenges' element={<Challenges/>}/>
      <Route path='/cyber' element={<ExamPage1/>}/>
      <Route path='/data' element={<ExamPage2/>}/>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/admin' element={<AdminSignup/>}/>
      <Route path='/adminprofile' element={<AdminProfile/>}/>
      <Route path='/adminLeaderboard' element={<AdminLeaderboard/>}/>
      <Route path='/adminAnalytics' element={<AdminAnalytics/>}/>
      <Route path='/forgot-password' element={<ForgotPassword/>}/>
      <Route path='/reset-password/:token' element={<ResetPassword/>}/>
      
      
    { isAdmin ?(
      <Route path='/aq' element={<UploadQuiz/>}/>
      
 ):(
  <Route path='/dash' element={<CarouselComponent />}/>
 ) }
 <Route path='/quiz/:quizId' element={<QuizPage />} />
      
      
      
      
      
      </Routes>
      
      </BrowserRouter>
    </div>
  );
}

export default App;
