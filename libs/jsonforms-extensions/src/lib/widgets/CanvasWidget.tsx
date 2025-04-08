import { CellProps, WithClassname } from '@jsonforms/core';
import SignatureCanvas from 'react-signature-canvas';
import { Box, Button, Tooltip } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import ReactSignatureCanvas from 'react-signature-canvas';
import { Clear as ClearIcon } from '@mui/icons-material';

// Using a makeStyles because the canvas widget can't handle sx of material Style
const useStyles = makeStyles(() => ({
  canvas: {
    width: '100%',
    border: '1px solid #000',
    height: '100%',
    minHeight: '500px',
  },
  img: {
    height: '500px',
  },
}));

export function CanvasWidget(props: CellProps & WithClassname) {
  const classes = useStyles();
  const { data, path, handleChange, enabled } = props;
  const [canvas, setCanvas] = useState<ReactSignatureCanvas>();
  const [canvasData, setCanvasData] = useState<string | null>();

  const onClear = useCallback(() => {
    if (!canvas) {
      return;
    }

    canvas.clear();
    handleChange(path, '');
  }, [canvas, handleChange, path]);

  const onChange = useCallback(() => {
    if (!canvas) {
      return;
    }
    setCanvasData(canvas.toDataURL('image/png'));
  }, [canvas]);

  useEffect(() => {
    if (!canvasData) {
      return;
    }

    handleChange(path, canvasData);
  }, [handleChange, canvasData, path]);

  useEffect(() => {
    if (!data) {
      return;
    }

    if (!canvas) {
      return;
    }

    canvas.fromDataURL(data);
  }, [canvas, data]);

  return (
    <Box>
      {enabled ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            sx={{
              height: 'fit-content',
              width: 'fit-content',
              alignSelf: 'flex-end',
            }}
            variant="contained"
            onClick={onClear}
          >
            <ClearIcon sx={{ marginRight: 1 }} />
            Clear Drawing
          </Button>
          <SignatureCanvas
            onEnd={onChange}
            canvasProps={{
              className: classes.canvas,
            }}
            clearOnResize
            ref={(ref: ReactSignatureCanvas) => setCanvas(ref)}
          />
        </Box>
      ) : (
        <Tooltip
          title="Click the edit button to edit the drawing"
          placement="top"
        >
          <Box sx={{ height: 500, margin: '0 auto' }}>
            {data && (
              <img className={classes.img} src={data} alt="draw-the-room" />
            )}
          </Box>
        </Tooltip>
      )}
    </Box>
  );
}
