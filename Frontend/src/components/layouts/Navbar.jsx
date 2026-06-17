import React from 'react'
import ProfileInfoCard from '../Cards/ProfileInfoCard'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <header className='w-full sticky top-0 z-50 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-stone-200/50'>
      <div className='max-w-7xl mx-auto h-16 flex justify-between items-center px-4 sm:px-6 lg:px-8'>
        <Link
          to='/dashboard'
          className='text-lg sm:text-xl font-extrabold tracking-tight text-stone-950 flex items-center gap-0.5 cursor-pointer select-none'
        >
          InterviewEdge<span className="text-[#FF9324] font-black">.</span>
        </Link>
        <ProfileInfoCard />
      </div>
    </header>
  )
}

export default Navbar