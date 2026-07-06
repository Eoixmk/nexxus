export function parseFetchError(error: unknown): string {
  return getFetchErrorMessage(error, 'Unexpected error')
}
