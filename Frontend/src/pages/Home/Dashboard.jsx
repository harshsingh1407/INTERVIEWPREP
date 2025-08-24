import React from 'react'
import {LuPlus} from 'react-icons/lu'
import {CARD_BG} from '../../utils/data'
import toast from 'react-hot-toast'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import moment from 'moment'
import SummaryCard from '../../components/Cards/SummaryCard'
import CreateSessionForm from './CreateSessionForm'
import Modal from '../../components/Modal'
import DeleteAlertContent from '../../components/DeleteAlertContent'

const Dashboard = () => {
  const navigate = useNavigate()
  const [openCreateModal, setopenCreateModal] = useState(false)
  const [session, setsession] = useState([])
  const [openDeleteAlert, setopenDeleteAlert] = useState({
    open:false,
    data:null,
  })
  const fetchAllSessions = async ()=>{
    try {
      const response = await axiosInstance.get(API_PATHS.SESSIONS.GET_ALL)
      // console.log("Fetched sessions:", response.data)
      setsession(response.data)
    } catch (error) {
      console.error("Error fetching session data:",error);
      
    }
  }
  const deleteSession = async (sessionData)=>{
    try {
      await axiosInstance.delete(API_PATHS.SESSIONS.DELETE(sessionData?._id))
      toast.success("Session Deleted successfully")
      setopenDeleteAlert({
        open:false,
        data:null
      })
      fetchAllSessions()
    } catch (error) {
      console.error("Error deleting session data:",error);
      
    }
  }

  useEffect(()=>{
    fetchAllSessions()
  },[])
  return (
    <DashboardLayout>
      <div className='container mx-auto pt-4 pb-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-7 pt-1 pb-6 px-4 md:px-0'>
          {session?.map((data,index)=>(
            <SummaryCard key={data?._id} colors={CARD_BG[index % CARD_BG.length]} role={data?.role || ""} topicsToFocus={data?.topicsToFocus || ""} experience={data?.experience || "-"} questions={data?.questions?.length || "-"} description={data?.description || ""} lastUpdated={data?.updatedAt? moment(data.updatedAt).format("Do MM YYYY"): ""} onSelect={()=> navigate(`/interview-prep/${data?._id}`)} onDelete={()=>setopenDeleteAlert({open:true,data})}/>
          ))}
           {session.length === 0 && (
    <p className="text-gray-500 text-center col-span-3">No sessions found</p>
  )}
        </div>
        <button onClick={()=> setopenCreateModal(true)} className='h-12 md:h-12 flex items-center justify-center gap-3 bg-linear-to-r from-[#FF9324] to-[#e99a4b] text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-black hover:text-white transition-colors cursor-pointer hover:shadow-2xl hover:shadow-orange-300 fixed bottom-10 md:bottom-20 right-10 md:right-20'><LuPlus className='text-2xl text-white'/>Add New</button>
      </div>
      <Modal isOpen={openCreateModal} onClose={()=>{
        setopenCreateModal(false)
      }}hideHeader>
        <div>
          <CreateSessionForm/>
        </div>
      </Modal>

      <Modal isOpen={openDeleteAlert?.open} onClose={()=>{setopenDeleteAlert({open:false, data:null})}} title="Delete Alert">
        <div className='w-[30vw]'>
          <DeleteAlertContent content="Are you sure you want to delete this session details?" onDelete={()=>deleteSession(openDeleteAlert.data)}/>
        </div>
      </Modal>
    </DashboardLayout>
  )
}

export default Dashboard