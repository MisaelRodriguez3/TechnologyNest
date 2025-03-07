import api from  "./axios"
import { UserProfile, UserUpdate } from "../types/user.types"

export const userProfileRequest = async (): Promise<UserProfile> => await api.get("users/me")
export const updateUserProfile = async(data: UserUpdate) => await api.patch(`users/${data.id}`, data)