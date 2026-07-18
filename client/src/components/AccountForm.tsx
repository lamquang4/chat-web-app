import Label from "./ui/Label";
import Input from "./ui/Input";
import { mockAccount } from "../mocks/mockAccount";
import Image from "./ui/Image";
import { Camera } from "lucide-react";
import Button from "./ui/Button";
import { useEffect, useState } from "react";
import FieldError from "./ui/FieldError";
import { updateUserSchema, type UpdateUserData } from "../schemas/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

function AccountForm() {
  const account = mockAccount;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserData>({
    resolver: zodResolver(updateUserSchema),
    mode: "onBlur",
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
    },
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    account.avatar_url ?? null,
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    if (!account) return;
    reset({
      first_name: account.first_name ?? "",
      last_name: account.last_name ?? "",
      email: account.email ?? "",
      phone: account.phone ?? "",
    });
  }, [account, reset]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const onSubmit = (data: UpdateUserData) => {
    console.log({ ...data, avatarFile });
  };

  return (
    <div className="space-y-6 py-4 w-full">
      <h3 className="px-[15px]">Tài khoản</h3>

      <div className="w-full flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-md max-w-[480px] w-full px-[15px] md:px-[30px] sm:py-[60px] py-[40px]">
          <form className="space-y-[15px]" onSubmit={handleSubmit(onSubmit)}>
            <Label className="relative w-25 h-25 rounded-full bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden hover:bg-gray-200 transition-colors group cursor-pointer mx-auto">
              <Image
                src={avatarPreview ?? "/assets/user.png"}
                alt="Ảnh đại diện"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 rounded-full transition-opacity flex items-center justify-center">
                <Camera size={24} className="text-white" />
              </div>
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </Label>

            <div className="flex gap-[15px] sm:flex-row flex-col">
              <div className="space-y-[5px] w-full">
                <Label htmlFor="first_name" required>
                  Họ
                </Label>
                <Controller
                  name="first_name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      id="first_name"
                      placeholder="Nhập họ"
                      className="block w-full px-3 py-2 border border-gray-300 focus:border-primary"
                      error={errors.first_name?.message}
                    />
                  )}
                />
                <FieldError message={errors.first_name?.message} />
              </div>

              <div className="space-y-[5px] w-full">
                <Label htmlFor="last_name" required>
                  Tên
                </Label>
                <Controller
                  name="last_name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      id="last_name"
                      placeholder="Nhập tên"
                      className="block w-full px-3 py-2 border border-gray-300 focus:border-primary"
                      error={errors.last_name?.message}
                    />
                  )}
                />
                <FieldError message={errors.last_name?.message} />
              </div>
            </div>

            <div className="space-y-[5px] w-full">
              <Label htmlFor="email" required>
                Email
              </Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    id="email"
                    placeholder="Nhập email"
                    className="block w-full px-3 py-2 border border-gray-300 focus:border-primary"
                    error={errors.email?.message}
                  />
                )}
              />
              <FieldError message={errors.email?.message} />
            </div>

            <div className="space-y-[5px] w-full">
              <Label htmlFor="phone" required>
                Số điện thoại
              </Label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="tel"
                    id="phone"
                    placeholder="Nhập số điện thoại"
                    className="block w-full px-3 py-2 border border-gray-300 focus:border-primary"
                    error={errors.phone?.message}
                  />
                )}
              />
              <FieldError message={errors.phone?.message} />
            </div>

            <Button
              disabled={isSubmitting}
              type="submit"
              className="w-full hover-scale bg-primary text-white font-semibold rounded-sm px-5 py-2.5 text-center mt-6"
            >
              Cập nhật
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AccountForm;
