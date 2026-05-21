import PropTypes from "prop-types";
import { forwardRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Link } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";


const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const { user } = useAuth();

  const getHomePath = () => {
    if (!user) return "/login";
    if (user.isAdmin) return "/admin/dashboard";
    return "/member/dashboard";
  };

  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        display: 'inline-flex',
        textAlign: 'center',
        margin: 'auto',
        justifyContent: 'center',
        ...sx,
      }}
      {...other}
    >
      <img src="/assets/studyadda.png" alt="Logo" width="100%" />
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return (
    <Link to={getHomePath()} component={RouterLink} sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  sx: PropTypes.object,
  disabledLink: PropTypes.bool,
};

export default Logo;
