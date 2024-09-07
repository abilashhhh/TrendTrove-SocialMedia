// import {configureStore} from '@reduxjs/toolkit'

// import authReducer from '../UserAuthSlice/authSlice'
// import adminReducer from '../AdminSlice/adminSlice'
// import chatReducer from '../ChatAuthSlice/chatSlice'

// const store = configureStore({
//     reducer : {
//         userAuth : authReducer,
//         admin: adminReducer,
//         chat: chatReducer,
//     }
// })

// export default store
// export type StoreType  = ReturnType<typeof store.getState>

// store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../UserAuthSlice/authSlice';
import adminReducer from '../AdminSlice/adminSlice';
import chatReducer from '../ChatAuthSlice/chatSlice';

const store = configureStore({
  reducer: {
    userAuth: authReducer,
    admin: adminReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
