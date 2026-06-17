import React, { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import { useNavigate } from 'react-router-dom'
import { LuLogOut } from 'react-icons/lu'

const ProfileInfoCard = () => {
  const { user, clearUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear()
    clearUser()
    navigate("/")
  }

  return (
    user && (
      <div className='flex items-center gap-3'>
        {/* Avatar */}
        <div className='relative'>
          <img
            src={user.profileImageUrl}
            alt={user.name}
            className='w-9 h-9 rounded-full object-cover border-2 border-stone-200 shadow-sm'
          />
          <span className='absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full' />
        </div>

        {/* Name */}
        <div className='hidden sm:block'>
          <div className='text-[13px] font-bold text-stone-950 leading-tight'>{user.name || ""}</div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className='flex items-center gap-1.5 text-[12px] font-semibold text-stone-500 hover:text-[#FF9324] transition-colors cursor-pointer bg-stone-100 hover:bg-orange-50 px-3 py-1.5 rounded-lg border border-stone-200/60 hover:border-orange-200 active:scale-95 transition-all'
        >
          <LuLogOut className='w-3.5 h-3.5' />
          Logout
        </button>
      </div>
    )
  )
}

export default ProfileInfoCard