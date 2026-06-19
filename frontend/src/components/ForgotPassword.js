import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'

const API = process.env.REACT_APP_BASE_URL

const ForgotPassword = () => {
    const [email,setEmail] = useState('')
    const navigate = useNavigate()
    const verifyPassword = async () => {
        const response = await fetch(`${API}/todos/forgot-password`, 
            {method: "POST",
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({email})
            }
        )
        const data = await response.json()
        alert(data.message)
        if(response.ok){
            setEmail('')
            
              navigate(`/reset-password/${email}`)
        }
    }
  return (
    <div>
        <input type = 'email'
         value = {email} 
         placeholder = "Enter Email"
         onChange = {(e) => setEmail(e.target.value)}/>

         <button onClick = {verifyPassword}>Verify Email</button>
      
    </div>
  )
}

export default ForgotPassword
