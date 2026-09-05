import Label from "./ui/Label";
import Input from "./ui/Input";
import Image from "./ui/Image";
import { Camera } from "lucide-react";
import Button from "./ui/Button";
import { useEffect } from "react";
import FieldError from "./ui/FieldError";
import { updateUserSchema, type UpdateUserData } from "../schemas/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useGetAccount, useUpdateUser } from "../hooks/queries/useUsers";

function AccountForm() {
  const { data: account } = useGetAccount();
  const updateUser = useUpdateUser();
  const isLoading = updateUser.isPending;

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserData>({
    resolver: zodResolver(updateUserSchema),
    mode: "onBlur",
    values: {
      first_name: account?.first_name || "",
      last_name: account?.last_name || "",
      phone: account?.phone || "",
      avatar: undefined,
    },
  });

  const avatarFile = watch("avatar");
  const avatarPreview = avatarFile
    ? URL.createObjectURL(avatarFile)
    : (account?.avatar_url ?? "/assets/user.png");

  useEffect(() => {
    return () => {
      if (avatarFile) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarFile, avatarPreview]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValue("avatar", file);
    const isValid = await trigger("avatar");

    if (!isValid) {
      setValue("avatar", undefined);
      return;
    }
  };

  const onSubmit = (data: UpdateUserData) => {
    if (isLoading) {
      return;
    }

    updateUser.mutate(data);
  };

  return (
    <div className="flex flex-col flex-1 gap-6 py-4 overflow-y-auto">
      <h3 className="px-[15px] font-bold">Tài khoản</h3>

      <div className="w-full flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-md max-w-[480px] w-full px-[15px] md:px-[30px] py-[40px]">
          <form className="space-y-[15px]" onSubmit={handleSubmit(onSubmit)}>
            <Label className="relative w-24 h-24 rounded-full bg-bg/70 flex items-center justify-center shrink-0 overflow-hidden hover:bg-bg transition-colors group cursor-pointer mx-auto">
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
                      className="block w-full px-3 py-2 border border-border focus:border-primary"
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
                      className="block w-full px-3 py-2 border border-border focus:border-primary"
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

              <Input
                type="email"
                id="email"
                readOnly
                placeholder="Nhập email"
                className="block w-full px-3 py-2 border border-border focus:border-primary cursor-not-allowed"
                value={account?.email}
              />
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
                    className="block w-full px-3 py-2 border border-border focus:border-primary"
                    error={errors.phone?.message}
                  />
                )}
              />
              <FieldError message={errors.phone?.message} />
            </div>

            <Button
              disabled={isSubmitting || isLoading}
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
