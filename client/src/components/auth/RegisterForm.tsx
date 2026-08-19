import { useState } from "react";
import Overplay from "../ui/Overplay";
import Loading from "../ui/Loading";
import Label from "../ui/Label";
import Input from "../ui/Input";
import FieldError from "../ui/FieldError";
import Button from "../ui/Button";
import { Eye, EyeOff } from "lucide-react";
import { useAppDispatch } from "../../redux/store";
import { setAuthView } from "../../redux/slices/authViewSlice";
import { registerSchema, type RegisterData } from "../../schemas/authSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "../../hooks/queries/useAuth";

interface Props {
  onSuccess: (email: string) => void;
}

function RegisterForm({ onSuccess }: Props) {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const registerAuth = useRegister();
  const isLoading = registerAuth.isPending;

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = (data: RegisterData) => {
    if (isLoading) {
      return;
    }

    registerAuth.mutate(data, {
      onSuccess: () => {
        onSuccess(data.email);
        dispatch(setAuthView("otp"));
      },
    });
  };

  return (
    <>
      <div className="w-full px-[15px] md:px-[30px] sm:py-[60px] py-[40px] bg-white">
        <h1 className="relative text-center font-bold uppercase mb-6">
          Đăng ký
        </h1>

        <form className="space-y-[15px]" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-[15px] sm:flex-row flex-col">
            <div className="space-y-[5px] w-full">
              <Label htmlFor="first_name" required>
                Họ
              </Label>
              <Input
                type="text"
                id="first_name"
                placeholder="Nhập họ"
                className="block w-full px-3 py-2 border border-gray-300 focus:border-primary"
                error={errors.first_name?.message}
                {...register("first_name")}
              />

              <FieldError message={errors.first_name?.message} />
            </div>

            <div className="space-y-[5px] w-full">
              <Label htmlFor="last_name" required>
                Tên
              </Label>
              <Input
                type="text"
                id="last_name"
                placeholder="Nhập tên"
                className="block w-full px-3 py-2 border border-gray-300 focus:border-primary"
                error={errors.last_name?.message}
                {...register("last_name")}
              />
              <FieldError message={errors.last_name?.message} />
            </div>
          </div>

          <div className="space-y-[5px] w-full">
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

          <div className="space-y-[5px] w-full">
            <Label htmlFor="phone" required>
              Số điện thoại
            </Label>
            <Input
              type="tel"
              id="phone"
              placeholder="Nhập số điện thoại"
              className="block w-full px-3 py-2 border border-gray-300 focus:border-primary"
              error={errors.phone?.message}
              {...register("phone")}
            />
            <FieldError message={errors.phone?.message} />
          </div>

          <div className="space-y-[5px]">
            <Label htmlFor="password" required>
              Mật khẩu
            </Label>

            <div className="relative">
              <Input
                type={!showPassword ? "password" : "text"}
                id="password"
                placeholder="Nhập mật khẩu"
                {...register("password")}
                error={errors.password?.message}
                className="block w-full px-3 pr-12 py-2 border border-gray-300 focus:border-primary"
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
            Đăng ký
          </Button>

          <p className="flex gap-1.5 justify-center font-medium">
            Bạn đã có tài khoản?
            <Button
              onClick={() => dispatch(setAuthView("login"))}
              type="button"
              className="text-primary font-medium"
            >
              Đăng nhập
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

export default RegisterForm;
