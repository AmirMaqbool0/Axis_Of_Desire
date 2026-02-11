import React, { useState } from 'react'
import './style.css'
import { NavLink } from 'react-router-dom'
import PageBanner from '../../components/PageBanner/PageBanner'
import { app } from '../../firebase'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import { doc, getFirestore, setDoc } from 'firebase/firestore'

const Signup = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const db = getFirestore(app)

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const isValidPhoneNumber = (phone) => {
    return /^\d{10,15}$/.test(phone)
  }

  const createUserAndAddUserToFirestore = async () => {
    setErrorMessage('')

    if (!firstName || !lastName || !email || !phone || !password) {
      setErrorMessage('All fields are required.')
      return
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address.')
      return
    }

    if (!isValidPhoneNumber(phone)) {
      setErrorMessage('Please enter a valid phone number.')
      return
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.')
      return
    }

    try {
      setLoading(true)
      const auth = getAuth(app)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      await addUserToFirestore(user.uid)
      console.log('User Created..')
      setEmail('')
      setPassword('')
      setFirstName('')
      setLastName('')
      setPhone('')
      setLoading(false)
    } catch (error) {
      console.error('Error creating user:', error.code, error.message)
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('This email is already registered.')
      } else {
        setErrorMessage('Error creating account. Please try again.')
      }
      setLoading(false)
    }
  }

  const addUserToFirestore = async (userId) => {
    try {
      setLoading(true)
      const data = {
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phone,
        uid: userId,
        email: email,
      }
      await setDoc(doc(db, 'users', `${userId}`), data)
      console.log('User data added to Firestore successfully')
      setLoading(false)
    } catch (error) {
      console.error('Error adding user data to Firestore:', error)
      setLoading(false)
    }
  }

  return (
    <div className='signup-container'>
      <PageBanner heading={'Sign up'} />
      <div className="signup-content">
        <div className="signup-form-container">
          <div className="signup-form">
            <div className="signup-heading">
              <span>Create An Account</span>
            </div>
            <div className="signup-inputs">
           
              <div className="name-inputs">
                <div className="name-input-box">
                  <span>First Name</span>
                  <input
                    type="text"
                    placeholder='First Name'
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="name-input-box">
                  <span>Last Name</span>
                  <input
                    type="text"
                    placeholder='Last Name'
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="input-box">
                <span>Email</span>
                <input
                  type="text"
                  placeholder='Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-box">
                <span>Phone Number</span>
                <input
                  type="text"
                  placeholder='Phone Number'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="input-box">
                <span>Password</span>
                <input
                  type="password"
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {errorMessage && <div className="error-message">{errorMessage}</div>}
              <div className="signup-btn">
                <button onClick={createUserAndAddUserToFirestore}>
                  {loading ? 'Loading...' : 'Create Account'}
                </button>
              </div>
            </div>
            <div className="signup-footer">
              <span>Already Have An Account ?</span>
              <NavLink to={'/signin'} style={{ textDecoration: 'none' }}>
                <p>Sign In</p>
              </NavLink>
            </div>
          </div>
        </div>

        <div className="signup-content-text">
          <span>Welcome Back!</span>
          <p>To Keep Connected With Us Please Login With Your Personal Info</p>
          <NavLink to={'/signin'} style={{ textDecoration: 'none' }}>
            <button>Sign in</button>
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default Signup
