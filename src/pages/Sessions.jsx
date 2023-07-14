import React from 'react';
import { AuthContext } from "../context/authContext";
import UserService from "../API/UserService";
import Error from './Error';
import Loader from '../components/UI/Loader/Loader';
import { useFetching } from '../hooks/useFetching';

const Sessions = () => {
  const { isAuth, currentUser } = React.useContext(AuthContext);
  const [sessions, setSessions] = React.useState([]);

  const [fetchSessions, isSessionsLoading, loadError] = useFetching(async () => {
    const response = await UserService.getSessions();
    setSessions(response.data);
  });

  React.useEffect(() => {
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
            {sessions.map((item, index) =>
              <div className="enterpr__item" key={index}>
                <div>{item.UserName}</div>
                <div>{item.DateTimeStart}</div>
                <div>{item.DateTimeFinish}</div>
                <div>{item.HostIP}</div>
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

export default Sessions;