import { createContext, useEffect, useState } from "react";
import { supabase } from "../helpers/supabase";
// eslint-disable-next-line import/named
import { Session } from "@supabase/supabase-js";

interface IAuthContext {
  session: Session | null | undefined;
  setSession: (_session: Session | null) => void;
}

export const AuthContext = createContext<IAuthContext>({
  session: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSession: () => {},
});

interface IAuthContextProvider {
  children: JSX.Element;
}

function AuthContextProvider(props: IAuthContextProvider) {
  const [session, setSession] = useState<Session | null>();

  const getSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error != null) {
        throw new Error("Something went wrong");
      }

      setSession(data.session);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  useEffect(() => {
    void (async () => {
      await getSession();
    })();
  }, []);

  const value = {
    session,
    setSession,
  };

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
}

export default AuthContextProvider;
