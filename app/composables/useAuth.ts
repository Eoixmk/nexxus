/**
 * Minimal auth state placeholder.
 *
 * Swap the login()/logout() bodies for real API calls (TanStack Query mutation
 * or $fetch). Kept in a cookie so it survives reloads and is available during
 * SSR — important for the auth middleware to run correctly on the server.
 */
export interface AuthUser {
  id: string
  name: string
  email: string
}

export function useAuth() {
  // useCookie is SSR-safe and shared across the app.
  const user = useCookie<AuthUser | null>('auth_user', {
    default: () => null,
    sameSite: 'lax',
  })

  const isLoggedIn = computed(() => user.value != null)

  async function login(email: string, _password: string) {
    // TODO: replace with a real request, e.g.
    //   const data = await $fetch('/api/auth/login', { method: 'POST', body: { email, password } })
    await new Promise((r) => setTimeout(r, 400)) // simulate latency
    user.value = {
      id: 'demo-1',
      name: email.split('@')[0] ?? 'Usuario',
      email,
    }
  }

  function logout() {
    user.value = null
    return navigateTo('/login')
  }

  return { user, isLoggedIn, login, logout }
}
