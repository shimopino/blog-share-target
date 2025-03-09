import { AuthProvider as OidcAuthProvider } from "react-oidc-context";

// TODO: VITE_ENV から参照するように修正する
const cognitoAuthConfig = {
  authority: "https://cognito-idp.ap-northeast-1.amazonaws.com/ap-northeast-1_pVInAv4U0",
  client_id: "6etl8gobqrgkjqdpp23cflgidp",
  redirect_uri: "http://localhost:5173",
  response_type: "code",
  scope: "email openid profile",
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <OidcAuthProvider {...cognitoAuthConfig}>
      {children}
    </OidcAuthProvider>
  );
};
