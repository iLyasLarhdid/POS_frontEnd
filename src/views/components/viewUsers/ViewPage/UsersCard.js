import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Collapse, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import config from 'config';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
}));

const UsersCard = ({user})=>{
    
    const [expanded, setExpanded] = useState(false);
    
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    console.log(user);
    return(
        <>
        <Card elevation={2}>
            <CardMedia
                component="img"
                height="200"
                image={user.avatar ? `${config.host}/upload/viewFile/${user.avatar}` : "https://qph.fs.quoracdn.net/main-thumb-1176523004-200-taekpmmjavcgnijhmdujoqarphkecbdv.jpeg"}
                alt="green iguana"
                />
                <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {`${user.firstName} ${user.lastName}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {user.role}
                    <ExpandMore
                    style={{ padding:0 }}
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                    >
                    <ExpandMoreIcon />
                </ExpandMore>  
                </Typography>
                
            </CardContent>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
                <Typography>
                    email : {user.email}
                </Typography>
                <Typography>
                    city : {user.city.name}
                </Typography>
                <Typography>
                    address: {user.address}
                </Typography>
                </CardContent>
            </Collapse>
        </Card>
        
        </>
    );


}

export default UsersCard;