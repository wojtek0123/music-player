import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface AuthGuardProps {
  children: JSX.Element;
  authAccess: boolean;
}

const AuthGuard = ({ children, authAccess }: AuthGuardProps) => {
  const navigate = useNavigate();
  const { session } = useContext(AuthContext);

  useEffect(() => {
    if (!session && authAccess) {
      navigate("/login");
    }
    if (session && !authAccess) {
      navigate("/");
    }
  }, [session, navigate, authAccess]);

  return <>{children}</>;
};

export default AuthGuard;
