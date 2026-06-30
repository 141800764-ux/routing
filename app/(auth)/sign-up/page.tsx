"use client";
import AuthForms from "@/components/forms/AuthForms";
import React from "react";
import { SignUpSchema } from "@/lib/validations";


const SignUpPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <AuthForms type="sign-up" 
      Submit={(data) => Promise.resolve({ success: true, data }) }
      />
    </div>
  );
};

export default SignUpPage;