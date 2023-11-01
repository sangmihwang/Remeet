import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import styled from 'styled-components';
import { InputText, LargeButton } from '@/components/common';
import PageHeader from '@/components/navbar/PageHeader';
import { SignUpForm } from '@/types/user';
import { getCheckUserId, userSignUp } from '@/api/user';

const ErrorText = styled.div`
  width: 86vw;
  margin: 0 auto;
  font-size: 0.75rem;
  color: var(--primary-color);
`;

const SignUpPage = () => {
  const navigate = useNavigate();
  const [signUpForm, setSignUpForm] = useState<SignUpForm>({
    userId: '',
    password: '',
    passwordCheck: '',
    userName: '',
    userEmail: '',
    imagePath: 'image',
  });

  const [checkForm, setCheckForm] = useState({
    idCheck: true,
    passwordCheck: true,
  });

  useEffect(() => {
    const isTruePassword = signUpForm.password === signUpForm.passwordCheck;
    if (isTruePassword) {
      setCheckForm((prev) => ({ ...prev, passwordCheck: true }));
    } else {
      setCheckForm((prev) => ({ ...prev, passwordCheck: false }));
    }
  }, [signUpForm.password, signUpForm.passwordCheck]);

  const checkIdQuery = useQuery(
    ['checkId', signUpForm.userId],
    () => getCheckUserId(signUpForm.userId),
    {
      enabled: !!signUpForm.userId,
      retry: false,
      onSuccess: () => {
        setCheckForm((prev) => ({ ...prev, idCheck: false }));
      },
      onError: () => {
        setCheckForm((prev) => ({ ...prev, idCheck: true }));
      },
    },
  );

  const handleIdChange = (e: string) => {
    setSignUpForm((prevState) => ({
      ...prevState,
      userId: e,
    }));
  };
  const handleNameChange = (e: string) => {
    setSignUpForm((prevState) => ({
      ...prevState,
      userName: e,
    }));
  };
  const handlePasswordChange = (e: string) => {
    setSignUpForm((prevState) => ({
      ...prevState,
      password: e,
    }));
  };
  const handlePasswordCheckChange = (e: string) => {
    setSignUpForm((prevState) => ({
      ...prevState,
      passwordCheck: e,
    }));
  };
  const handleEmailChange = (e: string) => {
    setSignUpForm((prevState) => ({
      ...prevState,
      userEmail: e,
    }));
  };

  const mutation = useMutation<AxiosResponse, Error, SignUpForm>(userSignUp, {
    onSuccess: (res) => {
      console.log(res);
      navigate('/login');
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleSingUpClick = () => {
    mutation.mutate(signUpForm);
    console.log(checkIdQuery);
    console.log(signUpForm);
  };

  const handleGoLogin = () => {
    navigate('/login');
  };

  const headerContent = {
    left: 'Back',
    title: '회원가입',
    right: 'Login',
  };
  return (
    <>
      <PageHeader
        content={headerContent}
        type={1}
        rightButtonClick={handleGoLogin}
      />
      <InputText
        type="text"
        placeholder="아이디"
        value={signUpForm.userId}
        onChange={handleIdChange}
      />
      {checkForm.idCheck && signUpForm.userId.length > 0 && (
        <ErrorText>다른 아이디를 사용해 주세요.</ErrorText>
      )}
      <InputText
        type="text"
        placeholder="이름"
        value={signUpForm.userName}
        onChange={handleNameChange}
      />
      <InputText
        type="password"
        placeholder="비밀번호"
        value={signUpForm.password}
        onChange={handlePasswordChange}
      />
      <InputText
        type="password"
        placeholder="비밀번호 확인"
        value={signUpForm.passwordCheck}
        onChange={handlePasswordCheckChange}
      />
      {!checkForm.passwordCheck && signUpForm.passwordCheck.length > 0 && (
        <ErrorText>비밀번호를 다시 한번 확인해 주세요.</ErrorText>
      )}
      <InputText
        type="email"
        placeholder="이메일"
        value={signUpForm.userEmail}
        onChange={handleEmailChange}
      />
      <LargeButton onClick={handleSingUpClick} content="회 원 가 입" />
    </>
  );
};

export default SignUpPage;
