require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');



const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/signup.html');
})

app.post('/', function(req, res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const list_id = 'bde603bcec';

    var data = {
        members: [{
            email_address: email,
            status: 'subscribed',
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
           }
        }]
    }

    var jsonData = JSON.stringify(data);

    const api = process.env.API;

    const options = {
        
        url: `https://us20.api.mailchimp.com/3.0/lists/${list_id}`,
        method: 'POST',
        headers: {
            'Authorization': `romeo1 ${api}`
        },
        body: jsonData
    };

    request(options, function(error, response, body){
        if (error){
            res.sendFile(__dirname + '/failure.html');
        } else {
            if (response.statusCode === 200) {
                res.sendFile(__dirname + '/success.html');
            } else {
                res.sendFile(__dirname + '/failure.html');
            }
        }
    })
})

app.post('/failure', function(req, res){
    res.redirect('/');
})

app.listen(process.env.PORT || 3000, function(){
    console.log('server is running on port 3000');
})
