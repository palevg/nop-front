import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import Login from '../pages/Login';
import Error from '../pages/Error';
import Enterprises from "../pages/Enterprises";
import Enterprise from "../pages/Enterprise";
import Person from "../pages/Person";
import Peoples from "../pages/Peoples";
import Sessions from "../pages/Sessions";
import Profile from "../pages/Profile";

export default function AppRouter() {

  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path='/about' element={<About />} />
      <Route path='/login' element={<Login />} />
      <Route path='/enterprs' element={<Enterprises />} />
      <Route path='/enterprs/:id' element={<Enterprise />} />
      <Route path='/peoples' element={<Peoples />} />
      <Route path='/peoples/:id' element={<Person />} />
      <Route path='/sessions' element={<Sessions />} />
      <Route path='/profile' element={<Profile />} />
      <Route path="*" element={<Error />} />
    </Routes>
  )
}