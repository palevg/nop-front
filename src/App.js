import React from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { BrowserRouter } from 'react-router-dom';
import './styles/App.css';
import { AuthContext } from "./context/authContext";
import Header from './components/Header';
import AppRouter from './components/AppRouter';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { isAuth, currentUser, logout, auth } = React.useContext(AuthContext);
  const [remaining, setRemaining] = React.useState(0);

  const onIdle = () => {
    if (isAuth && window.localStorage.getItem('token')) {
      logout(currentUser);
      toast.info("Ваш сеанс роботи завершено автоматично у зв'язку із неактивністю впродовж 10 хвилин. Для продовження роботи потрібна повторна авторизація!");
    }
  }

  const { getRemainingTime } = useIdleTimer({ onIdle, timeout: 6000000, throttle: 500 });

  React.useEffect(() => {   // перевірка при першому запуску, чи авторизований користувач
    window.localStorage.getItem('token') && auth();

    const interval = setInterval(() => {
      setRemaining(Math.ceil(getRemainingTime() / 1000))
    }, 500)

    return () => {
      clearInterval(interval)
    }
  }, []);

  return (
    <BrowserRouter>
      <Header />
      <ToastContainer position="top-center" />
      <AppRouter />
    </BrowserRouter>
  )
}

export default App;