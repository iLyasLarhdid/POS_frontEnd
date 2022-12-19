// material-ui
import { Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
    <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle2" component={Link} href="https://instagram.com/ilyaslarhdid" target="_blank" underline="hover">
            ilyas larhdid
        </Typography>
        <Typography variant="subtitle2" component={Link} href="https://facebook.com" target="_blank" underline="hover">
            &copy; facebook.com
        </Typography>
    </Stack>
);

export default AuthFooter;
