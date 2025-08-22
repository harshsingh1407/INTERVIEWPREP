import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import {AnimatePresence, motion} from 'framer-motion'
import {LuCircleAlert, LuListCollapse} from 'react-icons/lu'
import SpinnerLoader from '../../components/Loaders/SpinnerLoader'
import {toast} from 'react-hot-toast'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import RoleInfoHeader from './InterviewComponents/RoleInfoHeader'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import QuestionCard from '../../components/Cards/QuestionCard'
import AIResponsePreview from './InterviewComponents/AIResponsePreview'
import Drawer from '../../components/Loaders/Drawer'
import SkeletonLoader from '../../components/Loaders/SkeletonLoader'
import axios from 'axios'

const InterviewPrep = () => {
  const {sessionId} = useParams()
  const [sessionData, setsessionData] = useState(null)
  const [errorMsg, seterrorMsg] = useState("")
  const [openLeanMoreDrawer, setopenLeanMoreDrawer] = useState(false)
  const [Explanation, setExplanation] = useState(null)
  const [isLoading, setisLoading] = useState(false)
  const [isUpdateLoader, setisUpdateLoader] = useState(false)

  // Fetch session data by session id
  const fetchSessionDetailsById = async ()=>{
    try {
      const response = await axiosInstance.get(API_PATHS.SESSIONS.GET_ONE(sessionId))
      if(response.data && response.data.session) {
        setsessionData(response.data.session)
      }
    } catch (error) {
      console.error("Error:",error);
      
    }
  }

  // Generate Concept Explanation
  const generateConceptExplanation = async (question)=>{
    try {
      seterrorMsg("")
      setExplanation(null)
      setisLoading(true)
      setopenLeanMoreDrawer(true)
      const response = await axiosInstance.post(API_PATHS.AI.GENERATE_EXPLANATION,{question})
      if(response.data) {
        setExplanation(response.data)
      }
    } catch (error) {
      setExplanation(null)
      seterrorMsg("Failed to generate explanation, Try again later")
      console.error("Error:",error);
    } finally {
      setisLoading(false)
    }
  }

  // Pin Question
  const toggleQuestionPinStatus = async (questionId)=>{
    try {
      const response = await axiosInstance.post(API_PATHS.QUESTION.PIN(questionId))
      console.log(response)
      if(response.data && response.data.question) {
        fetchSessionDetailsById()
      }
    } catch (error) {
      console.error("Error:",error);
      
    }
  }

  // Add more questions to a session
  const uploadMoreQuestion = async ()=>{
    try {
      setisUpdateLoader(true)
      // Call AI API to generate question
      const aiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS,{
        role:sessionData?.role,
        experience:sessionData?.experience,
        topicsToFocus:sessionData?.topicsToFocus,
        numberOfQuestions:10,
      })
      // Should be array like [{question,answer}...]
      const generatedQuestions = aiResponse.data
      const response = await axiosInstance.post(API_PATHS.QUESTION.ADD_TO_SESSION,{
        sessionId,
        questions:generatedQuestions
      })
      if(response.data) {
        toast.success("Added More Q&A")
        fetchSessionDetailsById()
      }
    } catch (error) {
      if(error.response && error.response.data.message) {
        seterrorMsg(error.response.data.message)
      } else {
        seterrorMsg("Something went wrong. Please try again.")
      }
    } finally {
      setisUpdateLoader(false)
    }
  }

  useEffect(()=>{
    if(sessionId) {
      fetchSessionDetailsById()
    }
    return ()=>{}
  },[])
  return (
   <DashboardLayout>
    <RoleInfoHeader role={sessionData?.role || ""} topicsToFocus={sessionData?.topicsToFocus || ""} experience={sessionData?.experience || "-"} questions={sessionData?.questions?.length || "-"} description={sessionData?.description || ""} lastUpdated={sessionData?.updatedAt?moment(sessionData.updatedAt).format("Do MM YYYY"):""}/>
    <div className='container mx-auto pt-4 pb-4 px-4 md:px-0'>
      <h2 className='text-lg font-semibold color-black'>Interview Q&A</h2>
      <div className='grid grid-cols-12 gap-4 mt-5 mb-10'>
        <div className={`col-span-12 ${openLeanMoreDrawer?"md:col-span-7":"md-col-span-8"}`}>
          <AnimatePresence>{sessionData?.questions?.map((data,index)=>{
            return (
              <motion.div key={data._id || index} initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:0.95}} transition={{duration:0.4, type:"spring", stiffness:100, delay:index*0.1, damping:15}} layout layoutId={`question-${data._id || index}`}>
                <>
                <QuestionCard question={data?.question} answer={data?.answer} onLearnMore={()=> generateConceptExplanation(data.question)} isPinned={data?.isPinned} onTogglePin={()=>toggleQuestionPinStatus(data._id)}/>
                </>
                {!isLoading && sessionData?.questions?.length == index + 1 &&  (
                  <div className='flex items-center justify-center mt-5'>
                    <button className='flex items-center gap-3 text-sm text-white font-medium bg-black px-5 py-2 mr-2 rounded text-nowrap cursor-pointer' disabled={isLoading || isUpdateLoader} onClick={uploadMoreQuestion}>
                      {isUpdateLoader ? (<SpinnerLoader/>) : (<LuListCollapse className='text-lg'/>)}{" "}Load More
                    </button>
                  </div>
                )}
                </motion.div>
            )
          })}
          </AnimatePresence>
        </div>
      </div>
      <div>
        <Drawer isOpen={openLeanMoreDrawer} onClose={()=>setopenLeanMoreDrawer(false)} title={!isLoading && Explanation?.title}>
          {errorMsg && (
            <p className='flex gap-2 text-sm text-amber-600 font-medium'>
              <LuCircleAlert className='mt-1'/> {errorMsg}
            </p>
          )}
          {isLoading && <SkeletonLoader/>}
          {!isLoading && Explanation && (
            <AIResponsePreview content={Explanation?.explanation}/>
          )}
        </Drawer>
      </div>
    </div>
   </DashboardLayout>
  )
}

export default InterviewPrep