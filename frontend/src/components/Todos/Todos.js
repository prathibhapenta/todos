import React, { useState, useEffect, useCallback } from 'react'
import "./Todos.css"
import {useNavigate} from 'react-router-dom'

const API = process.env.REACT_APP_BASE_URL
console.log(API)
const Todos = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [todo, setTodo] = useState([])
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const navigate = useNavigate();

 const getTodo = useCallback(async () => {
  const token = localStorage.getItem('token')

  const response = await fetch(`${API}/todos/gettodo`, {
    headers: {
      Authorization: token
    }
  })

  if (response.status === 401) {
    localStorage.removeItem('token')
    navigate('/login')
    return
  }

  const data = await response.json()
  setTodo(data)
}, [navigate])
  
useEffect(() => {
  const token = localStorage.getItem('token')

  if (!token) {
    navigate('/login')
  } else {
    getTodo()
  }
}, [navigate, getTodo])

const handlelogout = () => {
  localStorage.removeItem('token')
    navigate('/login')
  }

  const addTodo = async(e) => {
    e.preventDefault()
     if(!name.trim() || !description.trim()){
    alert("All fields are required")
    return
  }
    const token = localStorage.getItem('token')
    await fetch(`${API}/todos/inserttodo`,{
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({name,description})
    })
    await getTodo()
    setName('')
    setDescription('')
   

  }
  
 const deletetodo = async(id) => {
  const token = localStorage.getItem('token')
  await fetch(`${API}/todos/deletetodo/${id}`,
    {method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      }
      
    }
  )
  getTodo()
  setName('')
  setDescription('')
 }
 const updateTodo = async (id) => {
  const token = localStorage.getItem('token')
  await fetch(`${API}/todos/updatetodo/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    },
    body: JSON.stringify({
      name: editName,
      description: editDescription
    })
  })

  await getTodo()

  setEditId(null)
  setEditName('')
  setEditDescription('')
}
  return (
    <div className='bg-container'>
     <form className='form-container'onSubmit = {addTodo} >
        <h1 className='heading'>Todo List App</h1>
        <div className='todo-container'>

        <input className='input'
        placeholder = "Enter new Todo" 
        value = {name} 
        onChange = {(e) => setName(e.target.value)} />

        <input className='input' 
        placeholder = "Description" value = {description} 
        onChange = {(e) => setDescription(e.target.value)} />

        <button type = "submit" >Add User</button>

        </div>
        
       <ul className='todo-ul'>
        {todo.map(eachitem => (
  <li className='todo-li' key={eachitem.id}>
    {editId === eachitem.id ? (
      <>
        <input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
        />

        <input
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
        />

        <button
          type="button"
          onClick={() => updateTodo(eachitem.id)}
        >
          Save
        </button>
      </>
    ) : (
      <>
  <div className="todo-content">
    
      {eachitem.name} - {eachitem.description}
    
  </div>

  <div className="button-container">
    <button
      type="button"
      onClick={() => {
        setEditId(eachitem.id)
        setEditName(eachitem.name)
        setEditDescription(eachitem.description)
      }}
    >
      Edit
    </button>

    <button
      type="button"
      onClick={() => deletetodo(eachitem.id)}
    >
      Delete
    </button>
  </div>
</>
    )}
  </li>
))}
       </ul>
      <div className="logout-container">
  <button
    type="button"
    className="logout-btn"
    onClick={handlelogout}
  >
    Logout
  </button>
</div>
      </form>
      
     
      
    </div>
  )
}


export default Todos
