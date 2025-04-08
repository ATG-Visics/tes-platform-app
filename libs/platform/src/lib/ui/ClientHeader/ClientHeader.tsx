import { Box, Card, Link, Typography } from '@mui/material';
import { Email as EmailIcon, Phone as PhoneIcon } from '@mui/icons-material';
import { Button } from '@tes/ui/core';

interface IProps {
  client: string;
  street1: string;
  street2: string;
  postalCode: string;
  city: string;
  country: string;
  telephone: string;
  email: string;
  contactPerson: string;
  handleSendInvite: () => void;
}

export type ClientHeaderProps = IProps;

export function ClientHeader(props: IProps) {
  const {
    client,
    street1,
    street2,
    postalCode,
    city,
    country,
    telephone,
    email,
    contactPerson,
    handleSendInvite,
  } = props;
  return (
    <Card sx={{ p: 3 }}>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant={'subtitle1'} sx={{ flexGrow: 1 }}>
          Client: {client}
        </Typography>

        <Button variant="contained" onClick={handleSendInvite}>
          Send Account Invite
        </Button>
      </Box>
      <Box sx={{ display: 'flex', gap: 12 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant={'subtitle2'} sx={{ fontWeight: 700, mb: 1 }}>
            {client}
          </Typography>
          <Typography
            variant={'body2'}
            sx={{ color: 'rgb(0 0 0 / 60%)', lineHeight: 1.5 }}
          >
            {street1}
          </Typography>
          <Typography
            variant={'body2'}
            sx={{ color: 'rgb(0 0 0 / 60%)', lineHeight: 1.5 }}
          >
            {street2}
          </Typography>
          <Typography
            variant={'body2'}
            sx={{ color: 'rgb(0 0 0 / 60%)', lineHeight: 1.5 }}
          >
            {postalCode} {city}
          </Typography>
          <Typography
            variant={'body2'}
            sx={{ color: 'rgb(0 0 0 / 60%)', lineHeight: 1.5 }}
          >
            {country}
          </Typography>
        </Box>
        <Box
          component={'div'}
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant={'subtitle2'} sx={{ fontWeight: 700, mb: 1 }}>
            Contact information
          </Typography>
          <Typography
            variant={'body2'}
            sx={{ color: 'rgb(0 0 0 / 60%)', lineHeight: 1.5 }}
          >
            {contactPerson}
          </Typography>
          {telephone && (
            <Link
              href={'tel:' + telephone}
              sx={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                py: 1,
                width: 'fit-content',
                '&:hover, &:focus': {
                  textDecoration: 'underline',
                },
              }}
            >
              <PhoneIcon sx={{ fontSize: '1rem' }} />
              <Box
                component={'span'}
                sx={{
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  lineHeight: 1.5,
                }}
              >
                {telephone}
              </Box>
            </Link>
          )}
          {email && (
            <Link
              href={'mailto:' + email}
              sx={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                py: 1,
                width: 'fit-content',
                '&:hover, &:focus': {
                  textDecoration: 'underline',
                },
              }}
            >
              <EmailIcon sx={{ fontSize: '1rem' }} />
              <Box
                component={'span'}
                sx={{
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  lineHeight: 1.5,
                }}
              >
                {email}
              </Box>
            </Link>
          )}
        </Box>
      </Box>
    </Card>
  );
}
