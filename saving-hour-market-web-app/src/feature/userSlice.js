import { createSlice } from "@reduxjs/toolkit";
import { fetchUser } from "../utils/fetchLocalStorage";

const userInfo = fetchUser();

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: userInfo,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
