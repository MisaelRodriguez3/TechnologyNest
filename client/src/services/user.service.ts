import api from  "./axios"
import { GetUser, UserUpdate } from "../types/user.types"

export const userProfileRequest = async (): Promise<GetUser> => await api.get("users/me")
export const updateUserProfile = async(data: UserUpdate) => await api.patch(`users/`, data)