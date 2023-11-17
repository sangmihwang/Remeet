# REMEET FrontEnd README

# 네이밍 컨벤션

- constants

  - 대문자 + \_

  ```js
  const SCREAM_SNAKE_CASE = true;
  ```

- variables : camelCase

  ```js
  const [camelCase, setCamelCase] = useState < boolean > true;
  ```

- function : camelCase

  ```js
  const countUp = () => setCount(count + 1);
  ```

- event handler function : `handle` 로 시작

  ```js
  const handleButtonPress = () => console.log(count);
  ```

- props interface : `컴포넌트 명` + `Props`

  ```js
    interface ComponentProps {
      name: string,
      age: number,
    }

    const Component = ({ name, age }: ComponentProps) => {
      return <div>This is Component</div>
    }

    export default Component;
  ```

# 컴포넌트 자동 완성 명령어: rafce

```js
import React from 'react';

const temp = () => {
  return <div>temp</div>;
};

export default temp;
```

# 폴더 구조

```
src
├─ components
├─ assets : 동적 이미지 파일 / 정적 이미지 파일은 public으로.
├─ hooks (= hoc)
├─ pages : 라우팅 페이지
├─ constants
├─ styles
├─ api
├─ utils
├─ types : interface, type 모음
├─ App.tsx
└─ main.tsx
```
