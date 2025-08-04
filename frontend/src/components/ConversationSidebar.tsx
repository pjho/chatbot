import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  SmartToy as BotIcon,
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { ConversationList } from './ConversationList';

interface ConversationSidebarProps {
  open: boolean;
  onToggle: () => void;
  currentConversationId?: string | null;
  onNavigate?: () => void;
}

const SIDEBAR_WIDTH = 280;
const COLLAPSED_WIDTH = 64;

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  open,
  onToggle,
  currentConversationId,
  onNavigate,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const sidebarContent = (
    <Box
      sx={{
        width: open ? SIDEBAR_WIDTH : COLLAPSED_WIDTH,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        borderRight: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          p: 2,
          minHeight: 64,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        {open && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BotIcon color="primary" />
            <Typography variant="h6" component="div" noWrap>
              Local AI Chat
            </Typography>
          </Box>
        )}
        <IconButton onClick={onToggle} size="small">
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      {open && (
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <ConversationList 
            currentConversationId={currentConversationId}
            onNavigate={isMobile ? onToggle : onNavigate}
          />
        </Box>
      )}
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <Drawer
          variant="permanent"
          sx={{
            width: COLLAPSED_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: COLLAPSED_WIDTH,
              boxSizing: 'border-box',
              position: 'relative',
            },
          }}
        >
          <Box
            sx={{
              width: COLLAPSED_WIDTH,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRight: `1px solid ${theme.palette.divider}`,
              bgcolor: 'background.paper',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                minHeight: 64,
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <IconButton onClick={onToggle} size="small">
                <MenuIcon />
              </IconButton>
            </Box>
          </Box>
        </Drawer>
        <Drawer
          variant="temporary"
          open={open}
          onClose={onToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: SIDEBAR_WIDTH,
              boxSizing: 'border-box',
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      </>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? SIDEBAR_WIDTH : COLLAPSED_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? SIDEBAR_WIDTH : COLLAPSED_WIDTH,
          boxSizing: 'border-box',
          position: 'relative',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
};