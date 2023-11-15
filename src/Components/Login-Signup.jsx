import React, { useState } from 'react'
import './Login-Signup.css'
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';

import logo from './Assets/logo.png'
import email_icon from './Assets/email.png'
import person_icon from './Assets/person.png'
import password_icon from './Assets/password.png'

export const Login_Signup = () => {

  const [action,setAction] = useState("Sign Up")
  const { login} = useKindeAuth();

  return (
    <div className='login-container'>
        <div className='landing-content'>
              <h1>Welcome to CodePilot</h1>
            <p>AI-powered coding virtual friend. Solve coding problems effortlessly with our interactive chat.</p>
        </div>
        <div className="submit-container">
            <button type="button" onClick={login} className={action==="Sign Up"?"submit gray":"submit"}>Get Started</button>
        </div>
    </div>

  )
}
