import { Button } from '@mui/material';
import { MouseEventHandler } from 'react';

import { Icon } from '../Icon';

interface IProps {
  onClickPrevious?: MouseEventHandler<HTMLButtonElement> | null;
  onClickNext?: MouseEventHandler<HTMLButtonElement> | null;
}

export type PageNavigationProps = IProps;

/**
 * Page Navigation based on navigation as present in
 * https://app.zeplin.io/project/5e53e4e05fd9de7778b827f1/screen/5e53e5e7ae3c706619203476
 * @param props
 * @constructor
 */
export function PageNavigation(props: IProps) {
  const { onClickNext, onClickPrevious } = props;

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button
        startIcon={<Icon icon="chevron-left" />}
        onClick={onClickPrevious !== null ? onClickPrevious : undefined}
        disabled={onClickPrevious === null}
      >
        Vorige
      </Button>
      <Button
        endIcon={<Icon icon="chevron-right" />}
        onClick={onClickNext !== null ? onClickNext : undefined}
        disabled={onClickNext === null}
      >
        Volgende
      </Button>
    </div>
  );
}

PageNavigation.defaultProps = {
  onClickNext: null,
  onClickPrevious: null,
};
