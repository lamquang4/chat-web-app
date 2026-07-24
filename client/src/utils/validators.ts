export function validateOtp(otp: string, amount: number = 6): boolean {
  const regex = new RegExp(`^\\d{${amount}}$`);
  return regex.test(otp.trim());
}

export function validateOtpDigit(value: string): boolean {
  return /^\d?$/.test(value);
}

export function validatePassword(password: string): boolean {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  return regex.test(password);
}

export function validatePhone(phone: string): boolean {
  const regex = /^(03[2-9]|05[689]|07[06-9]|08[0-689]|09[0-46-9])[0-9]{7}$/;
  return regex.test(phone.trim());
}
