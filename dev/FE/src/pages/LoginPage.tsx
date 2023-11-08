import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { InputText, LargeButton } from '@/components/common';
import PageHeader from '@/components/navbar/PageHeader';
import { Login, UserResponse } from '@/types/user';
import { userLogin } from '@/api/user';
import useAuth from '@/hooks/useAuth';

const LoginPage = () => {
  const { setUserInfo } = useAuth();
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState<Login>({
    userId: '',
    password: '',
  });

  const handleIdChange = (e: string) => {
    setLoginForm((prevState) => ({
      ...prevState,
      userId: e,
    }));
  };
  const handlePasswordChange = (e: string) => {
    setLoginForm((prevState) => ({
      ...prevState,
      password: e,
    }));
  };

  const mutation = useMutation<AxiosResponse<UserResponse>, Error, Login>(
    userLogin,
    {
      onSuccess: (res) => {
        setUserInfo(res.data);
        const { accessToken, refreshToken } = res.data.tokenResponse;
        sessionStorage.setItem('accessToken', accessToken);
        sessionStorage.setItem('refreshToken', refreshToken);
        navigate('/board');
      },
      onError: () => {
        window.alert('아이디 혹은 비밀번호를 확인해 주세요');
      },
    },
  );

  const handleLoginClick = () => {
    mutation.mutate(loginForm);
  };

  const handleGoSignUp = () => {
    navigate('/signup');
  };

  const headerContent = {
    left: 'Back',
    title: '로그인',
    right: 'SignUp',
  };

  return (
    <>
      <PageHeader
        content={headerContent}
        type={1}
        rightButtonClick={handleGoSignUp}
      />
      <InputText
        type="text"
        placeholder="아이디"
        value={loginForm.userId}
        onChange={handleIdChange}
      />
      <InputText
        type="password"
        placeholder="비밀번호"
        value={loginForm.password}
        onChange={handlePasswordChange}
      />
      <LargeButton onClick={handleLoginClick} content="로 그 인" />
    </>
  );
};

export default LoginPage;
