import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { userAPI } from './userAPI'

const fetchUserById = createAsyncThunk(
    'users/fetchByIdStatus',
    async (userId, thunkAPI) => {
        const response = await userAPI.fetchById(userId)
        return response.data
    },
)

const initialState = {
    entities: [],
    loading: 'idle',
}

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        // standard reducer logic, with auto-generated action types per reducer
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchUserById.fulfilled, (state, action) => {
            // Add user to the state array
            state.entities.push(action.payload)
        })
    },
})