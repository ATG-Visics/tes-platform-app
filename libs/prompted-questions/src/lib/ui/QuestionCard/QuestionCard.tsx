import { Box, Paper, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { DragHandleButton } from '@atlaskit/pragmatic-drag-and-drop-react-accessibility/drag-handle-button';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import { token } from '@atlaskit/tokens';
import invariant from 'tiny-invariant';
import { createPortal } from 'react-dom';
import * as colors from '@tes/ui/colors';

interface IProps {
  type: string;
  slug: string;
  icon: ReactNode;
  drawerOpen: boolean;
}

export type QuestionCardProps = IProps;

type State =
  | {
      type: 'idle';
    }
  | {
      type: 'preview';
      container: HTMLElement;
    };

export function QuestionCard(props: IProps) {
  const { type, slug, icon, drawerOpen } = props;
  const ref = useRef(null);
  const [state, setState] = useState<State>({ type: 'idle' });
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const element = ref.current;
    invariant(element);

    return combine(
      draggable({
        element: element,
        onGenerateDragPreview({ nativeSetDragImage }) {
          // We need to make sure that the element not obfuscated by the sticky header
          setCustomNativeDragPreview({
            getOffset: pointerOutsideOfPreview({
              x: token('space.250', '0'),
              y: token('space.250', '0'),
            }),
            render({ container }) {
              setState({ type: 'preview', container });
              return () => setState({ type: 'idle' });
            },
            nativeSetDragImage,
          });
        },
      }),
    );
  }, []);

  return (
    <>
      {drawerOpen ? (
        <Tooltip title={type} placement="left">
          <Paper
            sx={{
              display: 'flex',
              width: '100%',
              cursor: 'grab',
            }}
            ref={ref}
            data-type={slug}
          >
            <DragHandleButton label="Drag me" />

            <Box
              sx={{
                p: 1,
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                alignItems: 'center',

                '& svg': {
                  width: '100%',
                  maxWidth: 32,
                  height: '100%',
                  maxHeight: 32,
                  color: colors.accent1['700'],
                },
              }}
            >
              {icon}
              <Typography variant="body2" sx={{ whiteSpace: 'wrap' }}>
                {type}
              </Typography>
            </Box>
          </Paper>
        </Tooltip>
      ) : (
        <Tooltip title={type} placement="left">
          <Paper
            ref={ref}
            data-type={slug}
            sx={{
              display: 'flex',
              flexDirection: 'column',

              '& button': {
                width: '100%',
              },

              '& svg': {
                width: '100%',
                height: '100%',
                color: colors.accent1['700'],
              },
            }}
          >
            <DragHandleButton label="Drag me" />

            <Box
              sx={{
                p: 1,
                width: isSmallScreen ? 40 : 48,
                height: isSmallScreen ? 40 : 48,
              }}
            >
              {icon}
            </Box>
          </Paper>
        </Tooltip>
      )}
      {state.type === 'preview'
        ? createPortal(
            <Paper
              sx={{
                display: 'flex',
                width: '100%',
                cursor: 'grab',
              }}
              ref={ref}
              data-type={slug}
            >
              <DragHandleButton label="Drag me" />

              <Box
                sx={{
                  p: 1,
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 2,
                  alignItems: 'center',

                  '& svg': {
                    width: '100%',
                    maxWidth: 32,
                    height: '100%',
                    maxHeight: 32,
                    color: colors.accent1['700'],
                  },
                }}
              >
                {icon}
                <Typography variant="body2" sx={{ whiteSpace: 'wrap' }}>
                  {type}
                </Typography>
              </Box>
            </Paper>,
            state.container,
          )
        : null}
    </>
  );
}
