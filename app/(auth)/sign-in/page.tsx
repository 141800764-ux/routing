import AuthForms from "@/components/forms/AuthForms";

const SignInPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <AuthForms type="sign-in" />
    </div>
  );
};

export default SignInPage;