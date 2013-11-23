var log4js = require('log4js');

var extend = require('extend');
var express = require("express");
var nodemailer = require("nodemailer");
var conf = require('./backend/config/app');
var app = express();
app.use(express.bodyParser());
log4js.configure(conf.log4js || {});

var logger = log4js.getLogger("server");

logger.info(["configuration is", JSON.stringify(conf, null, 2) ]);

app.get('/backend/test', function(req, res){

});

app.post("/backend/submit", function( req, res ){
//    logger.info(['someone reached the backend', req.payload, req.params.applicantData, req.body, req.files, req.file ]);

    logger.info(req.body.applicantData);
    var applicantData = JSON.parse( req.body.applicantData );

    var mailer = nodemailer.createTransport(conf.mail.type, conf.mail.options);

    var mailOptions = extend(conf.mails.contactUs, {
         'text':JSON.stringify( applicantData, null , 4),
        'attachments': [
            {
                fileName: req.files.resume.name,
                filePath: req.files.resume.path
            }
        ],
        'subject': 'Resume Submitted: ' + applicantData.name
    });

    mailer.sendMail( mailOptions, function( error, mailResponse ){
        if ( error ){
            logger.error(error);
            res.status(500).send('error');
        }else{
            logger.info("send mail successfully");
            res.send("all is well");
        }
    });
});


var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log("Listening on " + port);
});