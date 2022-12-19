import dashboard from './dashboard';
import pages from './pages';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
    // todo : do a test for the role fo the logged in users and based on their role
    // we show certain pages and hide others
    items: [dashboard, pages]
};

export default menuItems;
