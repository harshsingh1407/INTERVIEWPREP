import React , { createContext, useState, useEffect} from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import axios from "axios";

export const UserContext = createContext()

const UserProvider = ({children}) =>{

    const [user, setuser] = useState(null)
    const [loading, setloading] = useState(true)

    useEffect(()=> {
        if(user) return

        const accessToken = localStorage.getItem("token")
        if(!accessToken) {
            setloading(false)
            return
        }
        const fetchUser = async ()=>{
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE)
                setuser(response.data)
            } catch (error) {
                console.error("User not authenticated", error)
                clearUser()
            } finally {
                setloading(false)
            }
        }
        fetchUser()
    },[])

    const updateUser = (userData)=>{
        setuser(userData)
        localStorage.setItem("token",userData.token)
        setloading(false)
    }

    const clearUser = ()=>{
        setuser(null)
        localStorage.removeItem("token")
    }

    return (
        <UserContext.Provider value={{user,loading,updateUser,clearUser}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider