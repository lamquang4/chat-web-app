import OtpForm from "./OtpForm";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useAppSelector } from "../../redux/store";

function AuthLayout() {
  const view = useAppSelector((state) => state.auth.view);

  const renderForm = () => {
    if (view === "otp") return <OtpForm />;
    if (view === "register") return <RegisterForm />;
    return <LoginForm />;
  };
  return (
    <section className="bg-[#F1F4F9] w-full">
      <div className="flex justify-center items-center h-screen px-[15px]">
        <div className="bg-white rounded-lg shadow-md max-w-[480px] w-full">
          {renderForm()}
        </div>
      </div>
    </section>
  );
}

export default AuthLayout;
