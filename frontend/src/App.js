import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Todos from './components/Todos/Todos'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Todos />} />
        <Route path="/login" element={<Login />} />
        <Route path = "/register" element = {<Register/>}/>
        <Route path="/todos" element={<Todos />} />
        <Route path = "/forgot-password" element = {<ForgotPassword/>}/>
        <Route path = "/reset-password/:email" element = {<ResetPassword/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App