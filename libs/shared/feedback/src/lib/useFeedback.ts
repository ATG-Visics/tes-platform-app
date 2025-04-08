import { FeedbackOptions } from './feedback-types';
import { useSnackbar } from 'notistack';
import { showModal } from './Visualizations';
import { parseSubmissionError } from './feedback-utils';

export function useFeedback() {
  const { enqueueSnackbar } = useSnackbar();

  const showFeedback = (options: FeedbackOptions) => {
    const {
      message,
      details,
      type,
      duration = 3000,
      visualizationType,
      error,
      submissionError,
      onClose,
    } = options;

    let parsedError;

    if (submissionError) {
      parsedError = parseSubmissionError(submissionError);
    }

    if (error) {
      console.error('Error:', error);
    }

    if (parsedError) {
      console.error('Error: ', parsedError.code, parsedError.devMessages);
    }

    if (visualizationType === 'modal') {
      showModal({
        title: type === 'error' ? parsedError?.title || 'Error' : type,
        subtitle: message || '',
        type: type,
        details: details || parsedError?.userMessages || [],
        onClose: onClose || null,
      });
    } else {
      enqueueSnackbar(message, {
        variant: type,
        autoHideDuration: duration,
      });
    }
  };

  return { showFeedback };
}
