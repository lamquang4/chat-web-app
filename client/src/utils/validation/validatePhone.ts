export function validatePhone(phone: string): boolean {
  const regex = /^(03[2-9]|05[689]|07[06-9]|08[0-689]|09[0-46-9])[0-9]{7}$/;
  return regex.test(phone.trim());
}
