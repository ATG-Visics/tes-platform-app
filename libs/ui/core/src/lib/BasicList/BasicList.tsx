import { makeStyles } from '@mui/styles';

const useBasicListStyles = makeStyles(
  {
    root: {
      marginTop: 0,
      marginBottom: 0,
      paddingLeft: '1.5em',
      paddingRight: '1.5em',

      '& ul': {
        listStyle: 'disc',
      },
    },
  },
  { name: 'IuiBasicList' },
);

export function BasicList({ className = '', component = 'ul', ...rest }) {
  const { root } = useBasicListStyles();

  const props = {
    ...rest,
    className: `${root} ${className}`,
  };

  return component === 'ul' ? <ul {...props} /> : <ol {...props} />;
}

export default BasicList;
