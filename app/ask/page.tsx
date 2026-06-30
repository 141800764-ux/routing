import { auth } from "@/auth";
import { redirect } from "next/navigation";

import QuestionForm from "@/components/forms/QuestionForm";
import RightSidebar from "@/components/navigation/navbar/RightSideBar";

const Page = async () => {
  const session = await auth();

  // Force authentication
  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-[#030712]">
      <div className="flex">
        {/* MAIN CONTENT */}
        <section
          className="
            flex min-h-screen flex-1 flex-col
            px-6 pb-10 pt-32
            sm:px-14
          "
        >
          <div className="mx-auto w-full max-w-5xl">
            <h1 className="text-3xl font-bold text-white">
              Ask a Question
            </h1>

            <QuestionForm />
          </div>
        </section>

        {/* RIGHT SIDEBAR */}
        <RightSidebar />
      </div>
    </div>
  );
};

export default Page;