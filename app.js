var cron = require('node-cron');
var nodemailer = require('nodemailer');
var express = require('express')
var app = express();
const schedule = require('node-schedule');
const bodyParser = require('body-parser');
var router = express.Router()
//Email schedules code comes here

app.use(express.json())
app.use(bodyParser.urlencoded({ extends: true }))
app.use('/', router)


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mostafaedu0@gmail.com',   //put your mail here
        pass: 'zymowxobvvkhlvjx'              //password here
    }
});

router.post('/', function (req, res, next) {
    console.log(req.query)
    console.log(req.body);
    try {
        const mailOptions = {
            from: req.body.hostEmail,       // sender address
            to: req.body.emails,
            subject: 'Meeting Reminder with ' + req.body.hostEmail,
            html: '<p>' + req.body.message + '</p>'// plain text body
        };

        var meetingDate = new Date(req.body.dateTime);
        meetingDate.setMinutes(meetingDate.getMinutes() - req.body.minutesBeforeSending); // should be -

        meetingDate.setMilliseconds(0);
        meetingDate.setSeconds(0);
        console.log(meetingDate);

        schedule.scheduleJob(meetingDate, () => {
            transporter.sendMail(mailOptions, function (err, info) {
                if (err)
                    console.log(err);
                else
                    console.log(info);
            });
        });
        res.end(JSON.stringify({ status: 'success', message: 'Message scheduled with host ' + req.body.hostEmail, },),)

    }
    catch (e) {
        // console.log(e)
        res.end(JSON.stringify({
            status: 'failed',
            message: 'Message not scheduled'
        },),)

    }


    next();
});

app.listen(process.env.PORT || 8000)





// {
//     "emails": [
//         "mostafaedu0@gmail.com",
//         "mostafa.edu0@gmail.com",
//         "mostafaac30@gmail.com"
//     ],
//     "hostEmail": "mo@gmail.com",
//     "dateTime": "2022-11-15T20:30:00.000Z",
//     "message":"Hi your meeting in just x min, Regards Mostafa Mahmoud. ",
//     "minutesBeforeSending":27
// }