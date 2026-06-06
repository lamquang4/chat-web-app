import { useState } from "react";

type Rules<T> = {
  [K in keyof T]?: (value: string, allValues: T) => string;
};

export function useFormValidation<T extends Record<string, string>>(
  data: T,
  rules: Rules<T>,
) {
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const validateField = (name: keyof T, value: string): string => {
    return rules[name]?.(value, data) ?? "";
  };

  const handleBlur = (name: keyof T, value: string) => {
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const clearError = (name: keyof T) => {
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateAll = (): boolean => {
    const newErrors = {} as Record<keyof T, string>;
    let hasError = false;

    (Object.keys(rules) as Array<keyof T>).forEach((key) => {
      const value = data[key] ?? "";
      const error = rules[key]?.(value as string, data) ?? "";
      newErrors[key] = error;
      if (error) hasError = true;
    });

    setErrors(newErrors);
    return !hasError;
  };

  const resetErrors = () => setErrors({});

  return { errors, handleBlur, clearError, validateAll, resetErrors };
}
