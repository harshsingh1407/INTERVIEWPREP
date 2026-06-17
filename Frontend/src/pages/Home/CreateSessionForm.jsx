import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/Inputs/Input'
import SpinnerLoader from '../../components/Loaders/SpinnerLoader'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { LuSparkles, LuArrowRight, LuX } from 'react-icons/lu'

const CreateSessionForm = ({ onClose, onSuccess }) => {
  const [formData, setformData] = useState({
    role: "",
    experience: "",
    topicsToFocus: "",
    description: ""
  })

  const [isLoading, setisLoading] = useState(false)
  const [Error, setError] = useState(null)

  const navigate = useNavigate()

  const handleChange = (key, value) => {
    setformData((prevData) => ({
      ...prevData,
      [key]: value,
    }))
  }

  const handleCreateSession = async (e) => {
    e.preventDefault()

    const { role, experience, topicsToFocus } = formData
    const trimmedRole = role.trim()
    const trimmedTopics = topicsToFocus.trim()
    const expNum = Number(experience)

    if (!trimmedRole || experience === "" || !trimmedTopics) {
      setError("Please fill all the required fields.")
      return
    }

    if (trimmedRole.length < 2) {
      setError("Target Position must be a valid job title (at least 2 characters).")
      return
    }

    if (isNaN(expNum) || expNum < 0 || expNum > 20) {
      setError("Experience must be a number between 0 and 20 years.")
      return
    }

    if (trimmedTopics.length < 2) {
      setError("Core Focus Skills & Frameworks must contain valid skills (at least 2 characters).")
      return
    }

    setError("")
    setisLoading(true)

    try {
      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTIONS,
        {
          role,
          experience,
          topicsToFocus,
          numberOfQuestions: 10,
        }
      )

      const generatedQuestions = aiResponse.data

      const response = await axiosInstance.post(
        API_PATHS.SESSIONS.CREATE,
        {
          role: formData.role,
          experience: Number(formData.experience),
          topicsToFocus: formData.topicsToFocus,
          description: formData.description,
          questions: generatedQuestions,
        }
      )

      if (response.data?.session?._id) {
        if (onSuccess) {
          onSuccess()
        }

        navigate(`/interview-prep/${response.data.session._id}`)
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError("Something went wrong. Please try again.")
      }
    } finally {
      setisLoading(false)
    }
  }

  return (
    <div
      className="
        w-full
        max-w-[500px]
        bg-white
        rounded-2xl
        flex flex-col
        shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]
        border border-stone-100
        max-h-[80vh]
        overflow-y-auto
        pt-8
        pb-6
        px-6
        sm:px-8
        relative
        custom-scrollbar
      "
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-950 hover:bg-stone-100 active:scale-95 transition-all cursor-pointer z-10"
        aria-label="Close"
      >
        <LuX className="w-5 h-5" />
      </button>

      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 text-[9px] font-bold tracking-[0.12em] uppercase text-orange-700 bg-orange-100/50 px-2.5 py-1 rounded-full border border-orange-200/40 w-fit mb-3">
        <LuSparkles className="text-[#FF9324] w-3 h-3" />
        Technical Loop Configurator
      </div>

      <h3 className="text-xl sm:text-2xl font-black text-stone-950 tracking-tight leading-none">
        Initialize Session
      </h3>

      <p className="text-xs text-stone-500 mt-1 mb-4 font-light leading-relaxed">
        Configure your background experience metrics to synthesize a tailored
        mock panel profile.
      </p>

      <form onSubmit={handleCreateSession} className="flex flex-col flex-grow">
        <div className="flex flex-col gap-y-3.5 mb-4">
          <Input
            value={formData.role}
            onChange={({ target }) =>
              handleChange("role", target.value)
            }
            label="Target Position"
            placeholder="e.g., Frontend Developer"
            type="text"
          />

          <Input
            value={formData.experience}
            onChange={({ target }) =>
              handleChange("experience", target.value)
            }
            label="Years of Experience Required"
            placeholder="e.g., 2, 3, 5"
            type="number"
          />

          <div className="flex flex-col gap-1">
            <Input
              value={formData.topicsToFocus}
              onChange={({ target }) =>
                handleChange("topicsToFocus", target.value)
              }
              label="Core Focus Skills & Frameworks"
              placeholder="React, Node.js, System Design"
              type="text"
            />

            <span className="text-[10px] text-stone-400 font-mono mt-0.5 pl-1">
              // Separate parameters with a comma
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-700 tracking-wide">
              Context Details & Custom Goals (Optional)
            </label>

            <textarea
              value={formData.description}
              onChange={({ target }) =>
                handleChange("description", target.value)
              }
              rows={4}
              className="w-full px-4 py-3 text-stone-900 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#FF9324] focus:bg-white transition-all resize-none placeholder:text-stone-400 font-light"
              placeholder="Add targeted context, specific loop metrics, or company-specific goals..."
            />
          </div>
        </div>

        {Error && (
          <div className="text-red-600 bg-red-50/50 border border-red-100 rounded-xl px-3 py-2 text-xs font-medium mb-3">
            {Error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-stone-950 text-stone-50 text-sm font-semibold tracking-wide py-3.5 rounded-xl hover:bg-[#FF9324] hover:shadow-lg hover:shadow-orange-200/50 transition-all duration-300 cursor-pointer shadow-md active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-80"
        >
          {isLoading ? (
            <>
              <SpinnerLoader />
              <span>Generating Panel Loop...</span>
            </>
          ) : (
            <>
              Assemble Interview Loop
              <LuArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default CreateSessionForm