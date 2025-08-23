import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input.jsx'
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import Dashboard from '../Home/Dashboard.jsx';
import { UserContext } from '../../context/userContext.jsx';
import SpinnerLoader from '../../components/Loaders/SpinnerLoader.jsx';

const Login = ({setcurrentPage}) => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState(null);
  const [isLoading, setisLoading] = useState(false)

  const {updateUser} = useContext(UserContext)

  const navigate = useNavigate();

  const handleLogin = async (e)=>{
    e.preventDefault();

    if(!validateEmail(email)) {
      seterror("Please enter an valid email address")
      return
    }
    if(!password) {
      seterror("Please enter the password")
      return
    }
    
    seterror("");
    setisLoading(true)

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      })
      const {token} = response.data
      if(token) {
        localStorage.setItem("token",token)
        updateUser(response.data)
        navigate("/dashboard")
      }
    } catch (error) {
      if(error.response && error.response.data && error.response.data.message) {
        seterror(error.response.data.message)
      } else {
        seterror("Something went wrong. Please try again!")
      }
    } finally {
      setisLoading(false)
    }
  }

  return (
    <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>
      <h3 className='text-lg font-semibold text-black'>Welcome Back</h3>
      <p className='text-xs text-slate-700 mt-[5px] mb-6'>Please enter your detail to login</p>
      <form action="" onSubmit={handleLogin}>
        <Input type="text" value={email} onChange={({target})=> setemail(target.value)} label='Email Address' placeholder='harsh@gmail.com' />
        <Input type="password" value={password} onChange={({target})=> setpassword(target.value)} label='Password' placeholder='Min 8 Character' />
        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
        <button type='submit' className='btn-primary'>Login</button>
        <p className='text-[13px] text-slate-800 mt-3'>Don't have an account?{""}
          <button className='font-medium text-primary underline cursor-pointer' onClick={()=> { setcurrentPage("signup")}} disabled={isLoading}>{isLoading ? (
            <>
              <SpinnerLoader />
              <span>Logging in...</span>
            </>
          ) : (
            "Login"
          )}</button>
        </p>
      </form>
    </div>
  )
}

export default Login