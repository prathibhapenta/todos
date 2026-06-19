import React,{useState} from 'react'
import { useParams ,useNavigate} from 'react-router-dom'

const API = process.env.REACT_APP_BASE_URL

const ResetPassword = () => {
    const[newPassword, setNewPassword] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const {email} = useParams()
    const navigate = useNavigate()
    const handleUpdate = async() => {
        
        const response = await fetch(`${API}/todos/reset-password`, {
            method: "PUT",
            headers : {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({email,newPassword})
        })
        const data = await response.json()
          if(response.ok){       
            setSuccessMsg(data.message)
            setNewPassword('')
            setTimeout(() => {
                navigate('/')
            },2000)
           }


    }
  return (
    <div>
        <h1>Reset Password</h1>
      <input type= "password" 
      value = {newPassword} 
      placeholder= "Enetr New Password"
     onChange = {(e) => setNewPassword(e.target.value)}/>
     <button onClick = {handleUpdate}>Update Password</button>
     {successMsg && (
  <p>{successMsg}</p>
)}
    </div>
  )
}

export default ResetPassword
