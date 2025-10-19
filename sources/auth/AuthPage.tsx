import { useMutation } from '@tanstack/react-query'
import { check, login, refresh } from './auth'
import { clearTokens, getAccessToken, setAccessToken } from './tokenStorage'

export const AuthPage = () => {
  const loginMutation = useMutation({ mutationFn: login })
  const refreshMutation = useMutation({ mutationFn: refresh })
  const checkMutation = useMutation({ mutationFn: check })

  const handleLogin = async () => {
    const result = await loginMutation.mutateAsync()

    setAccessToken(result.accessToken)
  }

  const handleRefresh = async () => {
    const result = await refreshMutation.mutateAsync()

    setAccessToken(result.accessToken)
  }

  const handleLogout = () => {
    clearTokens()
  }

  const handleGetAccessToken = () => {
    const accessToken = getAccessToken()

    console.log(accessToken)
  }

  const handleCheck = async () => {
    const result = await checkMutation.mutateAsync()

    console.log(result)
  }

  const handleCheckTriple = () => {
    checkMutation.mutate()
    checkMutation.mutate()
    checkMutation.mutate()
  }

  const handleCheckTripleAsync = async () => {
    await checkMutation.mutateAsync()
    await checkMutation.mutateAsync()
    await checkMutation.mutateAsync()
  }

  return (
    <div>
      <h1>Auth</h1>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRefresh}>Refresh</button>
      <button onClick={handleGetAccessToken}>Get Access Token</button>
      <button onClick={handleLogout}>Logout</button>

      <br />
      <br />
      <br />

      <button onClick={handleCheck}>Check</button>
      <button onClick={handleCheckTriple}>Check Triple</button>
      <button onClick={handleCheckTripleAsync}>Check Triple Async</button>
    </div>
  )
}
