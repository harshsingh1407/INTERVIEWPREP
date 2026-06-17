import React from 'react'
import { LuX, LuSparkles } from 'react-icons/lu'

const Drawer = ({ isOpen, onClose, title, children }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className='fixed inset-0 z-30 bg-stone-950/20 backdrop-blur-[2px] transition-opacity md:hidden'
          onClick={onClose}
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed top-[64px] right-0 z-40 h-[calc(100dvh-64px)] overflow-y-auto transition-transform duration-300 ease-in-out
          bg-[#FAF9F6] w-full md:w-[42vw] lg:w-[36vw]
          border-l border-stone-200/70
          shadow-[-8px_0_40px_rgba(0,0,0,0.06)]
          custom-scrollbar
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        aria-labelledby='drawer-right-label'
        tabIndex='-1'
      >
        {/* Header */}
        <div className='sticky top-0 z-10 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-stone-200/60 px-5 py-4 flex items-center justify-between gap-3'>
          <div className='flex items-center gap-2 min-w-0'>
            <div className='flex-shrink-0 w-6 h-6 rounded-lg bg-orange-100/60 border border-orange-200/40 flex items-center justify-center'>
              <LuSparkles className='w-3 h-3 text-[#FF9324]' />
            </div>
            <h5
              id='drawer-right-label'
              className='text-sm font-bold text-stone-950 tracking-tight truncate'
            >
              {title || 'AI Explanation'}
            </h5>
          </div>

          <button
            type='button'
            onClick={onClose}
            className='flex-shrink-0 p-1.5 rounded-full text-stone-400 hover:text-stone-950 hover:bg-stone-100 active:scale-95 transition-all cursor-pointer'
            aria-label='Close drawer'
          >
            <LuX className='w-4 h-4' />
          </button>
        </div>

        {/* Body */}
        <div className='px-5 py-6 text-sm'>
          {children}
        </div>
      </div>
    </>
  )
}

export default Drawer