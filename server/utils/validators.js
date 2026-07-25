function validateOtp(otp, amount = 6) {
  const regex = new RegExp(`^\\d{${amount}}$`);
  return regex.test(otp.trim());
}

function validatePassword(password) {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}

function validatePhone(phone) {
  const regex = /^(03[2-9]|05[689]|07[06-9]|08[0-689]|09[0-46-9])[0-9]{7}$/;
  return regex.test(phone.trim());
}

module.exports = { validateOtp, validatePassword, validatePhone };
