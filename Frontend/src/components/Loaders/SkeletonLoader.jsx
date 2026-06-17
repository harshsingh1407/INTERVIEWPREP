import React from 'react'

const SkeletonLoader = () => {
  return (
    <div className='space-y-6 animate-pulse' role='status' aria-label='Loading...'>
      {/* Title line */}
      <div className='h-5 bg-stone-200/80 rounded-xl w-3/5' />

      {/* Paragraph lines */}
      <div className='space-y-2.5'>
        <div className='h-3 bg-stone-200/70 rounded-lg w-full' />
        <div className='h-3 bg-stone-200/70 rounded-lg w-11/12' />
        <div className='h-3 bg-stone-200/70 rounded-lg w-10/12' />
        <div className='h-3 bg-stone-200/70 rounded-lg w-9/12' />
      </div>

      {/* Code block placeholder */}
      <div className='bg-stone-100/80 border border-stone-200/50 rounded-xl p-4 space-y-2'>
        <div className='flex items-center gap-2 mb-3'>
          <div className='h-3 w-3 bg-stone-300 rounded-full' />
          <div className='h-2.5 bg-stone-300 rounded w-16' />
        </div>
        <div className='h-2.5 bg-stone-200 rounded w-full' />
        <div className='h-2.5 bg-stone-200 rounded w-5/6' />
        <div className='h-2.5 bg-stone-200 rounded w-4/6' />
      </div>

      {/* Second paragraph */}
      <div className='space-y-2.5'>
        <div className='h-4 bg-stone-200/80 rounded-xl w-2/5' />
        <div className='h-3 bg-stone-200/60 rounded-lg w-full' />
        <div className='h-3 bg-stone-200/60 rounded-lg w-11/12' />
        <div className='h-3 bg-stone-200/60 rounded-lg w-10/12' />
      </div>

      {/* Third block */}
      <div className='space-y-2.5'>
        <div className='h-4 bg-stone-200/80 rounded-xl w-1/3' />
        <div className='h-3 bg-stone-200/60 rounded-lg w-full' />
        <div className='h-3 bg-stone-200/60 rounded-lg w-9/12' />
        <div className='h-3 bg-stone-200/60 rounded-lg w-7/12' />
      </div>

      <span className='sr-only'>Loading explanation...</span>
    </div>
  )
}

export default SkeletonLoader