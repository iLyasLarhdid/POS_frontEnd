// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, Stack } from '@mui/material';

// project imports
import SearchSection from './SearchSection';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import logo from '../../../assets/images/redlogo.png';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = () => {
    const theme = useTheme();
    const history = useHistory();
    const [cookies,] = useCookies();
    return (
        <>
            {/* logo & toggler button */}
            <Box
                sx={{
                    width: 228,
                    display: 'flex',
                    [theme.breakpoints.down('md')]: {
                        width: 'auto'
                    }
                }}
            >
                <Box component="span" sx={{ display: { xs: 'block', md: 'block' }, flexGrow: 1, fontSize:{ xs: '0.6em', md: '1em' } }}>
                    <Link to="/" style={{ textDecoration: 'none', color:'grey' }}>
                        <img src={logo} width={150}/>
                    </Link>
                </Box>
            </Box>

            {/* header search */}
            <SearchSection />
            <Box sx={{ flexGrow: 1 }} />

            <Stack spacing={2} direction="row">
                <Button variant="text" onClick={()=>history.push("/cart")} sx={{ borderRadius: '12px' }}>
                        Cart {cookies.cart && cookies.cart.length}
                </Button>
                <Button variant="text" onClick={()=>history.push("/products")} sx={{ borderRadius: '12px' }}>
                        Products
                </Button>
                <Button variant="contained" onClick={()=>history.push("/login")} sx={{ borderRadius: '12px' }}>
                        Login
                </Button>
            </Stack>
        </>
    );
};

export default Header;
