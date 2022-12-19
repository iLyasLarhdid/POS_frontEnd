// project imports
import config from '../config';

// action - state management
import * as actionTypes from './actions';

export const initialState = {
    isOpen: [], // for active default menu
    fontFamily: config.fontFamily,
    borderRadius: config.borderRadius,
    opened: true,
    isLoggedIn: false,
    cart: []
};

// ==============================|| CUSTOMIZATION REDUCER ||============================== //

const customizationReducer = (state = initialState, action) => {
    let id;
    let newCart;
    switch (action.type) {
        case actionTypes.MENU_OPEN:
            id = action.id;
            return {
                ...state,
                isOpen: [id]
            };
        case actionTypes.SET_MENU:
            return {
                ...state,
                opened: action.opened
            };
        case actionTypes.SET_FONT_FAMILY:
            return {
                ...state,
                fontFamily: action.fontFamily
            };
        case actionTypes.SET_BORDER_RADIUS:
            return {
                ...state,
                borderRadius: action.borderRadius
            };
        case actionTypes.ADD_TO_CART:
            newCart = action.cart;
            return {
                ...state,
                cart: newCart
            };
        case actionTypes.LOGGING:
            return {
                ...state,
                isLoggedIn: true
            };
        case actionTypes.LOGOUT:
            return {
                ...state,
                isLoggedIn: false
            };
        default:
            return state;
    }
};

export default customizationReducer;
