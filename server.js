//Modules
import express from 'express';
import bunyan from 'bunyan';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

//Load values from .env file
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const log = bunyan.createLogger({ name: 'Device Code Flow' });

app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

//Set 1: Ask the authorization code
app.get('/get/the/code', (req, res) => {

    const DeviceCode_Endpoint = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/devicecode`;
    const Client_Id = process.env.CLIENT_ID;
    const Scope = 'https://graph.microsoft.com/User.Read';

    let body = `client_id=${Client_Id}&scope=${Scope}`;

    log.info(DeviceCode_Endpoint);

    fetch(DeviceCode_Endpoint, {
        method: 'POST',
        body: body,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(async response => {
        let json = await response.json();
        log.info(json);
        res.render('device-code', { code: JSON.stringify(json, undefined, 2), message: json.message, interval: json.interval, device_code: json.device_code }); //you shouldn't share the access token with the client-side

    }).catch(error => {
        log.error(error.message);
    });

});

//Step 2: Check if the user has signed and introduce the code
app.post('/checking', (req, res) => {

    const Token_Endpoint = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
    const Grant_Type = 'urn:ietf:params:oauth:grant-type:device_code';
    const Client_Id = process.env.CLIENT_ID;
    const Device_Code = req.body.device_code;

    let body = `grant_type=${Grant_Type}&client_id=${Client_Id}&device_code=${Device_Code}`;

    fetch(Token_Endpoint, {
        method: 'POST',
        body: body,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(async response => {

        let json = await response.json();
        log.info(json);

        if (response.ok) {
            res.send(200, json);
        }
        else {
            res.send(400);
        }

    }).catch(response => {
        log.error(response.error);
    });
});

//Step 3: Show the access token
app.get('/access/token', (req, res) => {

    res.render('access-token', { token: req.query.access_token }); //you shouldn't share the access token with the client-side

});

//Step 4: Call the protected API
app.post('/call/ms/graph', (req, res) => {

    let access_token = req.body.token;

    const Microsoft_Graph_Endpoint = 'https://graph.microsoft.com/beta';
    const Acction_That_I_Have_Access_Because_Of_My_Scope = '/me';

    //Call Microsoft Graph with your access token
    fetch(`${Microsoft_Graph_Endpoint}${Acction_That_I_Have_Access_Because_Of_My_Scope}`, {
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    }).then(async response => {

        let json = await response.json();
        res.render('calling-ms-graph', { response: JSON.stringify(json, undefined, 2) });
    });
});

app.listen(8000);