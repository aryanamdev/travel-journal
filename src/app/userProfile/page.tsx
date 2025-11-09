"use client"

import ViewerProfileCard from '@/components/profile/UserProfileCard'
import { User } from '@/types/user'
import axios from 'axios' 
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { ROUTES } from '../constants/routes'
import { useRouter } from 'next/navigation'

const UserProfile = () => {
  const [me, setViewer] = useState<User | null>(null)

  const router = useRouter()

  const getViewer = async () => {
    try {
      const response = await axios.get(ROUTES.USER.VIEWER)
      const data = response?.data

      if(!data?.success){
        throw new Error("Error fetching the user")
      }

      const me = data?.data 

      setViewer(me)

    } catch (error: any) {
      toast.error(error.message || "Error fetching user")
    }
  }

  const handleLogout = async (onLoading?: (loading: boolean) => void) => {
    onLoading?.(true)
    try {
      const response = await axios.get(ROUTES.USER.LOGOUT)
      const data = await response.data 

      if(!data.success){
        throw new Error("An error occured while logging out the user")
      }

      toast.success("Logged out successfully!")
      router.push("/login")
      
    } catch (error: any) {
       toast.error(error.message)
    } finally {
      onLoading?.(false)
    }
  }

  useEffect(() => {
    getViewer()

    return () => {
      setViewer(null)
    }
  }, [])

  const user = {
    email: me?.email || "", fullName: me?.fullName || ""
  }

  return (
    <ViewerProfileCard user={user} onLogout={handleLogout}/>
  )
}

export default UserProfile