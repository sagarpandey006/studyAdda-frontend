import adminNavConfig from './adminConfig';
import memberNavConfig from './memberConfig';

// Dynamic navigation configuration based on user role
const getNavConfig = (user) => {
  if (user && user.isAdmin) {
    return adminNavConfig;
  }
  if (user) {
    return memberNavConfig;
  }
  // Default fallback (shouldn't be reached due to route protection)
  return [];
};

export default getNavConfig;
