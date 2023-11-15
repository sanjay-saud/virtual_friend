import { useState } from 'react';
import './App.css';
import Chat from './Components/Chat';
import { Login_Signup } from './Components/Login-Signup'; 
import {KindeProvider} from "@kinde-oss/kinde-auth-react";

const App = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <KindeProvider
        clientId="fa76f3f4f22d4df78c1a829fa1c53e5b"
        domain="https://sanjaysaud.kinde.com"
        logoutUri={window.location.origin}
        redirectUri={window.location.origin}
          onRedirectCallback={(user, app_state) => {
            console.log({user, app_state});
            setIsLoggedIn(true);  // Set logged in state to true upon successful redirection
        }}
    >
      {isLoggedIn ? <Chat /> : <Login_Signup />}
    </KindeProvider>
  );
}

export default App;

