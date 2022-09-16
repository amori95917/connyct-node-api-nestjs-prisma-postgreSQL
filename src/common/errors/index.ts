export {
  EmailConflict,
  UserIdIsRequired,
  UserNotFound,
  InvalidToken,
} from './inputs.error';

export const customError = (
  message: string,
  codeName: string,
  statusCode: number,
) => {
  return {
    errors: [{ message: message, code: codeName, statusCode: statusCode }],
  };
};
