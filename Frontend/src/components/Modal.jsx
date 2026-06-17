import React from 'react'

const Modal = ({ children, isOpen, onClose, title, hideHeader }) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 z-[100] overflow-y-auto bg-black/40 backdrop-blur-sm'>
            <div className='flex min-h-full items-center justify-center p-4'>
                {hideHeader ? (
                    /* Pass-through: children render their own card (Login, Signup, CreateSessionForm) */
                    children
                ) : (
                    /* Standard modal with styled header + close button */
                    <div className='relative flex flex-col bg-white shadow-xl rounded-2xl overflow-hidden w-full max-w-lg'>
                        {/* Header */}
                        <div className='flex items-center justify-between px-6 py-4 border-b border-stone-100'>
                            <h3 className='text-base font-bold text-stone-950 tracking-tight'>{title}</h3>
                            <button
                                type='button'
                                className='p-1.5 rounded-full text-stone-400 hover:text-stone-950 hover:bg-stone-100 active:scale-95 transition-all cursor-pointer'
                                onClick={onClose}
                                aria-label="Close"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>
                        {/* Body */}
                        <div className='flex-1 overflow-y-auto custom-scrollbar'>
                            {children}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Modal