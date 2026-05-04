import React from "react";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-auth-light dark:bg-auth-dark bg-cover bg-center px-4 py-10">

      <section className="w-full max-w-[500px] rounded-xl border border-white/10 bg-white/10 dark:bg-black/20 backdrop-blur-xl px-6 py-10 shadow-2xl">

        {children}

      </section>

    </main>
  );
};

export default AuthLayout;