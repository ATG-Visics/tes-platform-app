import { ISubmissionError } from './feedback-types';

export function parseSubmissionError(submissionError: ISubmissionError) {
  const userMessages: string[] = [];
  const devMessages: string[] = [];
  const title = 'Something went wrong';

  const data = submissionError.data as { [key: string]: string[] };

  if (
    submissionError.status === 500 ||
    submissionError.originalStatus === 500
  ) {
    return {
      code: submissionError.status,
      devMessages: submissionError.data,
      title: 'Something went wrong, please try again or contact support.',
    };
  }

  if (submissionError.status === 403) {
    return {
      code: submissionError.status,
      devMessages: submissionError.data,
      title: "You don't have permission for this action.",
    };
  }

  if (data && typeof data === 'object') {
    for (const field in data) {
      if (Object.prototype.hasOwnProperty.call(data, field)) {
        const messages = data[field];

        if (Array.isArray(messages)) {
          messages.forEach((message) => {
            if (typeof message !== 'string') {
              devMessages.push(message);
              return;
            }
            const userMessage =
              (message?.startsWith('“') || message?.startsWith("'")) &&
              message?.length > 200
                ? `${field}: ${message?.replace(
                    /['“][^"]*['”]/g,
                    'supplied value',
                  )}`
                : `${field}: has an error`;

            userMessages.push(userMessage);

            devMessages.push(`${field}: ${message}`);
          });
        }
      }
    }
  }

  return {
    code: submissionError.status,
    userMessages: userMessages,
    devMessages: devMessages,
    title,
  };
}
