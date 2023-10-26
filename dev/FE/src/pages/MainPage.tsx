import { Image, LargeButton } from '@/components/common';
import BottomNavigation from '@/components/navbar/BottomNavigation';
import PageHeader from '@/components/navbar/PageHeader';

const MainPage = () => {
  return (
    <div>
      <PageHeader
        content={{ left: 'Back', title: 'Re:memories', right: 'Add' }}
        type={1}
      />
      <LargeButton content="로 그 인" />
      <LargeButton content="회 원 가 입" />
      <LargeButton content="저장" />
      <Image src="/dummy/갱얼쥐.jpg" />
      <Image src="/dummy/갱얼쥐.jpg" />
      <Image src="/dummy/갱얼쥐.jpg" />

      <PageHeader
        content={{ left: 'Back', title: 'Re:memories', right: 'Add' }}
        type={2}
      />
      <PageHeader
        content={{ left: 'Back', title: '로그인', right: 'SignUp' }}
        type={1}
      />
      <BottomNavigation />
    </div>
  );
};

export default MainPage;
