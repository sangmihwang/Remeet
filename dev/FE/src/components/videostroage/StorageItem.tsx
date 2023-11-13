import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ModelInformation } from '@/types/peopleList';

const Wrapper = styled.div`
  margin: 0 auto;
  margin-bottom: 1rem;
  width: 93vw;
  height: fit-content;
`;

const Text = styled.div`
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 500;
`;

const ItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Item = styled.div`
  width: 29vw;
  height: fit-content;
`;

const ItemImage = styled.div<{ $imagePath: string }>`
  width: 29vw;
  height: 29vw;
  border-radius: 8px;
  background-color: #f6f6f6;
  background-image: url(${(props) => props.$imagePath});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const ItemText = styled.div`
  padding: 0.2rem 0;
  text-align: center;
  font-weight: 600;
  font-size: 1.125rem;
`;

interface StorageItemProps {
  videos: ModelInformation[];
  title: string;
}

const StorageItem = ({ videos, title }: StorageItemProps) => {
  const navigate = useNavigate();
  const handleItemClick = (modelNo: number) => {
    navigate(`/board/${modelNo}`);
  };
  return (
    <Wrapper>
      <Text>{title}</Text>
      <ItemWrapper>
        {videos &&
          videos.map((item) => {
            return (
              <Item>
                <ItemImage
                  onClick={() => handleItemClick(item.modelNo)}
                  $imagePath={item.imagePath}
                />
                <ItemText>{item.modelName}</ItemText>
              </Item>
            );
          })}
      </ItemWrapper>
    </Wrapper>
  );
};

export default StorageItem;
