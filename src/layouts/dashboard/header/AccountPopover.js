import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { alpha } from "@mui/material/styles";
import { Avatar, Box, Divider, IconButton, MenuItem, Popover, Typography } from "@mui/material";
import toast from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";
import { authApi } from "../../../services/api";

export default function AccountPopover() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => setOpen(event.currentTarget);
  const handleClose = () => setOpen(null);

  const logoutUser = async () => {
    handleClose();
    try {
      await authApi.logout();
      logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local session even if API call fails
      logout();
    }
  };

  const handleGoToProfile = () => {
    handleClose();
    const profilePath = user.isAdmin ? '/admin/students' : '/member/profile';
    navigate(profilePath);
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={user.photoUrl} alt={user.name} />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {!user.isAdmin && (
          <MenuItem onClick={handleGoToProfile} sx={{ m: 1 }}>
            My Profile
          </MenuItem>
        )}

        <MenuItem onClick={logoutUser} sx={{ m: 1, color: 'error.main' }}>
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
