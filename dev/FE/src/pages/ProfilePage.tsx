import styled from 'styled-components';
import PageHeader from '@/components/navbar/PageHeader';
import BottomNavigation from '@/components/navbar/BottomNavigation';

const TitleWrapper = styled.div`
  width: 100%;
  height: 25rem;
  background-color: var(--primary-color);
`;

const ProfilePage = () => {
  const headerContent = {
    left: 'Back',
    title: 'Profile',
    right: 'Modify',
  };
  return (
    <div>
      <TitleWrapper>
        <PageHeader content={headerContent} type={2} />
      </TitleWrapper>
      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;
