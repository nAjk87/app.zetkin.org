import NextLink from 'next/link';
import { useNumericRouteParams } from 'core/hooks';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';
import {
  Architecture,
  Explore,
  Groups,
  KeyboardDoubleArrowLeftOutlined,
  KeyboardDoubleArrowRightOutlined,
  Logout,
  Map,
} from '@mui/icons-material/';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  IconProps,
  List,
  ListItemButton,
  ListItemIcon,
  Typography,
} from '@mui/material';
import { cloneElement, useState } from 'react';

import makeStyles from '@mui/styles/makeStyles';
import messageIds from './l10n/messageIds';
import OrganizationsDataModel from 'features/organizations/models/OrganizationsDataModel';
import useCurrentUser from 'features/users/hooks/useCurrentUser';
import { useMessages } from 'core/i18n';
import useModel from 'core/useModel';
import ZUIAvatar from './ZUIAvatar';
import ZUIEllipsisMenu from './ZUIEllipsisMenu';
import ZUIFuture from './ZUIFuture';

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  drawer: {
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.enteringScreen,
      easing: theme.transitions.easing.sharp,
    }),
    whiteSpace: 'nowrap',
    width: drawerWidth,
  },
  drawerPaper: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.enteringScreen,
      easing: theme.transitions.easing.sharp,
    }),
    width: drawerWidth,
  },
  toggleDrawerPaper: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.sharp,
    }),
    width: `calc(${theme.spacing(7)} + 1px)`,
  },
}));

const ZUIOrganizeSidebar = (): JSX.Element => {
  const [hover, setHover] = useState(false);
  const messages = useMessages(messageIds);
  const classes = useStyles();
  const theme = useTheme();
  const user = useCurrentUser();
  const router = useRouter();
  const { orgId } = useNumericRouteParams();
  const key = orgId ? router.pathname.split('[orgId]')[1] : 'organize';

  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };

  const model: OrganizationsDataModel = useModel(
    (env) => new OrganizationsDataModel(env)
  );

  const menuItemsMap = [
    { icon: <Groups />, name: 'people' },
    { icon: <Architecture />, name: 'projects' },
    { icon: <Explore />, name: 'journeys' },
    { icon: <Map />, name: 'areas' },
  ] as const;

  function logOut() {
    router.push(`/logout`);
  }

  return (
    <Box data-testid="organize-sidebar">
      <Drawer
        classes={{
          paper:
            classes.drawerPaper +
            (!open ? ` ${classes.toggleDrawerPaper}` : ''),
        }}
        className={
          classes.drawer + (!open ? ` ${classes.toggleDrawerPaper}` : '')
        }
        onMouseLeave={() => {
          setHover(false);
        }}
        onMouseOver={() => {
          setHover(true);
        }}
        open={open}
        variant="permanent"
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: open ? 'flex-start' : 'center',
            mx: 1,
            my: 1.5,
          }}
        >
          {!open && hover && (
            <IconButton onClick={handleClick}>
              <KeyboardDoubleArrowRightOutlined />
            </IconButton>
          )}
          {!open && !hover && (
            <Avatar alt="icon" src={`/api/orgs/${orgId}/avatar`} />
          )}

          {open && (
            <ZUIFuture future={model.getOrganization(orgId)}>
              {(data) => {
                return (
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '48px',
                      }}
                    >
                      {hover ? (
                        <IconButton onClick={handleClick}>
                          <KeyboardDoubleArrowLeftOutlined />
                        </IconButton>
                      ) : (
                        <Avatar alt="icon" src={`/api/orgs/${orgId}/avatar`} />
                      )}
                    </Box>
                    <Typography variant="h6">{data.title}</Typography>
                  </Box>
                );
              }}
            </ZUIFuture>
          )}
        </Box>
        <Divider />
        <Box>
          <List
            sx={{
              mx: 1,
            }}
          >
            {menuItemsMap.map((item) => {
              const selected = key.startsWith('/' + item.name);
              const icon = cloneElement<IconProps>(item.icon, {
                // Differentiate size of icon for open/closed states
                fontSize: open ? 'small' : 'medium',
              });

              return (
                <>
                  <NextLink
                    key={item.name}
                    href={`/organize/${orgId}/${item.name}`}
                    passHref
                  >
                    <ListItemButton
                      disableGutters
                      sx={{
                        '&:hover': {
                          background: theme.palette.grey[100],
                          pointer: 'cursor',
                        },
                        backgroundColor: selected
                          ? theme.palette.grey[200]
                          : 'transparent',
                        borderRadius: '3px',
                        my: 0.5,
                        py: open ? 1.25 : 1.5,
                        transition: theme.transitions.create(
                          ['padding-top', 'padding-bottom', 'background-color'],
                          {
                            duration: theme.transitions.duration.leavingScreen,
                            easing: theme.transitions.easing.sharp,
                          }
                        ),
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: '48px',
                          width: '48px',
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <Typography
                        sx={{
                          alignItems: 'center',
                          display: open ? 'block' : 'none',
                          fontWeight: key.startsWith('/' + item.name)
                            ? 700
                            : 'normal',
                        }}
                      >
                        {messages.organizeSidebar[item.name]()}
                      </Typography>
                    </ListItemButton>
                  </NextLink>
                </>
              );
            })}
          </List>
        </Box>
        <Box
          sx={{
            bottom: 0,
            position: 'absolute',
            width: '100%',
          }}
        >
          <Divider />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mx: open ? 1 : 0.5,
              my: 0.5,
              py: open ? 1.25 : 1,
            }}
          >
            {user && (
              <>
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    mx: 1,
                    width: '48px',
                  }}
                >
                  <ZUIAvatar
                    orgId={orgId}
                    personId={user.id}
                    size={open ? 'sm' : 'md'}
                  />
                  <Typography
                    sx={{
                      display: open ? 'flex' : 'none',
                      marginLeft: 1,
                    }}
                  >
                    {user.first_name}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    justifyContent: 'flex-end',
                  }}
                >
                  <ZUIEllipsisMenu
                    items={[
                      {
                        label: (
                          <Typography>
                            {messages.organizeSidebar.signOut()}
                          </Typography>
                        ),
                        onSelect: () => {
                          logOut();
                        },
                        startIcon: <Logout />,
                      },
                    ]}
                  />
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default ZUIOrganizeSidebar;
