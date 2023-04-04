import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSession } from "../features/auth/authSlice";
import { AppDispatch, RootState } from "../app/store";

const AuthGuard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const session = useSelector((state: RootState) => state.auth.session);
  const status = useSelector((state: RootState) => state.auth.status);

  useEffect(() => {
    if (status === "idle") dispatch(getSession());
  }, [dispatch, status]);

  useEffect(() => {
    if (session) navigate("/");
  }, [session, navigate]);

  return <Outlet />;
};

export default AuthGuard;
