export type FeedbackType = 'error' | 'success' | 'info' | 'warning';
export type VisualizationType = 'toast' | 'modal';

export interface ISubmissionError {
  status: number;
  originalStatus?: number;
  data?: unknown;
}

export interface FeedbackOptions {
  type: FeedbackType;
  message?: string;
  details?: string[];
  link?: string;
  duration?: number;
  visualizationType?: VisualizationType;
  error?: Error;
  submissionError?: ISubmissionError;
  onClose?: () => void;
}
