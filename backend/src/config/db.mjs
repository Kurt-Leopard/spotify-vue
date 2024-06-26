import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

const connection = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE
});

connection.connect((err)=>{
    if(err){
        console.log('Connection error!');
        return;
    }else{
        console.log('Connection successful!');
    }
});

export {connection};