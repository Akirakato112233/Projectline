function AuthGuard({ currentUser, fallback, children }) {
  if (!currentUser) {
    return fallback
  }

  return children
}

export default AuthGuard
