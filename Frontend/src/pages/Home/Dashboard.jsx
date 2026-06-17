import React, { useContext } from 'react'
import { LuPlus, LuSparkles, LuLayoutDashboard } from 'react-icons/lu'
import { CARD_BG } from '../../utils/data'
import toast from 'react-hot-toast'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import moment from 'moment'
import SummaryCard from '../../components/Cards/SummaryCard'
import CreateSessionForm from './CreateSessionForm'
import Modal from '../../components/Modal'
import DeleteAlertContent from '../../components/DeleteAlertContent'
import { UserContext } from '../../context/userContext'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const [openCreateModal, setopenCreateModal] = useState(false)
  const [session, setsession] = useState([])
  const [openDeleteAlert, setopenDeleteAlert] = useState({ open: false, data: null })

  const fetchAllSessions = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.SESSIONS.GET_ALL)
      setsession(response.data)
    } catch (error) {
      console.error("Error fetching session data:", error)
    }
  }

  const deleteSession = async (sessionData) => {
    try {
      await axiosInstance.delete(API_PATHS.SESSIONS.DELETE(sessionData?._id))
      toast.success("Session Deleted successfully")
      setopenDeleteAlert({ open: false, data: null })
      fetchAllSessions()
    } catch (error) {
      console.error("Error deleting session data:", error)
    }
  }

  useEffect(() => {
    fetchAllSessions()
  }, [])

  return (
    <DashboardLayout>
      <main className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-10 pb-24'>

        {/* Page Header */}
        <div className='mb-10'>
          {/* Badge */}
          <div className='inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.12em] uppercase text-orange-700 bg-orange-100/60 px-3 py-1.5 rounded-full border border-orange-200/50 mb-4'>
            <LuSparkles className="text-[#FF9324] w-3.5 h-3.5" />
            Interview Prep Hub
          </div>

          <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4'>
            <div>
              <h1 className='text-3xl sm:text-4xl font-black text-stone-950 tracking-tight leading-tight'>
                Welcome back, <span className='bg-gradient-to-r from-[#FF9324] to-amber-500 bg-clip-text text-transparent'>{user?.name?.split(" ")[0] || "there"}</span>
              </h1>
              <p className='text-sm text-stone-500 mt-2 font-light'>
                {session.length > 0
                  ? `You have ${session.length} active prep session${session.length > 1 ? "s" : ""}. Keep pushing!`
                  : "Create your first session to start preparing."}
              </p>
            </div>

            {/* Desktop Add Button */}
            <button
              onClick={() => setopenCreateModal(true)}
              className='hidden sm:flex items-center gap-2 bg-stone-950 text-stone-50 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#FF9324] hover:shadow-lg hover:shadow-orange-200/50 transition-all duration-300 cursor-pointer shadow-md active:scale-[0.98] flex-shrink-0'
            >
              <LuPlus className='w-4 h-4' />
              New Session
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className='flex items-center gap-3 mb-8'>
          <LuLayoutDashboard className='w-4 h-4 text-stone-400' />
          <span className='text-xs font-bold tracking-[0.15em] uppercase text-stone-400'>Your Sessions</span>
          <div className='flex-grow h-px bg-stone-200/70' />
          <span className='text-xs text-stone-400 font-medium'>{session.length} total</span>
        </div>

        {/* Session Cards Grid */}
        {session.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
            {session.map((data, index) => (
              <SummaryCard
                key={data?._id}
                colors={CARD_BG[index % CARD_BG.length]}
                role={data?.role || ""}
                topicsToFocus={data?.topicsToFocus || ""}
                experience={data?.experience ?? "-"}
                questions={data?.questions?.length ?? "-"}
                description={data?.description || ""}
                lastUpdated={data?.updatedAt ? moment(data.updatedAt).format("D MMM YYYY") : ""}
                onSelect={() => navigate(`/interview-prep/${data?._id}`)}
                onDelete={() => setopenDeleteAlert({ open: true, data })}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className='flex flex-col items-center justify-center py-24 text-center'>
            <div className='w-16 h-16 rounded-2xl bg-orange-100/50 border border-orange-200/40 flex items-center justify-center mb-5'>
              <LuSparkles className='w-7 h-7 text-[#FF9324]' />
            </div>
            <h3 className='text-lg font-bold text-stone-950 tracking-tight mb-2'>No sessions yet</h3>
            <p className='text-sm text-stone-500 font-light max-w-xs leading-relaxed mb-6'>
              Create your first interview prep session and start building confidence.
            </p>
            <button
              onClick={() => setopenCreateModal(true)}
              className='flex items-center gap-2 bg-stone-950 text-stone-50 text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#FF9324] hover:shadow-lg hover:shadow-orange-200/50 transition-all duration-300 cursor-pointer shadow-md active:scale-[0.98]'
            >
              <LuPlus className='w-4 h-4' />
              Create First Session
            </button>
          </div>
        )}
      </main>

      {/* Mobile FAB */}
      <button
        onClick={() => setopenCreateModal(true)}
        className='sm:hidden fixed bottom-8 right-6 h-14 w-14 flex items-center justify-center bg-stone-950 text-white rounded-full shadow-2xl hover:bg-[#FF9324] hover:shadow-orange-300/60 transition-all duration-300 cursor-pointer active:scale-95'
        aria-label="Add new session"
      >
        <LuPlus className='w-6 h-6' />
      </button>

      {/* Create Session Modal */}
      <Modal isOpen={openCreateModal} onClose={() => setopenCreateModal(false)} hideHeader>
        <CreateSessionForm
          onClose={() => setopenCreateModal(false)}
          onSuccess={() => { setopenCreateModal(false); fetchAllSessions(); }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={openDeleteAlert?.open}
        onClose={() => setopenDeleteAlert({ open: false, data: null })}
        hideHeader
      >
        <div className='w-[90vw] max-w-sm'>
          <DeleteAlertContent
            content="Are you sure you want to delete this session? All associated questions and progress will be permanently removed."
            onDelete={() => deleteSession(openDeleteAlert.data)}
            onCancel={() => setopenDeleteAlert({ open: false, data: null })}
          />
        </div>
      </Modal>
    </DashboardLayout>
  )
}

export default Dashboard