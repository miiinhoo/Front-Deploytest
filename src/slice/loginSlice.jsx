import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { LoginAPI } from '../api/user/userAPI';
import { getCookie, setCookie, removeCookie } from '../util/cookieUtil';

export const loginPostAsync = createAsyncThunk(
'loginPostAsync',
async (param, { rejectWithValue }) => {
try {
    const response = await LoginAPI(param);
    return response;
} catch (error) {
    console.error("로그인 요청 실패:", error);
    return rejectWithValue({ success: false, message: '로그인 실패. 서버를 확인하세요.' });
}
}
);


const memberCookie = getCookie("member") || null;

const loginSlice = createSlice({
name: 'login',
initialState: {
isLogin: memberCookie?.isLogin || false,
user: memberCookie?.user || null,
message: '',
loading: false,
},
reducers: {
logout: (state) => {
    state.isLogin = false;
    state.user = null;
    removeCookie("member");
},
},
extraReducers: (builder) => {
builder
    .addCase(loginPostAsync.pending, (state) => {
    state.loading = true;
    state.message = '';
    })
    .addCase(loginPostAsync.fulfilled, (state, action) => {
    const data = action.payload;

    if (data.success) {
        state.isLogin = true;
        state.user = data.name || null;
        state.message = data.message;

        
        setCookie("member", {
        user: data.name,
        isLogin: true
        }, 1);

    } else {
        state.isLogin = false;
        state.user = null;
        state.message = data.message;
        removeCookie("member");
    }
    })
    .addCase(loginPostAsync.rejected, (state, action) => {
    state.loading = false;
    state.isLogin = false;
    state.user = null;
    state.message = action.payload?.message || "서버 오류";
    });
},
});

export const { logout } = loginSlice.actions;
export default loginSlice.reducer;
