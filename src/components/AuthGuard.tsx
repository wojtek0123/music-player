import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IAuth, getSession } from "../features/auth/authSlice";
import { PlayerState } from "../features/player/playerSlice";
import { AppDispatch } from "../app/store";

const AuthGuard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const session = useSelector((state: { player: PlayerState; auth: IAuth }) => state.auth.session);
  const status = useSelector((state: { player: PlayerState; auth: IAuth }) => state.auth.status);

  useEffect(() => {
    if (status === "idle") dispatch(getSession());
  }, [dispatch, status]);

  useEffect(() => {
    if (session) navigate("/");
  }, [session, navigate]);

  return <Outlet />;
};

export default AuthGuard;
