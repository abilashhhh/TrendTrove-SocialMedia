import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminRoutes from "./AdminRoutes";
import UserRoutes from "./UserRoutes";
import { StoreType } from "./Redux/Store/reduxStore";

function App() {
  const user = useSelector((state: StoreType) => state.userAuth.user);
  const [isVerifiedAccount, setIsVerifiedAccount] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      setIsVerifiedAccount(user?.isVerifiedAccount);
    }
  }, [user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<UserRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
