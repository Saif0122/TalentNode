import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide both email and password");
        }

        try {
          // Call your backend Express API
          const res = await axios.post(`${API_URL}/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          // Extract token from Set-Cookie header to use as Bearer token later
          let accessToken: string | undefined = undefined;
          const setCookieHeaders = res.headers['set-cookie'];
          if (setCookieHeaders) {
            const tokenCookie = setCookieHeaders.find((c: string) => c.startsWith('token='));
            if (tokenCookie) {
              accessToken = tokenCookie.split(';')[0].substring('token='.length);
            }
          }

          const user = res.data?.data;

          if (user) {
            // Return user object including role and id
            return {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              accessToken,
            };
          }

          return null;
        } catch (error: any) {
          // Pass the error message from the backend to the client
          const message = error.response?.data?.error || "Login failed";
          throw new Error(message);
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          if (!user.email || !user.name) {
             console.error("Missing user info from Google");
             return false;
          }

          // Forward to backend to create or link the user in MongoDB
          const res = await axios.post(`${API_URL}/auth/google`, {
            email: user.email,
            name: user.name,
            role: "candidate", // Default role
          });

          // Extract token from Set-Cookie header
          let accessToken: string | undefined = undefined;
          const setCookieHeaders = res.headers['set-cookie'];
          if (setCookieHeaders) {
            const tokenCookie = setCookieHeaders.find((c: string) => c.startsWith('token='));
            if (tokenCookie) {
              accessToken = tokenCookie.split(';')[0].substring('token='.length);
            }
          }

          const backendUser = res.data?.data;
          
          if (backendUser) {
            // Attach role, id, and token to user object so they hit the jwt callback
            (user as any).role = backendUser.role;
            (user as any).id = backendUser._id;
            (user as any).accessToken = accessToken;
            return true;
          }

          return false;
        } catch (error) {
          console.error("Google sign in error:", error);
          return false;
        }
      }
      return true; // return true for credentials flow
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
        token.accessToken = (user as any).accessToken;
        console.log('[NextAuth] JWT Callback - User Sign-in:', { id: token.id, role: token.role });
      }
      
      if (trigger === "update" && session) {
        token.role = session.role ?? token.role;
        token.accessToken = session.accessToken ?? token.accessToken;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).accessToken = token.accessToken;
        console.log('[NextAuth] Session Callback:', { id: (session.user as any).id, role: (session.user as any).role });
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
