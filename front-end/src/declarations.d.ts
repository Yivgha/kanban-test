declare module '*.svg' {
  const content: string;
  export default content;
}

declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_BACKEND_URL: string;
  }
}
