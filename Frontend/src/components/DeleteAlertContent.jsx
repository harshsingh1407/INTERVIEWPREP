import React from 'react'
import { LuTriangleAlert, LuTrash2 } from 'react-icons/lu'

const DeleteAlertContent = ({ content, onDelete, onCancel }) => {
  return (
    <div className='p-6 font-sans antialiased bg-white rounded-2xl border border-stone-100 shadow-xl'>
      {/* Icon */}
      <div className='flex items-center gap-3 mb-4'>
        <div className='w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0'>
          <LuTriangleAlert className='w-5 h-5 text-rose-500' />
        </div>
        <div>
          <h3 className='text-[15px] font-bold text-stone-950 tracking-tight leading-tight'>
            Confirm Delete
          </h3>
          <p className='text-[11px] text-stone-400 font-medium mt-0.5'>This action cannot be undone</p>
        </div>
      </div>

      {/* Divider */}
      <div className='h-px bg-stone-100 mb-4' />

      {/* Message */}
      <p className='text-sm text-stone-600 font-light leading-relaxed mb-6'>
        {content}
      </p>

      {/* Actions */}
      <div className='flex items-center gap-3 justify-end'>
        {onCancel && (
          <button
            type='button'
            onClick={onCancel}
            className='px-4 py-2 text-sm font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition-all duration-200 cursor-pointer active:scale-95'
          >
            Cancel
          </button>
        )}
        <button
          type='button'
          onClick={onDelete}
          className='flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl shadow-sm hover:shadow-md hover:shadow-rose-200/60 transition-all duration-200 cursor-pointer active:scale-95'
        >
          <LuTrash2 className='w-3.5 h-3.5' />
          Delete
        </button>
      </div>
    </div>
  )
}

export default DeleteAlertContent