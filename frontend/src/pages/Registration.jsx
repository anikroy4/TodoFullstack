import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const Registration = () => {
  const [form,setForm]=useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const dispatch=useDispatch();
  const {message, error}= useSelector((state)=>state.auth);

  

  return (
    <div>Registration</div>
  )
}

export default Registration