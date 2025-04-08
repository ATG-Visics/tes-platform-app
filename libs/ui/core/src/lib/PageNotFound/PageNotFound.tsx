import { Container, Paper, Toolbar, Typography } from '@mui/material';

interface IProps {
  description?: string;
}

export type PageNotFoundProps = IProps;

export function PageNotFound(props: IProps) {
  const { description } = props;

  return (
    <>
      <Toolbar sx={{ mb: [3, 4] }} />

      <Container>
        <Paper sx={{ p: 4 }}>
          <Typography component="h1" variant="h4">
            Page not found
          </Typography>
          {description && (
            <Typography component="p" variant="body1">
              {description}
            </Typography>
          )}
        </Paper>
      </Container>
    </>
  );
}
