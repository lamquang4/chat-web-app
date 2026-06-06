export function validateOtp(otp: string, amount: number = 6): boolean {
  const regex = new RegExp(`^\\d{${amount}}$`);
  return regex.test(otp.trim());
}

export function validateOtpDigit(value: string): boolean {
  return /^\d?$/.test(value);
}
