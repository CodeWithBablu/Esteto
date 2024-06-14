export const errorHandler = (error: unknown, message: string) => {
  if (error instanceof Error) {
    if (error.message.length > 0) {
      return error.message;
    }
  } else {
    return message;
  }
};
