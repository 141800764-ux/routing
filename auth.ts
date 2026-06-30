import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongoose";
import User from "@/database/user.model";
import { authConfig } from "./auth.config";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await dbConnect();

        const user = await User.findOne({
          email: credentials.email,
        }).select("+passwordHash");

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isValid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,

    async signIn({ user, profile, account }) {
      // Skip user-creation logic for credentials login (user already exists)
      if (account?.provider === "credentials") return true;

      try {
        await dbConnect();

        if (!user.email) return false;

        const existing = await User.findOne({ email: user.email });

        if (!existing) {
          const baseUsername =
            (profile?.login as string) ||
            user.email.split("@")[0] ||
            "user";

          let username = baseUsername;
          let suffix = 1;

          while (await User.findOne({ username })) {
            username = `${baseUsername}${suffix}`;
            suffix++;
          }

          await User.create({
            name: user.name || "Anonymous",
            email: user.email,
            username,
            image: user.image || "",
          });
        }

        return true;
      } catch (error) {
        console.error("signIn callback error:", error);
        return false;
      }
    },

    async session({ session }) {
      try {
        await dbConnect();

        if (session.user?.email) {
          const dbUser = await User.findOne({ email: session.user.email });
          if (dbUser) {
            (session.user as any).id = dbUser._id.toString();
          }
        }
      } catch (error) {
        console.error("session callback error:", error);
      }

      return session;
    },
  },
});