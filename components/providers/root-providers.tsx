"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

interface Props {
  children: React.ReactNode;
  session: any;
}

export default function RootProviders({
  children,
  session,
}: Props) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}