import type { ValidationError } from 'joi';
import { UserError } from '@/modules/graphql';

export const transformValidationError = (
  error: ValidationError,
): UserError[] => {
  const { details } = error;
  const errors: UserError[] = [];

  for (const data of details) {
    const { message, context } = data;
    const field = context?.label;
    errors.push({
      field,
      message,
    });
  }
  return errors;
};
