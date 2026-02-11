import React, { useState } from 'react'
import './style.css'
import { NavLink, useNavigate } from 'react-router-dom'
import PageBanner from '../../components/PageBanner/PageBanner'
import { X } from 'lucide-react'
import { app } from '../../firebase'
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth'

const Signin = () => {
  const [popup, setPopup] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [forgetEmail, setForgetEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  
 const navigate = useNavigate()

  const HandelPOPup = () => {
    setPopup(!popup)
  }

  const auth = getAuth(app)

  const SignIn = async () => {
    if (!email || !password) {
      setErrorMessage('Both fields are required.')
      return
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.')
      return
    }

    try {
      setLoading(true)
      await signInWithEmailAndPassword(auth, email, password)
      console.log('Sign In Complete............')
      setLoading(false)
      navigate('/cart')
      setEmail('')
      setPassword('')
      setErrorMessage('')
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('This email is already registered.')
      } else {
        setErrorMessage('Error signing in. Please check your credentials.')
      }
      setLoading(false)
    }
  }

  const ResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, forgetEmail)
      console.log('Email Sent')
      setForgetEmail('')
    } catch (error) {
      console.log('Email Not Found')
    }
  }

  return (
    <div className='signin-container'>
      <PageBanner heading={'Sign in'} />
      <div className="signin-content">
        <div className="signin-form-container">
          <div className="signin-form">
            <div className="signin-form-heading">
              <span>Sign in</span>
            </div>
            <div className="signin-inputs">
         
              <div className="signin-input-box">
                <span>Email Or Phone No</span>
                <input
                  type="text"
                  placeholder='Email Or Phone No'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="signin-input-box">
                <span>Password</span>
                <input
                  type="password"
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {errorMessage && <div className="error-message">{errorMessage}</div>}
              <div className="signin-btn">
                <button onClick={SignIn}>{loading ? 'Loading...' : 'Sign in'}</button>
              </div>
            </div>
            <div className="signin-footer">
              <div className="signin-footer-text">
                <span onClick={HandelPOPup}>Forget Password</span>
              </div>
            </div>
          </div>
        </div>
        <div className="signin-text">
          <span>Hello, Friend!</span>
          <p>Enter Your Personal Details and Start Journey With Us</p>
          <NavLink to={'/signup'} style={{ textDecoration: 'none' }}>
            <button>Sign Up</button>
          </NavLink>
        </div>
      </div>
      <div className={` ${popup ? 'forget-password-popup' : 'hide-popup'}`}>
        <div className="forget-password-box">
          <span>Forgot Your Password ?</span>
          <div className="forget-password-input">
            <span>Enter Your Email To Reset Password</span>
            <input
              type="text"
              placeholder='example123@gmail.com'
              value={forgetEmail}
              onChange={(e) => setForgetEmail(e.target.value)}
            />
          </div>
          <button onClick={ResetPassword}>Reset Password</button>
          <div className="forget-close" onClick={HandelPOPup}>
            <X size={16} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signin
