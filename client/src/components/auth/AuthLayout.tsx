import OtpForm from "./OtpForm";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useAppSelector } from "../../redux/store";
import { useState } from "react";

function AuthLayout() {
  const view = useAppSelector((state) => state.authView.view);
  const [pendingEmail, setPendingEmail] = useState<string>("");

  const renderForm = () => {
    if (view === "otp") {
      return <OtpForm email={pendingEmail} />;
    }
    if (view === "register") {
      return <RegisterForm onSuccess={setPendingEmail} />;
    }
    return <LoginForm />;
  };
  return (
    <section className="bg-[#F1F4F9] w-full">
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white rounded-lg shadow-md max-w-[480px] w-full">
          {renderForm()}
        </div>
      </div>
    </section>
  );
}

export default AuthLayout;
