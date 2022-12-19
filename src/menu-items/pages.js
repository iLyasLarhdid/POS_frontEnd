// assets
import { IconKey, IconShoppingCart, IconPackage } from '@tabler/icons';

// constant
const icons = {
    IconKey,
    IconShoppingCart,
    IconPackage
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
    id: 'pages',
    title: 'Pages',
    caption: 'Pages Caption',
    type: 'group',
    children: [
        {
            id: 'products',
            title: 'products',
            type: 'item',
            url: '/products',
            icon: icons.IconShoppingCart
        },
        {
            id: 'view orders',
            title: 'view orders',
            type: 'item',
            url: '/viewOrders',
            icon: icons.IconPackage
        },
        {
            id: 'add product',
            title: 'add product',
            type: 'item',
            url: '/addProduct',
            icon: icons.IconPackage
        },
        {
            id: 'add restaurants',
            title: 'add restaurants',
            type: 'item',
            url: '/viewRestaurants',
            icon: icons.IconPackage
        },
        {
            id: 'view users',
            title: 'view users',
            type: 'item',
            url: '/viewUsers',
            icon: icons.IconPackage
        },
        {
            id: 'catigory',
            title: 'Catigories',
            type: 'item',
            url: '/viewCatigories',
            icon: icons.IconPackage
        },
        {
            id: 'cart',
            title: 'cart',
            type: 'item',
            url: '/cart',
            icon: icons.IconPackage
        }
    ]
};

export default pages;
