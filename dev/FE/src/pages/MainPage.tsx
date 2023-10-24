import { InputText, LargeButton } from '@/components/common';

const MainPage = () => {
  return (
    <div>
      <InputText type="text" placeholder="이름" />
      <InputText type="email" placeholder="이메일" />
      <InputText type="password" placeholder="비밀번호" />
      <LargeButton content="로 그 인" />
      <LargeButton content="회 원 가 입" />
      <LargeButton content="저장" />
    </div>
  );
};

export default MainPage;
