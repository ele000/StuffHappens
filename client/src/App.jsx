import "bootstrap/dist/css/bootstrap.min.css";
import { useState , useEffect} from 'react'
import './App.css'
import { Navigate, Route ,Routes } from "react-router";
import NavbarHeader from "./components/NavbarHeader";
import NotFound from "./components/NotFound"
import WelcomePage from "./components/WelcomePage";
import DemoRules from "./components/DemoRules";
import LoginForm from "./components/LoginForm";
import LoginRules from "./components/LoginRules";
import PlayZone from "./components/PlayZone";
import UserProfile from "./components/UserProfile";
import PlayDemo from "./components/PlayDemo";
import API from "./API/API.mjs";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [message,setMessage] = useState('');


/* 
  useEffect(() => {
    const checkAuth = async () => {
      const user = await API.getUserInfo(); 
      setLoggedIn(true);
      setUser(user);
    }
    checkAuth();
  }, []);
*/

  const handleLogin = async (credentials) => {
    try{
      const result = await API.login(credentials);
      setLoggedIn(true);
      setMessage({msg: 'Welcome ' + result.username , type: 'success'});
      setUser(result);
    }catch(error){
      setMessage({msg:  error, type:'danger'});
    }
  }


  const handleLogout = async () => {
      await API.logout();
      setLoggedIn(false);
      setMessage('');
      setUser({});
  };

  
  return (
    <>
      <Routes>
        <Route element={<NavbarHeader message={message} setMessage={setMessage}/>} >
          <Route path="/" element={<WelcomePage />} />
          <Route path='/demo' element={<DemoRules />} />
          <Route path='/demo/game' element={<PlayDemo />} />
          <Route path='/login' element={loggedIn ? <Navigate to='/home'/> : <LoginForm handleLogin={handleLogin}/>} />
          <Route path='/home' element={loggedIn ? <LoginRules user={user} handleLogout={handleLogout}/> : <Navigate to='/login' />}/>
          <Route path='/home/userProfile' element={loggedIn ? <UserProfile user={user} /> : <Navigate to='/login' />} />
          <Route path='/home/game' element={loggedIn ? <PlayZone user={user}/> : <Navigate to='/login' />}/>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
