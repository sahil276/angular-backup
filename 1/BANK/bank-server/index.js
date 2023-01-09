// Server Creation

// 1 import express
const express = require("express");
const dataService = require('./services/dataService');
const jwt = require('jsonwebtoken');

// 2 Create an express app
const app = express();

//To get json file in javascript
app.use(express.json());

// 3 Create port number
app.listen(3000,()=>{
    console.log('listenig on port 3000');
})

// Application specific middleware
const appMiddleware = (req, res, next)  => {
    console.log('Application specific middleware');
    next();
}

app.use(appMiddleware);

//router specific middleware
const jwtRouterMiddleware = (req, res, next) => {
    try{
        console.log('Router specific middleware');
        const token = req.headers['token'];
        const data = jwt.verify(token, 'superkey2023');
        console.log(data);
        next();
    }
    catch{
        // 422 - unprocessable entity
        res.status(422).json({
            status:false,
            statusCode:422,
            message:'please login'
        })
    }
}

//Resolving http requets
/*
app.get('/', (req, res) => {
    res.send('Get http request');
})

app.post('/', (req, res) => {
    res.send('Post http request');
})

app.put('/', (req, res) => {
    res.send('Put http request');
})

app.patch('/', (req, res) => {
    res.send('Patch http request');
})

app.delete('/', (req, res) => {
    res.send('Delete http request');
})
*/



// Api call

// Register request
app.post('/register', (req, res) => {

    const result = dataService.register(req.body.acno, req.body.username, req.body.password); 
    res.status(result.statusCode).json(result);
    
    // if(result){
    //     res.send('Register successfull');
    // }else{
    //     res.send('Register failed');
    // }
    console.log(req.body);
})

// login request
app.post('/login', (req, res) => {
    const result = dataService.login(req.body.acno, req.body.password);
    res.status(result.statusCode).json(result);
})
     
// deposit request
app.post('/deposit',jwtRouterMiddleware, (req, res) => {
    const result = dataService.deposit(req.body.acno, req.body.password, req.body.dAmt);
    res.status(result.statusCode).json(result);
})

// withdraw request
app.post('/withdraw',jwtRouterMiddleware, (req, res) => {
    const result = dataService.withdraw(req.body.acno, req.body.password, req.body.wAmt);
    res.status(result.statusCode).json(result);
})

// transaction request
app.post('/transaction',jwtRouterMiddleware, (req, res) => {
    const result = dataService.getTransaction(req.body.acno);
    res.status(result.statusCode).json(result);
})

// delete request

    





