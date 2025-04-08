import { makePalette } from 'material-color-tool';

export type Weight =
  | '50'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900';

export type ColorWeightRecord = Record<Weight, string>;

const indexToWeight: { [key: string]: Weight } = {
  0: '50',
  1: '100',
  2: '200',
  3: '300',
  4: '400',
  5: '500',
  6: '600',
  7: '700',
  8: '800',
  9: '900',
};

export function createColorWeights(color: string) {
  const colorList = makePalette(color);

  return colorList.reduce((acc, color, index) => {
    acc[indexToWeight[index]] = color;
    return acc;
  }, {} as ColorWeightRecord);
}
