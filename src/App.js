import{BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { UserContext } from './hooks/UserContext';
import { useState, lazy } from 'react';
import { useCookies } from 'react-cookie';
import { QueryClient, QueryClientProvider } from 'react-query';

import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
// defaultTheme
import themes from './themes/index';
import { useSelector } from 'react-redux';
import MainLayoutGuest  from './layout/MainLayoutGuest';
import MainLayout  from './layout/MainLayout';
import MinimalLayout from './layout/MinimalLayout';

import Loadable from './ui-component/Loadable';
import Cart from 'views/components/cart';
import { SnackbarProvider } from 'notistack';

const PageNotFound = Loadable(lazy(()=>import ('./views/components/errors/PageNotFound')));
const Dahsboard = Loadable(lazy(()=>import ('./views/components/dashboard/Default/')));
const GuestPage = Loadable(lazy(()=>import ('./views/components/guest/GuestPage')));
const ProductPage = Loadable(lazy(()=>import ('./views/components/guest/ProductPage')));
const ProductReviewPage = Loadable(lazy(()=>import ('./views/components/guest/ProductReviewPage')));
const Logout = Loadable(lazy(()=>import ('./views/components/Logout')));
//const SignupPage = Loadable(lazy(()=>import ('./views/components/SignupPage')));
//const LoginPage = Loadable(lazy(()=>import ('./views/components/LoginPage')));
const ForgotPassword = Loadable(lazy(()=>import ('./views/components/ForgotPassword')));
const ChangePassword = Loadable(lazy(()=>import ('./views/components/ChangePassword')));

const AuthLogin = Loadable(lazy(() => import('./views/components/authentication/authentication3/Login3')));
const AuthRegister = Loadable(lazy(() => import('./views/components/authentication/authentication3/Register3')));

const AddProduct = Loadable(lazy(() => import('./views/components/addingProduct')));
const ViewRestaurants = Loadable(lazy(() => import('./views/components/viewRestaurants')));

const ViewUsers = Loadable(lazy(() => import('views/components/viewUsers')));

const ViewOrders = Loadable(lazy(() => import('views/components/viewOrders')));

const ViewCatigories = Loadable(lazy(() => import('views/components/viewCatigories')));


function App() {
  const [cookies,] = useCookies([]);
  const [role, setRole] = useState(cookies.principal_role);
  const queryClient = new QueryClient();
  const customization = useSelector((state) => state.customization);

  return (
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={themes(customization)}>
      <CssBaseline />
        <SnackbarProvider maxSnack={2}>
          <Router>
            <QueryClientProvider client={queryClient}>   
              <UserContext.Provider value={[role,setRole]}>
                  <Switch>
                    <Route exact path="/">
                        {cookies.smailToken || customization.isLoggedIn ? 
                        <MainLayout page={<GuestPage/>} /> 
                        :
                        <MainLayoutGuest page={<GuestPage/>} /> 
                        }
                    </Route> 
                    <Route exact path="/products" >
                        {cookies.smailToken || customization.isLoggedIn ? 
                        <MainLayout page={<ProductPage/>} /> 
                        :
                        <MainLayoutGuest page={<ProductPage/>} /> 
                        }
                    </Route>
                    <Route exact path="/product/:id" >
                        {cookies.smailToken || customization.isLoggedIn ? 
                        <MainLayout page={<ProductReviewPage/>} /> 
                        :
                        <MainLayoutGuest page={<ProductReviewPage/>} /> 
                        }
                    </Route>
                    <Route exact path="/cart">
                        {cookies.smailToken || customization.isLoggedIn ? 
                        <MainLayout page={<Cart/>} /> 
                        :
                        <MainLayoutGuest page={<Cart/>} /> 
                        }
                    </Route> 
                    <Route exact path="/dashboard" >
                        {cookies.smailToken || customization.isLoggedIn ? <MainLayout page={<Dahsboard/>} /> : <PageNotFound />}
                    </Route>
                    <Route exact path="/addProduct" >
                        {cookies.smailToken || customization.isLoggedIn ? <MainLayout page={<AddProduct/>} /> : <PageNotFound />}
                    </Route>
                    <Route exact path="/addProduct/:id" >
                        {cookies.smailToken || customization.isLoggedIn ? <MainLayout page={<AddProduct/>} /> : <PageNotFound />}
                    </Route>
                    <Route exact path="/viewRestaurants" >
                        {cookies.smailToken || customization.isLoggedIn ? <MainLayout page={<ViewRestaurants/>} /> : <PageNotFound />}
                    </Route>
                    <Route exact path="/viewUsers" >
                        {cookies.smailToken || customization.isLoggedIn ? <MainLayout page={<ViewUsers/>} /> : <PageNotFound />}
                    </Route>
                    <Route exact path="/viewOrders" >
                        {cookies.smailToken || customization.isLoggedIn ? <MainLayout page={<ViewOrders/>} /> : <PageNotFound />}
                    </Route>
                    <Route exact path="/order/:id" >
                        {cookies.smailToken || customization.isLoggedIn ? <MainLayout page={<ViewOrders/>} /> : <PageNotFound />}
                    </Route>
                    <Route exact path="/viewCatigories" >
                        {cookies.smailToken || customization.isLoggedIn ? <MainLayout page={<ViewCatigories/>} /> : <PageNotFound />}
                    </Route>
                    <Route exact path="/register" >
                        <MinimalLayout page={<AuthRegister/>} />
                    </Route>
                    <Route exact path="/login">
                        <MinimalLayout page={<AuthLogin/>} />
                    </Route>
                    <Route exact path="/forgotPassword">
                        <ForgotPassword/>
                    </Route>
                    <Route exact path="/changePassword/:emailToken">
                        <ChangePassword/>
                    </Route>
                    <Route exact path="/logout">
                        <Logout/>
                    </Route>
                    <Route path="/*">
                        <PageNotFound />
                    </Route>
                  </Switch>
                </UserContext.Provider>
              </QueryClientProvider>
            </Router>
        </SnackbarProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
