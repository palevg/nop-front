import { useContext, useState, useEffect } from 'react';
import { AuthContext } from "../context/authContext";
import UserService from "../API/UserService";
import Error from './Error';
import Loader from '../components/UI/Loader/Loader';
import { useFetching } from '../hooks/useFetching';

export default function Sessions() {
  const { isAuth, currentUser } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);

  const [fetchSessions, isSessionsLoading, loadError] = useFetching(async () => {
    const response = await UserService.getSessions();
    setSessions(response.data);
  });

  useEffect(() => {
    fetchSessions();
  }, []);

  return isAuth
    ? currentUser.acc > 2
      ? <div className="list-page">
        {loadError && <h1>Сталась помилка "{loadError}"</h1>}
        {sessions.length > 0
          ? <div>
            <h1 className="page-header__text">Сеанси роботи з реєстром</h1>
            <div className="enterpr__header">
              <div>Хто працював</div>
              <div>Початок сеансу</div>
              <div>Кінець сеансу</div>
              <div>IP входу</div>
            </div>
            {sessions.map(session =>
              <div className="enterpr__item" key={session.Id}>
                <div>{session.UserName}</div>
                <div>{session.DateTimeStart}</div>
                <div>{session.DateTimeFinish}</div>
                <div>{session.HostIP}</div>
              </div>
            )}
          </div>
          : <h1 className="info_message">{
            isSessionsLoading
              ? "Зачекайте, йде завантаження даних..."
              : "Записів не знайдено!"
          }</h1>
        }
        {isSessionsLoading && <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}><Loader /></div>}
      </div>
      : <Error />
    : <Error />
}