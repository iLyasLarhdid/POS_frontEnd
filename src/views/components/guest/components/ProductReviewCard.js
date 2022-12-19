import { Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import config from 'config';
import { Image } from "antd";

const ProductReviewCard = ({product})=>{
    return (
    <Grid item lg={12} md={12} sm={12} xs={12}>
        <Card raised={true}>
            <CardMedia
                component="img"
                height="400"
                image={product.pictures.length>0 ? `${config.host}/upload/viewFile/${product.pictures[0].title}` : ''}
                alt="green iguana"
                />
                <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.pictures !== undefined 
                    && product.pictures !== null 
                    && product.pictures.map(pic=><Image width={100} src={`${config.host}/upload/viewFile/${pic.title}`}></Image>)
                    }
                </Typography>
            </CardContent>
        </Card>
    </Grid>);
};

export default ProductReviewCard;