import { useState } from "react";
import Overplay from "../ui/Overplay";
import Loading from "../ui/Loading";
import Label from "../ui/Label";
import Input from "../ui/Input";
import FieldError from "../ui/FieldError";
import Button from "../ui/Button";
import { Eye, EyeOff } from "lucide-react";
import { useAppDispatch } from "../../redux/store";
import { setAuthView } from "../../redux/slices/authSlice";
import { loginSchema, type LoginData } from "../../schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

function LoginForm() {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const isLoading = false;

  const onSubmit = (data: LoginData) => {
    console.log(data);

    reset();
  };

  return (
    <>
      <div className="w-full px-[15px] md:px-[30px] sm:py-[60px] py-[40px] bg-white">
        <h1 className="relative text-center font-bold uppercase mb-6">
          Đăng nhập
        </h1>

        <form className="space-y-[15px]" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-[5px]">
            <Label htmlFor="email" required>
              Email
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="Nhập email"
              className="block w-full px-3 py-2 border border-gray-300 focus:border-primary"
              error={errors.email?.message}
              {...register("email")}
            />
            <FieldError message={errors.email?.message} />
          </div>

          <div>
            <Label htmlFor="password" required>
              Mật khẩu
            </Label>

            <div className="relative">
              <Input
                type={!showPassword ? "password" : "text"}
                id="password"
                placeholder="Nhập mật khẩu"
                className="block w-full px-3 pr-12 py-2 border border-gray-300 focus:border-primary"
                {...register("password")}
                error={errors.password?.message}
              />

              <Button
                type="button"
                className="absolute hover-scale right-3 top-1/2 -translate-y-1/2 text-neutral"
                onClick={toggleShowPassword}
              >
                {!showPassword ? <Eye size={22} /> : <EyeOff size={22} />}
              </Button>
            </div>

            <FieldError message={errors.password?.message} />
          </div>

          <Button
            disabled={isLoading}
            type="submit"
            className="w-full hover-scale bg-primary text-white font-semibold rounded-sm px-5 py-2.5 text-center mt-6"
          >
            Đăng nhập
          </Button>

          <p className="flex gap-1.5 justify-center font-medium">
            Bạn chưa có tài khoản ư?
            <Button
              onClick={() => dispatch(setAuthView("register"))}
              type="button"
              className="text-primary font-medium"
            >
              Đăng ký
            </Button>
          </p>
        </form>
      </div>

      {isLoading && (
        <Overplay>
          <Loading height={0} size={55} color="white" thickness={8} />
          <h4 className="text-white">Vui lòng chờ trong giây lát ...</h4>
        </Overplay>
      )}
    </>
  );
}

export default LoginForm;
