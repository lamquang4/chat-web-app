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

interface Props {
  email: string;
}

function OtpForm({ email }: Props) {
  const dispatch = useAppDispatch();

  const [isExpireTimerActive, setIsExpireTimerActive] = useState<boolean>(true);
  const [expireEndTime, setExpireEndTime] = useState<number>(
    () => Date.now() + OTP_EXPIRE_SECONDS * 1000,
  );
  const [timeLeft, setTimeLeft] = useState<number>(OTP_EXPIRE_SECONDS);
  const [isCooldownActive, setIsCooldownActive] = useState<boolean>(true);
  const [cooldownEndTime, setCooldownEndTime] = useState<number>(
    () => Date.now() + OTP_RESEND_COOLDOWN_SECONDS * 1000,
  );
  const [cooldownLeft, setCooldownLeft] = useState<number>(
    OTP_RESEND_COOLDOWN_SECONDS,
  );

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const pendingEmail = email;

  const isLoadingResend = false;
  const isLoadingVerify = false;

  const reset = () => {
    const now = Date.now();
    setExpireEndTime(now + OTP_EXPIRE_SECONDS * 1000);
    setTimeLeft(OTP_EXPIRE_SECONDS);
    setIsExpireTimerActive(true);

    setCooldownEndTime(now + OTP_RESEND_COOLDOWN_SECONDS * 1000);
    setCooldownLeft(OTP_RESEND_COOLDOWN_SECONDS);
    setIsCooldownActive(true);

    setOtp(Array(OTP_LENGTH).fill(""));
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
        setCooldownLeft(0);
        setIsCooldownActive(false);
        return;
      }

      setCooldownLeft(remaining);
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
    setOtp(newOtp);

    inputRefs.current[OTP_LENGTH - 1]?.focus();
  };

  const handleResendOtp = () => {
    const result = sendOtpSchema.safeParse({ email: pendingEmail || "" });

    if (!result.success) {
      toast.error(result.error.issues[0]?.message);
      return;
    }

    const { email } = result.data;
    console.log(email);

    reset();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");

    const result = verifyOtpSchema.safeParse({
      email: pendingEmail,
      otp_code: otpValue,
    });

    if (!result.success) {
      toast.error(result.error.issues[0]?.message);
      return;
    }

    console.log(result.data);

    dispatch(setAuthView("login"));
  };

  return (
    <>
      <div className="w-full px-[15px] md:px-[30px] space-y-4 py-[40px] bg-white">
        <div className="relative flex items-center justify-center w-full">
          <div className="absolute left-0">
            <Button
              onClick={() => dispatch(setAuthView("register"))}
              type="button"
              className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 hover:border-gray-400 transition-all"
            >
              <MoveLeft size={22} />
            </Button>
          </div>

          <h1 className="font-bold text-center uppercase">Xác thực OTP</h1>
        </div>

        <div>
          <p className="text-center text-neutral">
            Vui lòng nhập mã OTP vừa gửi đến
          </p>

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
                          ${digit ? "border-primary text-primary" : "border-gray-300"}
                          focus:border-primary`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <Button
              type="button"
              onClick={handleResendOtp}
              disabled={isCooldownActive || isLoadingResend}
              className={`font-medium ${!isCooldownActive ? "text-primary" : "text-neutral"}`}
            >
              {isCooldownActive
                ? `Gửi lại mã (${formatDuration(cooldownLeft)})`
                : "Gửi lại mã"}
            </Button>

            {timeLeft > 0 ? (
              <span className="text-neutral">
                Mã sẽ hết hạn trong{" "}
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
              isLoadingVerify || !validateOtp(otp.join("")) || timeLeft <= 0
            }
            type="submit"
            className="w-full hover-scale bg-primary text-white font-semibold rounded-sm px-5 py-2.5 text-center"
          >
            Xác nhận
          </Button>
        </form>
      </div>

      {isLoadingVerify && (
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
