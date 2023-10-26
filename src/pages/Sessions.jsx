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
          ? <>
            <h1 className="page-header__text">Сеанси роботи з реєстром</h1>
            <table className='sessions-table'>
              <thead>
                <tr className="data-table__header">
                  <th>Хто працював</th>
                  <th>Початок сеансу</th>
                  <th>Кінець сеансу</th>
                  <th>IP входу</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map(session =>
                  <tr key={session.Id} className="data-table__item data-table__item-border">
                    <td className='data-table__check-type'>{session.UserName}</td>
                    <td className='data-table__session-info'>{session.DateTimeStart}</td>
                    <td className='data-table__session-info'>{session.DateTimeFinish}</td>
                    <td className='data-table__session-info'>{session.HostIP}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
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