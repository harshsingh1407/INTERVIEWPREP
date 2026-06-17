import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input.jsx'
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import { UserContext } from '../../context/userContext.jsx';
import SpinnerLoader from '../../components/Loaders/SpinnerLoader.jsx';
import { LuSparkles, LuX } from 'react-icons/lu';

const Login = ({ setcurrentPage, onClose }) => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState(null);
  const [isLoading, setisLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      seterror("Please enter a valid email address");
      return;
    }
    if (!password) {
      seterror("Please enter the password");
      return;
    }

    seterror("");
    setisLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const { token } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        seterror(error.response.data.message);
      } else {
        seterror("Something went wrong. Please try again!");
      }
    } finally {
      setisLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-sm font-sans antialiased">

      {/* White Floating Card Box */}
      <div className='w-full max-w-[420px] bg-white rounded-2xl flex flex-col justify-start shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] border border-stone-100 max-h-[85vh] overflow-y-auto pt-8 pb-6 px-6 sm:px-8 custom-scrollbar relative'>

        {/* Close (X) Button */}
        <button
          type="button"
          onClick={() => onClose ? onClose() : navigate("/")}
          className='absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-950 hover:bg-stone-100 active:scale-95 transition-all cursor-pointer'
          aria-label="Close"
        >
          <LuX className="w-5 h-5" />
        </button>

        {/* Premium Micro Badge */}
        <div className='inline-flex items-center gap-1.5 text-[9px] font-bold tracking-[0.12em] uppercase text-orange-700 bg-orange-100/50 px-2.5 py-1 rounded-full border border-orange-200/40 w-fit mb-3 flex-shrink-0'>
          <LuSparkles className="text-[#FF9324] w-3 h-3" /> Secure Access
        </div>

        <h3 className='text-xl sm:text-2xl font-black text-stone-950 tracking-tight leading-none flex-shrink-0'>Welcome Back</h3>
        <p className='text-xs text-stone-500 mt-1 mb-6 font-light leading-relaxed flex-shrink-0'>
          Please enter your details to access your technical prep pipeline.
        </p>

        <form onSubmit={handleLogin} className="flex flex-col flex-grow">
          {/* Input Stack */}
          <div className='flex flex-col gap-y-3.5 mb-4'>
            <Input
              type="text"
              value={email}
              onChange={({ target }) => setemail(target.value)}
              label='Email Address'
              placeholder='harsh@gmail.com'
            />

            <Input
              type="password"
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

          {/* CTA Button */}
          <div className="mt-auto pt-2 flex flex-col gap-y-2.5 flex-shrink-0">
            <button
              type='submit'
              className='w-full bg-stone-950 text-stone-50 text-sm font-semibold tracking-wide py-3.5 rounded-xl hover:bg-[#FF9324] hover:shadow-lg hover:shadow-orange-200/50 transition-all duration-300 cursor-pointer shadow-md active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-80 disabled:pointer-events-none'
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <SpinnerLoader /> <span>Authenticating...</span>
                </div>
              ) : (
                "Login"
              )}
            </button>

            <p className='text-xs sm:text-[13px] text-stone-500 text-center mt-3 font-light'>
              Don't have an account?{' '}
              <button
                type="button"
                className='font-semibold text-stone-950 hover:text-[#FF9324] underline underline-offset-4 cursor-pointer transition-colors ml-1'
                onClick={() => setcurrentPage("signup")}
              >
                Signup Free
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;