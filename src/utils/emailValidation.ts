export const checkEmailValidation = (email: string) => {
  const pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

  return pattern.test(email);
};
