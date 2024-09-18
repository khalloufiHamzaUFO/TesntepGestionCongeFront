import dashboard from './dashboard';
import utilities from './utilities';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [dashboard(), utilities()], // Generate all menu items regardless of user role
};

export default menuItems;
