import styled from 'styled-components';

const ImageWrapper = styled.div<{ $imageUrl: string }>`
  width: 42vw;
  height: 42vw;
  border-radius: 100%;
  border: 4px solid #fff;
  box-shadow: 0 4px 20px #656565;
  background-color: #fff;
  background-image: url(${(props) => props.$imageUrl});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

interface ImageProps {
  src: string;
}

const Image = ({ src }: ImageProps) => {
  return (
    <ImageWrapper $imageUrl={src === 'common' ? '/dummy/Vector.png' : src} />
  );
};

export default Image;
