import React, {useState} from 'react'
import '../Login/Login.css'
import { useNavigate } from 'react-router-dom'

const API = process.env.REACT_APP_BASE_URL

const Register = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const navigate = useNavigate();

    const handleRegister = async(e) => {
        e.preventDefault()
        let hasError = false

        if(!email.trim()){
            setEmailError("Email Required *")
            hasError = true
        }
        if(!password.trim() ){
            setPasswordError("Password Required *")
            hasError = true
        }
        if(hasError){
            return
        }
        setEmail('')
        setPassword('')
        const response = await fetch(`${API}/todos/register`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email,password})
            }
        )
        const data = await response.json()
        if(response.ok){
            setSuccessMsg("Register Successfull")
            setEmail('')
            setPassword('')
            navigate('/login')

        }
        else{
            setSuccessMsg('')
            setPasswordError(data.message)
            
        }
       

    }
  return (
    <div className="login-bg-container">
     <form className="login-form-container" onSubmit = {handleRegister}>
         <h1 className="login-heading">Register</h1>

      <input type = "email"
      className="login-input"
       placeholder = "Enter Email"
       value = {email} 
       onChange = {(e) => {setEmail(e.target.value); setEmailError('')}}/>
       {emailError && <p className='error-message' >{emailError}</p>}

      <input type = "password"
      className="login-input"
       placeholder = "Enter Password"
       value = {password} onChange = {(e) => {setPassword(e.target.value); setPasswordError('')}}/>
       {passwordError && <p className='error-message'>{passwordError}</p>}

      <button className="login-button">Register</button>
      {successMsg && (
    <p className="success-message">{successMsg}</p>)}
     </form>
    </div>
  )
}

export default Register
