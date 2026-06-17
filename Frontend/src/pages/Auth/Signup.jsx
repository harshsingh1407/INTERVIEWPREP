import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import Photo from '../../components/Inputs/Photo';
import { UserContext } from '../../context/userContext';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { validateEmail } from '../../utils/helper';
import SpinnerLoader from '../../components/Loaders/SpinnerLoader';
import { LuUserPlus, LuX } from 'react-icons/lu';

const Signup = ({ setcurrentPage, onClose }) => {
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

    if (!fullName) {
      seterror("Please enter your full name");
      return;
    }

    if (!validateEmail(email)) {
      seterror("Please enter a valid email address")
      return
    }

    if (!password) {
      seterror("Please enter a password")
      return
    }

    if (password.length < 8) {
      seterror("Password must be at least 8 characters long")
      return
    }

    seterror(null)
    setisLoading(true)

    try {
      const data = new FormData()
      data.append("name", fullName);
      data.append("email", email);
      data.append("password", password);
      if (profilePic) {
        data.append("profileImage", profilePic);
      }

      const response = await axiosInstance.post(
        API_PATHS.AUTH.REGISTER,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const { token } = response.data
      if (token) {
        localStorage.setItem("token", token)
        updateUser(response.data)
        navigate("/dashboard")
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        seterror(error.response.data.message)
      } else {
        seterror("Something went wrong. Please try again!")
      }
    } finally {
      setisLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-sm font-sans antialiased">

      {/* White Floating Card Box */}
      <div className='w-full max-w-[420px] bg-white rounded-2xl flex flex-col justify-start shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] border border-stone-100 max-h-[85vh] overflow-y-auto pt-8 pb-6 px-6 sm:px-8 custom-scrollbar relative'>

        {/* PREMIUM CANCEL (X) BUTTON */}
        <button
          type="button"
          onClick={() => onClose ? onClose() : navigate("/")}
          className='absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-950 hover:bg-stone-100 active:scale-95 transition-all cursor-pointer'
          aria-label="Close"
        >
          <LuX className="w-5 h-5" />
        </button>

        {/* Modern Premium Micro Badge */}
        <div className='inline-flex items-center gap-1.5 text-[9px] font-bold tracking-[0.12em] uppercase text-orange-700 bg-orange-100/50 px-2.5 py-1 rounded-full border border-orange-200/40 w-fit mb-3 flex-shrink-0'>
          <LuUserPlus className="text-[#FF9324] w-3 h-3" /> Create Account
        </div>

        <h3 className='text-xl sm:text-2xl font-black text-stone-950 tracking-tight leading-none flex-shrink-0'>Get Started</h3>
        <p className='text-xs text-stone-500 mt-1 mb-4 font-light leading-relaxed flex-shrink-0'>
          Join us today by entering your details below to set up your account.
        </p>

        <form onSubmit={handleSignup} className="flex flex-col flex-grow">
          {/* Centered Avatar/Photo Upload */}
          <div className='flex justify-center mb-3 flex-shrink-0'>
            <Photo Image={profilePic} setImage={setprofilePic} />
          </div>

          {/* Clean Input Stack */}
          <div className='flex flex-col gap-y-3.5 mb-4'>
            <Input
              type='text'
              value={fullName}
              onChange={({ target }) => setfullName(target.value)}
              label='Full Name'
              placeholder='Harsh Singh'
            />

            <Input
              type='email'
              value={email}
              onChange={({ target }) => setemail(target.value)}
              label='Email Address'
              placeholder='harsh@gmail.com'
            />

            <Input
              type='password'
              value={password}
              onChange={({ target }) => setpassword(target.value)}
              label='Password'
              placeholder='Min 8 Characters'
            />
          </div>

          {error && (
            <div className='text-red-600 bg-red-50/50 border border-red-100 rounded-xl px-3 py-2 text-xs font-medium mb-3 flex-shrink-0'>
              {error}
            </div>
          )}

          {/* Premium Action CTA Button */}
          <div className="mt-auto pt-2 flex flex-col gap-y-2.5 flex-shrink-0">
            <button
              type='submit'
              className='w-full bg-stone-950 text-stone-50 text-sm font-semibold tracking-wide py-3.5 rounded-xl hover:bg-[#FF9324] hover:shadow-lg hover:shadow-orange-200/50 transition-all duration-300 cursor-pointer shadow-md active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-80 disabled:pointer-events-none'
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <SpinnerLoader /> <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>

            <p className='text-xs sm:text-[13px] text-stone-500 text-center mt-3 font-light'>
              Already have an account?{' '}
              <button
                type="button"
                className='font-semibold text-stone-950 hover:text-[#FF9324] underline underline-offset-4 cursor-pointer transition-colors ml-1'
                onClick={() => setcurrentPage("login")}
              >
                Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup