import { Outlet, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  AdminPage,
  BoardPage,
  LoginPage,
  MainPage,
  ModelCreate,
  ModelProducing,
  ModelProfile,
  ProfilePage,
  SignUpPage,
  TalkVideoPage,
  TalkVoicePage,
  VideoStorage,
} from '@/pages';
import { getAccessToken } from '@/utils';
import useAuth from '@/hooks/useAuth';
import { getUserInfo } from '@/api/user';

const Layout = () => {
  return <Outlet />;
};

// 보호된 경로를 위한 컴포넌트
const ProtectedRoute = () => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    // 로그인 상태가 아니면 로그인 페이지로 리다이렉트
    return <Navigate to="/login" replace />;
  }
  // 로그인 상태이면 해당 컴포넌트를 렌더링
  return <Outlet />;
};

// 로그인 상태에 따른 MainPage 리다이렉션
const RedirectToBoard = () => {
  const accessToken = getAccessToken();

  if (accessToken) {
    // 이미 로그인된 상태라면 '/board'로 리다이렉트
    return <Navigate to="/board" replace />;
  }
  // 로그인하지 않은 상태라면 MainPage 렌더링
  return <MainPage />;
};
const ProtectedAdmin = () => {
  const { userInfo, setUserInfo } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await getUserInfo(); // Assumed to be an API call
        setUserInfo(response.data);
        setIsAdmin(response.data.userNo === 4);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!userInfo) {
      fetchUserInfo();
    } else {
      setIsAdmin(userInfo.userNo === 4);
      setIsLoading(false);
    }
  }, [userInfo, setUserInfo]);

  if (isLoading) {
    return <div>Loading...</div>; // 또는 로딩 스피너 컴포넌트
  }

  if (!isAdmin) {
    return <Navigate to="/board" replace />;
  }

  return <Outlet />;
};

// 메인 Router 컴포넌트
const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<RedirectToBoard />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="talk/voice/:modelNo" element={<TalkVoicePage />} />
          <Route path="talk/video/:modelNo" element={<TalkVideoPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="board" element={<BoardPage />} />
          <Route path="board/create" element={<ModelCreate />} />
          <Route path="board/:modelNo" element={<ModelProfile />} />
          <Route path="producing/:modelNo" element={<ModelProducing />} />
          <Route path="videostorage" element={<VideoStorage />} />
        </Route>
        <Route element={<ProtectedAdmin />}>
          <Route path="admin" element={<AdminPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Router;
