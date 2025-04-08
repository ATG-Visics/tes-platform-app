import logoUrl from './logo-white.svg';
import { makeStyles } from '@mui/styles';

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <div className={className}>
      <img src={logoUrl} alt="Nationale Milieudatabase" />
    </div>
  );
}

const useStyles = makeStyles(
  ({ spacing, breakpoints }) => ({
    logoLink: {
      outline: 'none',
    },
    logo: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: spacing(0.5),

      [breakpoints.up('sm')]: {
        gap: 11,
        flexDirection: 'row',

        marginBottom: -4,
      },

      '& > :nth-child(1)': {
        width: 87,
        [breakpoints.up('sm')]: {
          width: 129,
        },
      },

      '& > :nth-child(2)': {
        width: 188,
        [breakpoints.up('sm')]: {
          width: 260,
        },
      },
    },
  }),
  { name: 'nmdUiPageHeaderLogo' },
);

export function HeaderLogo({ href }: { href: string }) {
  const classes = useStyles();

  return (
    <a
      title="Stichting Nationale Milieudatabase (Stichting NMD)"
      className={classes.logoLink}
      href={href}
    >
      <Logo className={classes.logo} />
    </a>
  );
}
