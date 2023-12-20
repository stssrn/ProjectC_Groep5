// docs voor duidelijkheid: https://stackoverflow.com/a/74078101
export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/((?!api|static|favicon.ico|login).*)']
}