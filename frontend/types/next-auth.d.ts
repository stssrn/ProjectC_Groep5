// docs: https://nextjs.org/docs/app/building-your-application/configuring/typescript
// nextauth docs: https://next-auth.js.org/getting-started/typescript
import 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: number;
      name?: string;
      email?: string;
      image?: string;
    };
  }
}
