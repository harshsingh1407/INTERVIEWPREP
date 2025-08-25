import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import Photo from '../../components/Inputs/Photo';
import { UserContext } from '../../context/userContext';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
// import uploadImage from '../../utils/uploadImage';
import { validateEmail } from '../../utils/helper';
import SpinnerLoader from '../../components/Loaders/SpinnerLoader';
import { image } from '../../../../Backend/config/cloudinary';

const Signup = ({ setcurrentPage }) => {
  const [profilePic, setprofilePic] = useState(null);
  const [fullName, setfullName] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState(null);
  const [isLoading, setisLoading] = useState(false);

  const { updateUser } = useContext(UserContext)
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // let profileImageUrl = "";

    if (!fullName) {
      seterror("Please Enter full name");
      return;
    }

    if (!validateEmail(email)) {
      seterror("Please enter an valid email address")
      return
    }

    if (!password) {
      seterror("Please enter the password")
      return
    }

    seterror()
    setisLoading(true)

    try {
      const data = new FormData()
      data.append("name", fullName);
      data.append("email", email);
      data.append("password", password);
      if (profilePic) {
        data.append("profileImage",profilePic); // 👈 must match backend `upload.single("profileImage")`
      }

      const response = await axiosInstance.post(
        API_PATHS.AUTH.REGISTER,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      // Upload image if present
      // if(profilePic) {
      //   const imgUploadRes = await uploadImage(profilePic)
      //   profileImageUrl = imgUploadRes.imageURL || ""
      // }
      // const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
      //   name:fullName,
      //   email,
      //   password,
      //   profileImageUrl,
      // })
      const { token } = response.data
      if (token) {
        localStorage.setItem("token", token)
        updateUser(response.data)
        navigate("/dashboard")
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
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
      <h3 className='text-lg font-semibold text-black'>Creates an Accounts</h3>
      <p className='text-xs text-slate-700 mt-[2px] mb-2'>Join us today by entering your details below</p>
      <form action="" onSubmit={handleSignup}>
        <Photo Image={profilePic} setImage={setprofilePic} />
        <div className='grid grid-cols-1 md:grid-cols-1 gap-1'>
          <Input type='text' value={fullName} onChange={({ target }) => setfullName(target.value)} label='Full Name' placeholder='Harsh Singh' />
          <Input type='email' value={email} onChange={({ target }) => setemail(target.value)} label='Email Address' placeholder='harsh@gmail.com' />
          <Input type='password' value={password} onChange={({ target }) => setpassword(target.value)} label='Password' placeholder='Min 8 Character' />
          {error && <p className='text-red-500 text-xs'>{error}</p>}
          <button type='submit' className='btn-primary' disabled={isLoading}>{isLoading && <SpinnerLoader />}Signup</button>
          <p className='text-[13px] text-slate-800'>Already an Account?{""}
            <button className='font-medium text-primary underline cursor-pointer' onClick={() => setcurrentPage("login")}>Login</button>
          </p>
        </div>

      </form>
    </div>
  )
}

export default Signup