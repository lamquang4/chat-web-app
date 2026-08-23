import { useState, useRef, useEffect } from "react";
import Button from "../ui/Button";
import Loading from "../ui/Loading";
import Overplay from "../ui/Overplay";
import Input from "../ui/Input";
import toast from "react-hot-toast";
import {
  OTP_EXPIRE_SECONDS,
  OTP_RESEND_COOLDOWN_SECONDS,
  OTP_LENGTH,
} from "../../constants/limit";
import { useAppDispatch } from "../../redux/store";
import { setAuthView } from "../../redux/slices/authViewSlice";
import { MoveLeft } from "lucide-react";
import { validateOtp, validateOtpDigit } from "../../utils/validators";
import { sendOtpSchema, verifyOtpSchema } from "../../schemas/authSchema";
import { formatDuration } from "../../utils/formatters";
import {
  useResendRegisterOtp,
  useVerifyRegisterOtp,
} from "../../hooks/queries/useAuth";

interface Props {
  email: string;
}

function OtpForm({ email }: Props) {
  const dispatch = useAppDispatch();

  // Đếm ngược hết hạn OTP
  const [isExpireTimerActive, setIsExpireTimerActive] = useState<boolean>(true);
  const [expireEndTime, setExpireEndTime] = useState<number>(
    () => Date.now() + OTP_EXPIRE_SECONDS * 1000,
  );
  const [timeLeft, setTimeLeft] = useState<number>(OTP_EXPIRE_SECONDS);

  // Đếm ngược cooldown gửi lại OTP
  const [isCooldownActive, setIsCooldownActive] = useState<boolean>(true);
  const [cooldownEndTime, setCooldownEndTime] = useState<number>(
    () => Date.now() + OTP_RESEND_COOLDOWN_SECONDS * 1000,
  );
  // THÊM MỚI: State lưu thời gian cooldown để hiển thị ra UI
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState<number>(
    OTP_RESEND_COOLDOWN_SECONDS,
  );

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const pendingEmail = email;

  const verifyRegisterOtp = useVerifyRegisterOtp();
  const isLoadingRegisterVerify = verifyRegisterOtp.isPending;
  const resendRegisterOtp = useResendRegisterOtp();
  const isLoadingResendRegisterOtp = resendRegisterOtp.isPending;

  const reset = () => {
    const now = Date.now();

    // Reset thời gian hết hạn OTP
    setExpireEndTime(now + OTP_EXPIRE_SECONDS * 1000);
    setTimeLeft(OTP_EXPIRE_SECONDS);
    setIsExpireTimerActive(true);

    // Reset thời gian cooldown gửi lại
    setCooldownEndTime(now + OTP_RESEND_COOLDOWN_SECONDS * 1000);
    setCooldownTimeLeft(OTP_RESEND_COOLDOWN_SECONDS); // CẬP NHẬT
    setIsCooldownActive(true);

    setOtp(Array(OTP_LENGTH).fill(""));
    inputRefs.current[0]?.focus(); // Tự động focus lại ô đầu tiên
  };

  // Đếm ngược hết hạn OTP
  useEffect(() => {
    if (!isExpireTimerActive) return;

    const timer = setInterval(() => {
      const remaining = Math.round((expireEndTime - Date.now()) / 1000);

      if (remaining <= 0) {
        clearInterval(timer);
        setTimeLeft(0);
        setIsExpireTimerActive(false);
        return;
      }

      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [isExpireTimerActive, expireEndTime]);

  // Đếm ngược cooldown gửi lại otp
  useEffect(() => {
    if (!isCooldownActive) return;

    const timer = setInterval(() => {
      const remaining = Math.round((cooldownEndTime - Date.now()) / 1000);

      if (remaining <= 0) {
        clearInterval(timer);
        setIsCooldownActive(false);
        setCooldownTimeLeft(0); // CẬP NHẬT
        return;
      }

      setCooldownTimeLeft(remaining); // CẬP NHẬT
    }, 1000);

    return () => clearInterval(timer);
  }, [isCooldownActive, cooldownEndTime]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!validateOtpDigit(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!validateOtp(pasted)) return;

    const newOtp = pasted.split("");

    while (newOtp.length < OTP_LENGTH) {
      newOtp.push("");
    }
    setOtp(newOtp);

    // Focus vào ô cuối cùng được paste
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleResendOtp = () => {
    const result = sendOtpSchema.safeParse({ email: pendingEmail || "" });

    if (isLoadingResendRegisterOtp) {
      return;
    }

    if (!result.success) {
      toast.error(result.error.issues[0]?.message);
      return;
    }

    resendRegisterOtp.mutate(
      {
        email: pendingEmail,
      },
      {
        onSuccess: () => {
          reset();
        },
        onError: () => {
          dispatch(setAuthView("register"));
        },
      },
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoadingRegisterVerify) {
      return;
    }

    const otpValue = otp.join("");

    const result = verifyOtpSchema.safeParse({
      email: pendingEmail,
      otp_code: otpValue,
    });

    if (!result.success) {
      toast.error(result.error.issues[0]?.message);
      return;
    }

    verifyRegisterOtp.mutate(
      {
        email: pendingEmail,
        otp_code: otpValue,
      },
      {
        onSuccess: () => {
          dispatch(setAuthView("login"));
        },
      },
    );
  };

  return (
    <>
      <div className="w-full px-[15px] md:px-[30px] space-y-4 py-[40px] bg-white">
        <div className="relative flex items-center justify-center w-full">
          <div className="absolute left-0">
            <Button
              onClick={() => dispatch(setAuthView("register"))}
              type="button"
              className="w-10 h-10 rounded-full flex items-center justify-center border border-neutral-300 hover:border-neutral-400 transition-all"
            >
              <MoveLeft size={22} />
            </Button>
          </div>

          <h1 className="font-bold text-center uppercase">Xác thực OTP</h1>
        </div>

        <div>
          <p className="text-center">Vui lòng nhập mã OTP vừa gửi đến</p>

          <p className="font-semibold text-primary break-all text-center">
            {pendingEmail}
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="flex justify-center gap-[10px]">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el: HTMLInputElement | null) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                value={otp[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-[45px] h-[45px] text-center text-[1rem] font-semibold border rounded-md transition-colors
                          ${digit ? "border-primary text-primary" : "border-neutral-300"}
                          focus:border-primary`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-[14px]">
            <Button
              type="button"
              onClick={handleResendOtp}
              disabled={isCooldownActive || isLoadingResendRegisterOtp}
              className={`font-medium transition-all ${
                !isCooldownActive
                  ? "text-primary cursor-pointer"
                  : "text-neutral cursor-not-allowed"
              }`}
            >
              {isCooldownActive
                ? `Gửi lại mã (${cooldownTimeLeft}s)`
                : "Gửi lại mã"}
            </Button>

            {timeLeft > 0 ? (
              <span>
                Hết hạn sau:{" "}
                <span className="text-danger font-medium">
                  {formatDuration(timeLeft)}
                </span>
              </span>
            ) : (
              <span className="text-danger font-medium">Mã OTP đã hết hạn</span>
            )}
          </div>

          <Button
            disabled={
              isLoadingRegisterVerify ||
              !validateOtp(otp.join("")) ||
              timeLeft <= 0
            }
            type="submit"
            className="w-full bg-primary text-white font-semibold rounded-sm px-5 py-2.5 text-center"
          >
            Xác nhận
          </Button>
        </form>
      </div>

      {isLoadingRegisterVerify && (
        <Overplay>
          <Loading height={0} size={55} color="white" thickness={8} />
          <h4 className="text-white font-bold">
            Vui lòng chờ trong giây lát ...
          </h4>
        </Overplay>
      )}
    </>
  );
}

export default OtpForm;
