import React, { useEffect, useRef, useState } from 'react'
import { LuChevronDown, LuPin, LuPinOff, LuSparkles } from 'react-icons/lu'
import AIResponsePreview from '../../pages/InterviewPrep/InterviewComponents/AIResponsePreview'

const QuestionCard = ({ question, answer, onLearnMore, isPinned, onTogglePin }) => {
  const [isExpanded, setisExpanded] = useState(false)
  const [Height, setHeight] = useState(0)
  const contentRef = useRef(null)

  useEffect(() => {
    if (isExpanded) {
      const contentHeight = contentRef.current.scrollHeight
      setHeight(contentHeight + 10)
    } else {
      setHeight(0)
    }
  }, [isExpanded])

  const toggleExpand = () => {
    setisExpanded(!isExpanded)
  }

  return (
    <div className='bg-white rounded-2xl mb-4 overflow-hidden border border-stone-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.07)] hover:border-stone-200 transition-all duration-300 group'>
      {/* Question row */}
      <div className='flex items-start justify-between px-5 pt-4 pb-3'>
        <div className='flex items-start gap-3 flex-1 cursor-pointer' onClick={toggleExpand}>
          {/* Q pill */}
          <span className='mt-0.5 flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-orange-100/70 text-[10px] font-black text-[#FF9324] leading-none border border-orange-200/40'>
            Q
          </span>
          <h3 className='text-sm font-semibold text-stone-800 leading-snug mr-4'>
            {question}
          </h3>
        </div>

        {/* Action buttons */}
        <div className='flex items-center gap-1.5 ml-2 flex-shrink-0'>
          {/* Pin/Unpin */}
          <div className={`${isExpanded ? 'flex' : 'hidden group-hover:flex'} items-center gap-1.5`}>
            <button
              onClick={onTogglePin}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer active:scale-95 ${isPinned
                ? 'bg-orange-50 border-orange-200 text-[#FF9324] hover:bg-orange-100'
                : 'bg-stone-50 border-stone-200 text-stone-400 hover:border-stone-300 hover:text-stone-600'
              }`}
              title={isPinned ? 'Unpin question' : 'Pin question'}
            >
              {isPinned
                ? <LuPinOff className='w-3.5 h-3.5' />
                : <LuPin className='w-3.5 h-3.5' />
              }
            </button>

            {/* Learn More */}
            <button
              onClick={() => {
                setisExpanded(true)
                onLearnMore()
              }}
              className='inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wide bg-stone-950 text-stone-50 px-2.5 py-1.5 rounded-lg hover:bg-[#FF9324] hover:shadow-md hover:shadow-orange-200/50 transition-all duration-200 cursor-pointer active:scale-95'
            >
              <LuSparkles className='w-3 h-3' />
              <span className='hidden sm:inline'>Learn More</span>
            </button>
          </div>

          {/* Chevron */}
          <button
            onClick={toggleExpand}
            className='p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all cursor-pointer'
          >
            <LuChevronDown
              size={16}
              className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Answer collapse */}
      <div
        className='overflow-hidden transition-all duration-300 ease-in-out'
        style={{ maxHeight: `${Height}px` }}
      >
        <div
          ref={contentRef}
          className='mx-5 mb-4 bg-stone-50/70 border border-stone-100 rounded-xl px-5 py-4 text-stone-700'
        >
          <AIResponsePreview content={answer} />
        </div>
      </div>
    </div>
  )
}

export default QuestionCard