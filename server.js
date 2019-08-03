const express = require('express');
const jwt = require('jsonwebtoken');


const app = express();

app.get('/api', (request, response) => {
    response.json({
        message: 'Welcome to the API'
    });
});

app.post('/api/posts', verifyToken, (request, response) => {

    jwt.verify(request.token, 'secretkey', (err, authData) => {
        if (err)
            response.sendStatus(403)
        else {
            response.json({
                message: "Post created",
                authData
            });
        }
    });
});

app.post('/api/login', (request, response) => {
    
    // Mock user (perform authentication and get the user back)

    const user = {
        id: 1,
        name: 'john',
        email: 'john@testmail.com'
    };
    
    jwt.sign({ user }, 'secretkey', { expiresIn: '30s' }, (err, token) => {
        if (token)
            response.json({
                token
            });
    });
});


// FORMAT OF TOKEN

// Authorization: Bearer <access_token>

function verifyToken(request, response, next) {

    // get auth header value

    const bearerHeader = request.headers['authorization'];

    // check if the bearer is undefined

    if (typeof bearerHeader !== 'undefined') {

        // Split at space

        request.token = bearerHeader.split(' ')[1];

        next(); // Next middleware

    }
    else {
        // Forbidden
        response.sendStatus(403);
    }

};

app.listen(5002, () => console.log("Server listening on port 5002"));