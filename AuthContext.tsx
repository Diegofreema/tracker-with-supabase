import { Children, createContext, useEffect, useState } from 'react';
import { supabase } from './config/supabaseClient';
import { User } from '@supabase/supabase-js';

export const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  setIsLoggedIn: (isLoggedIn: boolean) => {},
  setUser: (user: any) => {},
});

const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
  logOut: () => void;
  user: User | null;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  console.log('19', user);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  const value = {
    user,
    setUser,
    isLoggedIn,
    setIsLoggedIn,
  };
  // @ts-ignore
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
