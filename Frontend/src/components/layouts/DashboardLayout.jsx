import React from 'react'
import { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import Navbar from './Navbar'

const DashboardLayout = ({ children }) => {
  const { user } = useContext(UserContext)
  return (
    <div className='w-full min-h-screen bg-[#FAF9F6] text-stone-900 font-sans antialiased selection:bg-orange-100 selection:text-orange-950 relative'>
      {/* Ambient blobs — fixed so they don't scroll with content */}
      <div className="fixed top-[5%] -left-48 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl animate-blob1 pointer-events-none -z-10" />
      <div className="fixed top-[40%] -right-48 w-96 h-96 bg-indigo-100/20 rounded-full blur-3xl animate-blob2 pointer-events-none -z-10" />
      <div className="fixed top-[70%] left-1/4 w-[500px] h-[500px] bg-orange-100/15 rounded-full blur-3xl animate-blob3 pointer-events-none -z-10" />

      <Navbar />
      {user && (
        <div className='relative'>
          {children}
        </div>
      )}
    </div>
  )
}

export default DashboardLayout