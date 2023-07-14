import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './styles/App.css';
import { AuthContext } from "./context/authContext";
import Header from './components/Header';
import AppRouter from './components/AppRouter';

function App() {
  const { isAuth, currentUser, logout, auth } = React.useContext(AuthContext);
  
  const onUserInactive = () => {
    if (isAuth && window.localStorage.getItem('token')) {
      logout(currentUser);
      alert("Ваш сеанс роботи завершено автоматично у зв'язку із неактивністю впродовж 10 хвилин.\nДля продовження роботи потрібна повторна авторизація!");
    }
  }
  let wait = setTimeout(onUserInactive, 6000000);
  const onUserActivity = function () {
    clearTimeout(wait);
    wait = setTimeout(onUserInactive, 6000000);
  };
  document.onmousemove = onUserActivity;
  document.onmouseover = onUserActivity;
  document.onkeydown = onUserActivity;
  document.onkeyup = onUserActivity;

  React.useEffect(() => {   // перевірка при першому запуску, чи авторизований користувач
    window.localStorage.getItem('token') && auth();
  }, []);

  return (
    <BrowserRouter>
      <Header />
      <AppRouter />
    </BrowserRouter>
  )
}

export default App;