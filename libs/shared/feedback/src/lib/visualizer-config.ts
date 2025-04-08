import { VisualizationType } from './feedback-types';

let globalVisualizationType: VisualizationType = 'toast';

export function setVisualizer(newVisualizationType: VisualizationType) {
  globalVisualizationType = newVisualizationType;
}

export function getVisualizer(): VisualizationType {
  return globalVisualizationType;
}
