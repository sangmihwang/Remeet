import { Outlet, Route, Routes } from 'react-router-dom';
import {
  LoginPage,
  MainPage,
  ProfilePage,
  SignUpPage,
  TalkPage,
} from '@/pages';

const Layout = () => {
  return <Outlet />;
};

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="" element={<MainPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="talk" element={<TalkPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
};

export default Router;
