import { useQuery } from "react-query";
import config from 'config';

const fetchData = async (key)=>{
    const res = await fetch(`${config.host}/api/v1/cities`,{
        headers: {
            'Content-Type' : 'application/json'
        }
    } );
    
    console.log(res);
    return res.json();
}

const RegisterOptions = ()=>{

    const {data} = useQuery(['getCities'],fetchData,{keepPreviousData:true});

    console.log("users opions ",data);
    let cities = [];
    if(data !== undefined)
        cities = data;
    
    const roles = [
        {id:2,name:"Restaurant"},
        {id:3,name:"Courier"},
        {id:4,name:"Client"}
    ];
    
    return [cities,roles];
}

export default RegisterOptions