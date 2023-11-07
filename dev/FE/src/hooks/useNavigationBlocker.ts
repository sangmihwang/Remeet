import { useEffect, useContext } from 'react';
import {
  useNavigate,
  UNSAFE_NavigationContext as NavigationContext,
} from 'react-router-dom';

// 사용자 정의 내비게이션 블로커 후크의 타입
type NavigationBlocker = (message: string) => void;

// 사용자 정의 내비게이션 블로커 후크
const useNavigationBlocker: NavigationBlocker = (message: string) => {
  const navigationContext = useContext(NavigationContext);

  useEffect(() => {
    const unblock = navigationContext.navigator.block((tx) => {
      // 사용자에게 경고 표시
      if (window.confirm(message)) {
        // 사용자가 확인을 클릭하면 이동 수행
        unblock();
        tx.retry();
      }
    });

    return unblock; // 컴포넌트 언마운트 시 차단 해제
  }, [navigationContext, message]);
};

export default useNavigationBlocker;
