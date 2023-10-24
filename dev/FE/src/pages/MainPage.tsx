import { InputText, LargeButton } from '@/components/common';
import PageHeader from '@/components/navbar/PageHeader';

const MainPage = () => {
  return (
    <div>
      <InputText type="text" placeholder="이름" />
      <InputText type="email" placeholder="이메일" />
      <InputText type="password" placeholder="비밀번호" />
      <LargeButton content="로 그 인" />
      <LargeButton content="회 원 가 입" />
      <LargeButton content="저장" />
      <PageHeader
        content={{ left: 'Back', title: 'Re:memories', right: 'Add' }}
        type={1}
      />
      <PageHeader
        content={{ left: 'Back', title: 'Re:memories', right: 'Add' }}
        type={2}
      />
      <PageHeader
        content={{ left: 'Back', title: '로그인', right: 'SignUp' }}
        type={1}
      />
    </div>
  );
};

export default MainPage;
