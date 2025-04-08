import { ExpandMore, Logout, Loop } from '@mui/icons-material';
import {
  Avatar,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import { MouseEvent, useCallback, useState } from 'react';

interface IProps {
  name: string;
  avatarUrl?: string;
  account?: string;
  handleSignOut: () => void;
  handleSwitchAccount: () => void;
}

export type UserAccountProps = IProps;

export function UserAccount(props: IProps) {
  const { name, avatarUrl, account, handleSignOut, handleSwitchAccount } =
    props;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const handleSignOutAndClose = useCallback(() => {
    handleSignOut();
    handleClose();
  }, [handleSignOut, handleClose]);

  const handleSwitchAccountAndClose = useCallback(() => {
    handleSwitchAccount();
    handleClose();
  }, [handleSwitchAccount, handleClose]);

  return (
    <>
      <ListItem component="div" disablePadding>
        <ListItemButton
          sx={{ height: 'auto', minHeight: 56 }}
          onClick={handleClick}
        >
          <ListItemIcon>
            <Avatar src={avatarUrl} alt={name} sx={{ width: 24, height: 24 }} />
          </ListItemIcon>
          <ListItemText
            primary={name}
            secondary={account}
            primaryTypographyProps={{
              color: 'primary',
              fontWeight: 'bold',
              variant: 'body2',
            }}
          />

          <ExpandMore />
        </ListItemButton>
      </ListItem>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            width: 250,
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/*TODO Fix so this URL is set in the evn variable*/}
        <MenuItem
          component="a"
          href="https://auth.ihportal.com/"
          onClick={handleClose}
          target="_blank"
        >
          <ListItemIcon>
            <Avatar sx={{ width: 24, height: 24 }} />
          </ListItemIcon>
          Manage account
        </MenuItem>
        <MenuItem onClick={handleSwitchAccountAndClose}>
          <ListItemIcon>
            <Loop />
          </ListItemIcon>
          Switch account
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleSignOutAndClose}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Log out
        </MenuItem>
      </Menu>
    </>
  );
}
