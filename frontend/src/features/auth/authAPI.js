import api from "../../api";

export const registration=async(data)=>{
    await api.post("/auth/registration",data);
}
export const login=async(data)=>{
    await api.post("/auth/login",data);
}
export const verifyEmail=async(token)=>{
    await api.get(`/auth/verify/${token}`);
}
export const forgotPassword=async(data)=>{
    await api.post("/auth/password-forgot",data);
}
export const resetPassword=async(token , data )=>{
    await api.post(`/auth/reset-password/${token}`,data);
}