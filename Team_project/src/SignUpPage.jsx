import React from "react";
import Signup from "../component/SignUp"; // Make sure the path is correct

const SignupPage = () => {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <Signup />
      </div>
    </div>
  );
};

export default SignupPage;
