import { Outlet, Route, Routes } from 'react-router-dom';
import { LoginPage, MainPage } from '@/pages';

const Layout = () => {
  return <Outlet />;
};

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="" element={<MainPage />} />
        <Route path="" element={<LoginPage />} />
      </Route>
    </Routes>
  );
};

export default Router;
