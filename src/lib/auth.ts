import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { AuthOptions } from "next-auth";
import { prisma } from "./prisma";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
    debug: process.env.NODE_ENV !== "production",
    adapter: PrismaAdapter(prisma),
    providers: [
        // 🌐 Google OAuth
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

        // 🐙 GitHub OAuth
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),

        // ✉️ Credentials Provider
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });
                if (!user) return null;
                const isValid = await bcrypt.compare(credentials.password as string, user.password as string);
                return isValid ? user : null;
            },
        }),
    ],

    session: { strategy: "jwt" },
    pages: { signIn: "/signin" },
    secret: process.env.NEXTAUTH_SECRET,


    callbacks: {
        async redirect({ url, baseUrl }) {
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            if (new URL(url).origin === baseUrl) return url;
            return `${baseUrl}/dashboard`;
        },
        async signIn({ user, account, profile }) {
            // If the OAuth provider returned an email that's already in the database,
            // link the OAuth account to the existing user so users don't get "OAuthAccountNotLinked".
            try {
                if (!account || !profile || !(profile as any).email) return true;

                // Only auto-link when the provider has verified the email
                if ((profile as any).email_verified === false) return false;

                const existing = await prisma.user.findUnique({ where: { email: profile.email } });
                if (existing) {
                    // Check if the account is already linked
                    const linked = await prisma.account.findFirst({
                        where: { provider: account.provider, providerAccountId: account.providerAccountId },
                    });
                    if (!linked) {
                        await prisma.account.create({
                            data: {
                                userId: existing.id,
                                type: account.type,
                                provider: account.provider!,
                                providerAccountId: account.providerAccountId!,
                                access_token: account.access_token,
                                refresh_token: account.refresh_token,
                                expires_at: account.expires_at,
                                token_type: account.token_type,
                                scope: account.scope,
                                id_token: account.id_token,
                            },
                        });
                    }
                }
            } catch (err) {
                console.error("Error in signIn callback while linking account:", err);
                return false;
            }

            return true;
        },
    },
};
