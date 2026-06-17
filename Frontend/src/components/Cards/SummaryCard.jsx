import React from 'react'
import { LuTrash2, LuClock, LuBrainCircuit, LuArrowRight, LuBookOpen } from 'react-icons/lu'
import { getInitials } from '../../utils/helper'

const SummaryCard = ({ colors, role, topicsToFocus, experience, questions, description, lastUpdated, onSelect, onDelete }) => {
  const hasExperience = experience !== undefined && experience !== null && experience !== "" && experience !== "-";

  return (
    <div
      className='group relative bg-white rounded-2xl border border-stone-200/60 shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.09)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col'
      onClick={onSelect}
    >
      {/* Colored Top Banner */}
      <div
        className='relative px-5 pt-5 pb-4 flex items-center gap-3.5'
        style={{ background: colors.bgcolor }}
      >
        {/* Initials Avatar */}
        <div className='flex-shrink-0 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm ring-1 ring-black/5'>
          <span className='text-sm font-black text-stone-950 tracking-tight'>{getInitials(role)}</span>
        </div>

        <div className='flex-grow min-w-0'>
          <h2 className='text-[15px] font-bold text-stone-950 tracking-tight leading-snug line-clamp-1'>{role}</h2>
          {topicsToFocus && (
            <p className='text-[11px] text-stone-600 mt-0.5 line-clamp-1 font-medium'>{topicsToFocus}</p>
          )}
        </div>

        {/* Delete button — revealed on hover */}
        <button
          className='opacity-0 group-hover:opacity-100 absolute top-3 right-3 p-1.5 rounded-lg text-rose-400 bg-white/80 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 shadow-sm'
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          aria-label="Delete session"
        >
          <LuTrash2 className='w-3.5 h-3.5' />
        </button>
      </div>

      {/* Card Body */}
      <div className='px-5 pb-5 pt-4 flex flex-col flex-grow'>
        {/* Description */}
        <p className='text-xs text-stone-500 leading-relaxed line-clamp-2 font-light flex-grow mb-4 min-h-[32px]'>
          {description || "No description provided."}
        </p>

        {/* Stats Row */}
        <div className='flex items-center flex-wrap gap-2 mb-4'>
          {hasExperience && (
            <span className='inline-flex items-center gap-1 text-[10px] font-semibold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full'>
              <LuBrainCircuit className='w-3 h-3' />
              {experience} {experience == 1 ? "Yr" : "Yrs"} Exp
            </span>
          )}
          <span className='inline-flex items-center gap-1 text-[10px] font-semibold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200/50'>
            <LuBookOpen className='w-3 h-3' />
            {questions} Q&amp;A
          </span>
          {lastUpdated && (
            <span className='inline-flex items-center gap-1 text-[10px] font-medium text-stone-400 bg-stone-50 px-2.5 py-1 rounded-full border border-stone-100'>
              <LuClock className='w-3 h-3' />
              {lastUpdated}
            </span>
          )}
        </div>

        {/* CTA footer */}
        <div className='flex items-center justify-between pt-3 border-t border-stone-100'>
          <span className='text-[11px] font-semibold text-stone-400 group-hover:text-[#FF9324] transition-colors duration-200'>
            View Session
          </span>
          <div className='w-7 h-7 rounded-full bg-stone-100 group-hover:bg-[#FF9324] flex items-center justify-center transition-all duration-300 group-hover:shadow-md group-hover:shadow-orange-200/60'>
            <LuArrowRight className='w-3.5 h-3.5 text-stone-500 group-hover:text-white transition-colors' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryCard