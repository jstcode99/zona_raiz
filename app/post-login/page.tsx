import { getPostLoginState } from "@/application/actions/postLoginActions"
import { PostLoginContainer } from "@/features/post-login/post-login-container"

export default async function PostLoginPage() {
  const state = await getPostLoginState()

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <PostLoginContainer initialState={state} />
    </div>
  )
}