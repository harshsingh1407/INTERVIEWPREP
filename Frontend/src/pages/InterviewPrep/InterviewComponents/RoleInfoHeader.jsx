import React from 'react'
import { LuSparkles, LuBriefcase, LuCalendar, LuCircleDot, LuArrowLeft } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'

const RoleInfoHeader = ({ role, topicsToFocus, experience, questions, description, lastUpdated }) => {
  const navigate = useNavigate()

  return (
    <div className='w-full bg-[#FAF9F6] border-b border-stone-200/60 pt-8 pb-6 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>

        

        <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
          {/* Left: Role info */}
          <div className='flex flex-col gap-2'>
            {/* Badge */}
            <div className='inline-flex items-center gap-1.5 text-[9px] font-bold tracking-[0.12em] uppercase text-orange-700 bg-orange-100/50 px-2.5 py-1 rounded-full border border-orange-200/40 w-fit'>
              <LuSparkles className='text-[#FF9324] w-3 h-3' />
              Interview Prep Session
            </div>

            <h1 className='text-2xl sm:text-3xl font-black text-stone-950 tracking-tight leading-tight mt-1'>
              {role || 'Loading...'}
            </h1>

            {topicsToFocus && (
              <p className='text-sm text-stone-500 font-light leading-relaxed max-w-xl'>
                {topicsToFocus}
              </p>
            )}

            {description && (
              <p className='text-xs text-stone-400 font-light leading-relaxed max-w-xl mt-0.5 italic'>
                {description}
              </p>
            )}

            {/* Stat pills */}
            <div className='flex flex-wrap items-center gap-2 mt-3'>
              <div className='inline-flex items-center gap-1.5 text-[10px] font-semibold text-stone-700 bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200/60'>
                <LuBriefcase className='w-3 h-3 text-stone-500' />
                {experience} {experience === 1 ? 'Year' : 'Years'} Exp
              </div>
              <div className='inline-flex items-center gap-1.5 text-[10px] font-semibold text-stone-700 bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200/60'>
                <LuCircleDot className='w-3 h-3 text-[#FF9324]' />
                {questions} Q&amp;A
              </div>
              {lastUpdated && (
                <div className='inline-flex items-center gap-1.5 text-[10px] font-semibold text-stone-500 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-200/40'>
                  <LuCalendar className='w-3 h-3 text-stone-400' />
                  {lastUpdated}
                </div>
              )}
            </div>
          </div>

          {/* Right: decorative blobs */}
          <div className='hidden sm:flex items-center justify-center w-40 h-28 relative flex-shrink-0 overflow-hidden rounded-2xl bg-stone-50 border border-stone-100'>
            <div className='w-10 h-10 bg-orange-300/60 blur-2xl rounded-full animate-blob1 absolute' />
            <div className='w-10 h-10 bg-amber-200/60 blur-2xl rounded-full animate-blob2 absolute' />
            <div className='w-10 h-10 bg-orange-100/80 blur-2xl rounded-full animate-blob3 absolute' />
            <LuSparkles className='relative w-6 h-6 text-[#FF9324]/70' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoleInfoHeader