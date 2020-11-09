//jshint esversion:6
const express = require("express");
const bodyparser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+ "/signup.html");
});

app.post("/",function(req,res){
    const firstName = req.body.fName;
    const lastName = req.body.lName; 
    const email = req.body.email;
    console.log(firstName,lastName,email);

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName, 
                }
            }
        ]
    };
    
    const jsonData = JSON.stringify(data);

    const url = "https://us2.api.mailchimp.com/3.0/lists/56ff61e66e";
    
    const option = {
        hostname: "us2.api.mailchimp.com",
        path: "/3.0/lists/56ff61e66e",
        method: "POST",
        auth: "Anand1:944f168abb1de79008943b040eb6fdf9-us2"
    }

    const request = https.request(option , function(response){
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();

});

app.listen(3000,function(){
    console.log("server started on port 3000");
});



//list id for audience-56ff61e66e
// api key 944f168abb1de79008943b040eb6fdf9-us2