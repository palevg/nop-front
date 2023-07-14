import { createContext, useState } from "react";
import axios from "../axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);

  const auth = async (params) => {
    const res = await axios.get("/auth/me", params);
    if ("FullName" in res.data) {
      setCurrentUser(res.data);
      setIsAuth(true);
    }
  }

  const login = async (inputs) => {
    await axios.post("/auth/login", inputs)
      .then(res => {
        setCurrentUser(res.data);
        window.localStorage.setItem("token", res.data.token);
        setIsAuth(true);
      })
      .catch(err => {
        alert('Не вдалося авторизуватися!');
        // if (err.response) {
        //   // client received an error response (5xx, 4xx)
        // } else if (err.request) {
        //   // client never received a response, or request never left 
        // } else {
        //   // anything else 
        // }
      });
  }

  const logout = async (params) => {
    window.localStorage.removeItem("token");
    setCurrentUser(null);
    setIsAuth(false);
    await axios.post("/auth/logout", params);
  }

  // useEffect(() => {
  //   localStorage.setItem("user", currentUser);
  // }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, isAuth, auth, login, logout }}>{children}</AuthContext.Provider>
  );
}