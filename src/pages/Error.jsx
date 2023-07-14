import React from "react";
import { Link } from 'react-router-dom';
import { AuthContext } from "../context/authContext";

const Error = () => {
  const { isAuth } = React.useContext(AuthContext);

  return (<div className="error-page">
    <h1>Інформації не знайдено!</h1>
    <h3>Причина: {isAuth
      ? "запит на отримання інформації некоректний"
      : "Ви не авторизовані для роботи із реєстром. "
    }
    {!isAuth && <Link to="/login">Авторизуватись!</Link>}</h3>
  </div>
  )
}

export default Error;