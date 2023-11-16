import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
    }
    :root {
        --primary-color : #2D657C;
    }
    a {
        text-decoration: none;
        color: #2D657C;
    }
    .swal2-title-custom {
    font-size: 24px;
    word-break: keep-all;
  }
`;

export default GlobalStyle;
