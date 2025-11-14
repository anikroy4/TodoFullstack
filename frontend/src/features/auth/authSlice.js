import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";

import * as authAPI from "./authAPI";

export const registration=createAsyncThunk('auth/registration',async(data, {rejectWithValue})=>{
    try{
        const res=await authAPI.registration(data);
        return res.data;
    }catch(error){
        return rejectWithValue(error);
    
    }
    }
);

export const login=createAsyncThunk('auth/login',async(data, {rejectWithValue})=>{
    try{
        const res=await authAPI.login(data);
        return res.data;
    }catch(error){
        return rejectWithValue(error);
    
    }
    }
);

export const verify=createAsyncThunk('auth/verify',async(data, {rejectWithValue})=>{
    try{
        const res=await authAPI.verifyEmail(data);
        return res.data;
    }catch(error){
        return rejectWithValue(error);
    
    }
    }
);

export const forgotPassword=createAsyncThunk('auth/password-forgot',async(data, {rejectWithValue})=>{
    try{
        const res=await authAPI.forgotPassword(data);
        return res.data;
    }catch(error){
        return rejectWithValue(error);
    
    }
    }
);

export const resetPassword=createAsyncThunk('auth/rest-password',async({token, data}, {rejectWithValue})=>{
    try{
        const res=await authAPI.resetPassword({token, data});
        return res.data;
    }catch(error){
        return rejectWithValue(error);
    
    }
    }
);


export const authSlice=createSlice({
    name:"auth",
    initialState:{
        user: null,
        accessToken: null,
        loading: false,
        error: null,
        message: null,
    },
    reducers:{
        logout:(state)=>{
            state.user=null;
            state.accessToken=null;
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(login.pending, (state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(login.fulfilled, (state, action)=>{
            state.loading=true;
            state.user={
                email:action.payload.email,
                username:action.payload.username,
            }
            state.accessToken=action.payload.accessToken;
        })

        .addCase(login.rejected, (state, action)=>{
            state.loading=false;
            state.error=action.payload.error;
        })
        

        .addCase(registration.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(registration.fulfilled,(state, action)=>{
            state.loading=false;
            state.message=action.payload.message;
            
        })
        .addCase(registration.rejected,(state, action)=>{
            state.loading=false;
            state.error=action.payload.error;
        })

        .addCase(verify.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(verify.fulfilled,(state, action)=>{
            state.loading=false;
            state.message=action.payload.message
        })
        .addCase(verify.rejected,(state, action)=>{
            state.loading=false;
            state.error=action.payload.error;
        })

        .addCase(forgotPassword.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(forgotPassword.fulfilled,(state, action)=>{
            state.loading=false;
            state.message=action.payload.message;
        })
        .addCase(forgotPassword.rejected,(state, action)=>{
            state.loading=false;
            state.error=action.payload.error;
        })

        .addCase(resetPassword.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(resetPassword.fulfilled,(state, action)=>{
            state.loading=false;
            state.message=action.payload.message;
        })
        .addCase(resetPassword.rejected,(state, action)=>{
            state.loading=false;
            state.error=action.payload.error;
        })
        
        
        
    }
}); 
export const {logout}=authSlice.actions;
export default authSlice.reducer;