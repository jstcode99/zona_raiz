import { SignInForm } from "@/features/auth/sign-in-form";
import OAuthCallbackHandler from "@/features/auth/oauth-callback-handler";

export default function page() {
  return (
    <>
      <OAuthCallbackHandler />
      <SignInForm />
    </>
  );
}