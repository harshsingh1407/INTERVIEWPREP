import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { AnimatePresence, motion } from 'framer-motion'
import { LuCircleAlert, LuListCollapse, LuSparkles } from 'react-icons/lu'
import SpinnerLoader from '../../components/Loaders/SpinnerLoader'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import RoleInfoHeader from './InterviewComponents/RoleInfoHeader'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import QuestionCard from '../../components/Cards/QuestionCard'
import AIResponsePreview from './InterviewComponents/AIResponsePreview'
import Drawer from '../../components/Loaders/Drawer'
import SkeletonLoader from '../../components/Loaders/SkeletonLoader'

const InterviewPrep = () => {
  const { sessionId } = useParams()
  const [sessionData, setsessionData] = useState(null)
  const [errorMsg, seterrorMsg] = useState("")
  const [openLeanMoreDrawer, setopenLeanMoreDrawer] = useState(false)
  const [Explanation, setExplanation] = useState(null)
  const [isLoading, setisLoading] = useState(false)
  const [isUpdateLoader, setisUpdateLoader] = useState(false)

  // Fetch session data by session id
  const fetchSessionDetailsById = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.SESSIONS.GET_ONE(sessionId))
      if (response.data && response.data.session) {
        setsessionData(response.data.session)
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  // Generate Concept Explanation
  const generateConceptExplanation = async (question, questionId) => {
    try {
      seterrorMsg("")
      setExplanation(null)
      setisLoading(true)
      setopenLeanMoreDrawer(true)
      const response = await axiosInstance.post(API_PATHS.AI.GENERATE_EXPLANATION, { question, questionId })
      if (response.data) {
        setExplanation(response.data)
      }
    } catch (error) {
      setExplanation(null)
      seterrorMsg("Failed to generate explanation. Please try again later.")
      console.error("Error:", error)
    } finally {
      setisLoading(false)
    }
  }

  // Pin Question
  const toggleQuestionPinStatus = async (questionId) => {
    try {
      const response = await axiosInstance.post(API_PATHS.QUESTION.PIN(questionId))
      if (response.data && response.data.question) {
        fetchSessionDetailsById()
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  // Add more questions to a session
  const uploadMoreQuestion = async () => {
    try {
      setisUpdateLoader(true)
      const aiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
        role: sessionData?.role,
        experience: sessionData?.experience,
        topicsToFocus: sessionData?.topicsToFocus,
        numberOfQuestions: 10,
      })
      const generatedQuestions = aiResponse.data
      const response = await axiosInstance.post(API_PATHS.QUESTION.ADD_TO_SESSION, {
        sessionId,
        questions: generatedQuestions
      })
      if (response.data) {
        toast.success("Added More Q&A")
        fetchSessionDetailsById()
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        seterrorMsg(error.response.data.message)
      } else {
        seterrorMsg("Something went wrong. Please try again.")
      }
    } finally {
      setisUpdateLoader(false)
    }
  }

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetailsById()
    }
    return () => { }
  }, [])

  return (
    <DashboardLayout>
      {/* Role info header */}
      <RoleInfoHeader
        role={sessionData?.role || ""}
        topicsToFocus={sessionData?.topicsToFocus || ""}
        experience={sessionData?.experience ?? 0}
        questions={sessionData?.questions?.length || "-"}
        description={sessionData?.description || ""}
        lastUpdated={sessionData?.updatedAt ? moment(sessionData.updatedAt).format("D MMM YYYY") : ""}
      />

      {/* Main content */}
      <main className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-8 pb-24'>

        {/* Section header */}
        <div className='flex items-center gap-3 mb-6'>
          <LuSparkles className='w-4 h-4 text-[#FF9324]' />
          <span className='text-xs font-bold tracking-[0.15em] uppercase text-stone-400'>
            Interview Q&amp;A
          </span>
          <div className='flex-grow h-px bg-stone-200/70' />
          {sessionData?.questions?.length > 0 && (
            <span className='text-xs text-stone-400 font-medium'>
              {sessionData.questions.length} questions
            </span>
          )}
        </div>

        {/* Error banner */}
        {errorMsg && (
          <div className='flex items-center gap-2.5 bg-red-50/60 border border-red-100 rounded-xl px-4 py-3 text-xs font-medium text-red-600 mb-5'>
            <LuCircleAlert className='w-4 h-4 flex-shrink-0' />
            {errorMsg}
          </div>
        )}

        {/* Questions list */}
        <div className={`transition-all duration-300 ${openLeanMoreDrawer ? 'md:pr-[43vw] lg:pr-[37vw]' : ''}`}>
          <AnimatePresence>
            {sessionData?.questions?.map((data, index) => (
              <motion.div
                key={data._id || index}
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{
                  duration: 0.35,
                  type: 'spring',
                  stiffness: 120,
                  damping: 18,
                  delay: index * 0.06,
                }}
                layout
                layoutId={`question-${data._id || index}`}
              >
                <QuestionCard
                  question={data?.question}
                  answer={data?.answer}
                  onLearnMore={() => generateConceptExplanation(data.question, data._id)}
                  isPinned={data?.isPinned}
                  onTogglePin={() => toggleQuestionPinStatus(data._id)}
                />

                {/* Load More — appears after the last card */}
                {!isLoading && sessionData?.questions?.length === index + 1 && (
                  <div className='flex items-center justify-center mt-8 mb-2'>
                    <button
                      className='flex items-center gap-2.5 bg-stone-950 text-stone-50 text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#FF9324] hover:shadow-lg hover:shadow-orange-200/50 transition-all duration-300 cursor-pointer shadow-md active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none'
                      disabled={isLoading || isUpdateLoader}
                      onClick={uploadMoreQuestion}
                    >
                      {isUpdateLoader ? (
                        <>
                          <SpinnerLoader />
                          <span>Generating More...</span>
                        </>
                      ) : (
                        <>
                          <LuListCollapse className='w-4 h-4' />
                          Load More Questions
                        </>
                      )}
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty state */}
          {!sessionData && (
            <div className='flex flex-col items-center justify-center py-24 text-center'>
              <div className='w-12 h-12 rounded-2xl bg-stone-100 border border-stone-200/60 flex items-center justify-center mb-4'>
                <LuSparkles className='w-5 h-5 text-stone-400' />
              </div>
              <p className='text-sm text-stone-400 font-light'>Loading session data...</p>
            </div>
          )}
        </div>
      </main>

      {/* Learn More Drawer */}
      <Drawer
        isOpen={openLeanMoreDrawer}
        onClose={() => setopenLeanMoreDrawer(false)}
        title={!isLoading && Explanation?.title}
      >
        {errorMsg && !isLoading && (
          <div className='flex items-center gap-2.5 bg-amber-50/60 border border-amber-100 rounded-xl px-4 py-3 text-xs font-medium text-amber-700 mb-5'>
            <LuCircleAlert className='w-4 h-4 flex-shrink-0' />
            {errorMsg}
          </div>
        )}
        {isLoading && <SkeletonLoader />}
        {!isLoading && Explanation && (
          <AIResponsePreview content={Explanation?.explanation} />
        )}
      </Drawer>
    </DashboardLayout>
  )
}

export default InterviewPrep