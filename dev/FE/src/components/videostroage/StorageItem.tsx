import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/free-mode';

const Wrapper = styled.div`
  margin: 1rem 0 1rem 1rem;
`;

const Text = styled.div`
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 500;
`;

const Item = styled.div`
  width: 29vw;
  height: 29vw;
  border-radius: 8px;
  background-color: #f6f6f6;
`;

const StorageItem = () => {
  return (
    <Wrapper>
      <Text>가장 많이 대화한 인물</Text>
      <Swiper
        slidesPerView={3}
        spaceBetween={16}
        freeMode
        modules={[FreeMode]}
        className="mySwiper"
      >
        <SwiperSlide>
          <Item />
        </SwiperSlide>
        <SwiperSlide>
          <Item />
        </SwiperSlide>
        <SwiperSlide>
          <Item />
        </SwiperSlide>
        <SwiperSlide>
          <Item />
        </SwiperSlide>
        <SwiperSlide>
          <Item />
        </SwiperSlide>
        <SwiperSlide>
          <Item />
        </SwiperSlide>
        <SwiperSlide>
          <Item />
        </SwiperSlide>
      </Swiper>
    </Wrapper>
  );
};

export default StorageItem;
