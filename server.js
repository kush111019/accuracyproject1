const express = require('express')
const sql = require('mssql')
const bodyParser = require("body-parser");
const Jimp = require("jimp");
//cron.schedule('0 0 1 * * * '
const cron=require("node-cron")
const cors = require('cors');
const nodemailer=require("nodemailer")//me
const mailGun=require("nodemailer-mailgun-transport")//me
const fs=require('fs')
const dotenv = require('dotenv')
var path=require('path')
dotenv.config();
const { response } = require('express');
const schedule = require('node-schedule');
const { ApplicationPage } = require('twilio/lib/rest/api/v2010/account/application');
const { Console } = require('console');
const app = express()
app.use(cors());
const PORT=3002
//const PORT = process.env.PORT
//to decode base64 image
const decode = require("node-base64-image").decode

app.listen(PORT, () => {
 console.log(`joblisting listing port ${PORT}`)
})

app.use(bodyParser.json()), app.use(bodyParser.urlencoded({ extended: !0 })),
app.use(express.static(__dirname + "/uploads"));

DOMAIN = 'icma-apac.com';

const mailgun = require('mailgun-js')({ apiKey:process.env.mail_key, domain:DOMAIN }) 
const auth={
    auth:{
        api_key:process.env.mail_key,
        domain:DOMAIN
    }
}//me

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// config for your database
var config = {
    user:'joblistingadmin',
    password:'Shivam@_12345',
    server:'joblistingserver.database.windows.net',
    database: 'Joblisting',
    port:1433,
    requestTimeout :5000000,
    "options": {
        "encrypt":true,
        "enableArithAbort":true
        }
};

//func to decode base 64
const decodeImage = async(base64_code,id)=>{
      const image=base64_code
      await decode(image, { fname: `./Companyphotos1/${id}`, ext: 'png' });
}

sql.connect(config, function (err) {
    if (err) console.log(err);
    var con = new sql.Request();


const job_post = schedule.scheduleJob('0 0 * * *', function(){ 
    con.query("select STRING_AGG(cast(Username as NVARCHAR(MAX)),',') as Email from Userprofiles s where s.Type = 5 and  DateCreated > getdate() - 15 and UserId not  in (SELECT EmployerId FROM jobs u inner JOIN UserProfiles c  ON c.Userid = u.EmployerId  where c.Type = 5 )", (err, rs) => {
       if (err) {
            console.log(err);
       } else {
           if(rs.recordset[0].Email!==null){
            var email=rs.recordset[0].Email
            let messageOptions = {
                from:process.env.MAIL,
                to:"Jobseeker.Chetan@gmail.com",
                subject:'Job posting remainder',
                html: `            <html>
                <head>
                    <title></title>
                    <style>
                        #Container
                        {
                            background-color:white;
                            
                            border-radius: 4px;
                            border: 1px solid #e3e3e3;
                            text-align: justify;
                            padding:25px;
                        }
                        body
                        {
                            background-color: #f5f5f5;
                            text-align:center;
                            padding:10px;
                            font-family: Tahoma;
                        }
                    </style>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
                    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
                </head>
                <body style="background-color: #f5f5f5; text-align:center; padding:10px; font-family: Tahoma;">
                    <div style="text-align:left; padding-top:10px; padding-bottom:10px;">
                    </div>
            
                    <div id="Container">
                        <p>Dear Sir/Madam</p>
                        <br />
                        <div>
                            <h4>We come across your requirements posted on the</h4><a href="https://www.joblisting.com">https://www.joblisting.com</a><br><br>
                            <p>As part of our ongoing commitment to improving the experience of all hiring companies, we wish to offer you the opportunity of adding your listing to our platform</p><br>   
                            <p>Benefits of listing jobs on Joblisting.com include:</p>
                            <p>1.We provide an efficient platform to list your vacancies.</p>  
                            <p>2.We help your company match with the talents it needs.</p>
                            <p>3.We make your hiring process easier and hassle-free. </p>
                            <p style="display:inline">Post a listing now:<a id="m_8097175852685641331downloadbutton" href="https://www.joblisting.com/account/registernow" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.joblisting.com/account/registernow&amp;source=gmail&amp;ust=1667366167285000&amp;usg=AOvVaw0B7mtOr4zugX_AqekbPICd">Yes</a>/
                            <a href="#m_8097175852685641331_">No</a></p>
                            <p style="margin-bottom: 0px;"><b>ALL THE BEST</b></p>
                            <br>
                            <p style="margin-bottom: 0px;">Thanks,</p>
                            <p>The JobListing Team We come across your requirements posted on the website</p>
                            <div style="font-size: 12px;">
            
                                <a href="https://www.joblisting.com/terms">Terms Of Use</a> | <a href="https://www.joblisting.com/privacy">Privacy</a> | <a href="https://www.joblisting.com/copyright">Copyright</a><br />
                                <p>If you want to opt out of receiving future emails from us, contact us at support@joblisting.com. If your Internet provider filters incoming email, please add support@joblisting.com to your list of approved senders. Please do not reply to this email as this is a computer-generated message. For further assistance, please contact us at support@joblisting.com</p>
                                <b>Disclaimer!</b>
                                <p>This is a genuine message/alert sent according to our <a href="https://www.joblisting.com/terms">Terms Of Use</a> and <a href="https://www.joblisting.com/privacy">Privacy</a>. Please do not reply to this email, as this is a computer-generated message/alert.	While all reasonable care has been taken in the preparation of the information contained in this email, Joblisting, Inc. or its related parties take no any responsibility for any action(s) taken on the basis of this message/alert, basis of the information contained herein or for any errors or omissions in that information. This email is intended for the use of the addressee only. If you are not the intended recipient of this message, kindly do not read or keep this message/alert with you and notify us at support@joblisting.com</p>
                                <p>You may have received this message/alert as "forward-to-a-friend" message. Joblisting, Inc. did not offer any kind of benefit and any gain to the forwarder or to the recommender and or did not give the forwarder or the recommender some other benefit in relation to sending you this message/alert. Also Joblisting, Inc. did not offer money, coupons, discounts,  awards, additional entries in a sweepstakes, any kind of benefit in exchange for generating traffic to website or the like in exchange for forwarding and or sending this message/alert and or recommending you in relation to this message/alert. </p>
                            </div>
            
                        </div>
                    </div>
                </body>
            </html>`
            }
             mailgun.messages().send(messageOptions, function (error, info) {
                if (error) {
                    console.log(error)
                    throw error;
                }else {
                    console.log("job post")
                }
            }) 

           }else{
               console.log("no job post")
           }       
       }
   
    })
})

const company_profile = schedule.scheduleJob('0 0 * * *', function(){
    con.query("select STRING_AGG(cast(u.username  as NVARCHAR(MAX)),',') as Email  FROM test4 u inner JOIN UserProfiles c  ON c.Userid = u.Userid where c.Type = 5 and DateCreated > getdate() - 15 and u.weightage< 80.00", (err, rs) => {
       if (err) {
            console.log(err);
       } else {
           if(rs.recordset[0].Email!==null){
            var email=rs.recordset[0].Email
            let messageOptions = {
                from:process.env.MAIL,
                to:email,
                subject:'Update company profile  remainder',
                html: `            <html>
                <head>
                    <title></title>
                    <style>
                        #Container
                        {
                            background-color:white;
                            
                            border-radius: 4px;
                            border: 1px solid #e3e3e3;
                            text-align: justify;
                            padding:25px;
                        }
                        body
                        {
                            background-color: #f5f5f5;
                            text-align:center;
                            padding:10px;
                            font-family: Tahoma;
                        }
                    </style>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
                    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
                </head>
                <body style="background-color: #f5f5f5; text-align:center; padding:10px; font-family: Tahoma;">
                    <div style="text-align:left; padding-top:10px; padding-bottom:10px;">
                    </div>
            
                    <div id="Container">
                        <p>Dear Sir/Madam</p>
                        <br />
                        <div>
                        <h4>Thanks for registering account at Joblisting and updating Profile.</h4><br></br>
                            <h4>We come across your requirements posted on the</h4><a href="https://www.joblisting.com">https://www.joblisting.com</a><br><br>
                            <p>As part of our ongoing commitment to improving the experience of all hiring companies, we wish to offer you the opportunity of adding your listing to our platform</p><br>   
                            <p>Benefits of listing jobs on Joblisting.com include:</p>
                            <p>1.We provide an efficient platform to list your vacancies.</p>  
                            <p>2.We help your company match with the talents it needs.</p>
                            <p>3.We make your hiring process easier and hassle-free. </p>
                            <p style="margin-bottom: 0px;"><b>ALL THE BEST</b></p>
                            <br>
                            <p>Post a listing now: </p><a id="downloadbutton" href="https://www.joblisting.com/account/registernow" >yes</a>
                            <p><a href=#>no</a>
                            <p style="margin-bottom: 0px;">Thanks,</p>
                            <p>The JobListing Team We come across your requirements posted on the website</p>
                            <div style="font-size: 12px;">
            
                                <a href="https://www.joblisting.com/terms">Terms Of Use</a> | <a href="https://www.joblisting.com/privacy">Privacy</a> | <a href="https://www.joblisting.com/copyright">Copyright</a><br />
                                <p>If you want to opt out of receiving future emails from us, contact us at support@joblisting.com. If your Internet provider filters incoming email, please add support@joblisting.com to your list of approved senders. Please do not reply to this email as this is a computer-generated message. For further assistance, please contact us at support@joblisting.com</p>
                                <b>Disclaimer!</b>
                                <p>This is a genuine message/alert sent according to our <a href="https://www.joblisting.com/terms">Terms Of Use</a> and <a href="https://www.joblisting.com/privacy">Privacy</a>. Please do not reply to this email, as this is a computer-generated message/alert.	While all reasonable care has been taken in the preparation of the information contained in this email, Joblisting, Inc. or its related parties take no any responsibility for any action(s) taken on the basis of this message/alert, basis of the information contained herein or for any errors or omissions in that information. This email is intended for the use of the addressee only. If you are not the intended recipient of this message, kindly do not read or keep this message/alert with you and notify us at support@joblisting.com</p>
                                <p>You may have received this message/alert as "forward-to-a-friend" message. Joblisting, Inc. did not offer any kind of benefit and any gain to the forwarder or to the recommender and or did not give the forwarder or the recommender some other benefit in relation to sending you this message/alert. Also Joblisting, Inc. did not offer money, coupons, discounts,  awards, additional entries in a sweepstakes, any kind of benefit in exchange for generating traffic to website or the like in exchange for forwarding and or sending this message/alert and or recommending you in relation to this message/alert. </p>
                            </div>
            
                        </div>
                    </div>
                </body>
            </html>`
             }
             mailgun.messages().send(messageOptions, function (error, info) {
                if (error) {
                    console.log(error)
                    throw error;
                }else {
                    console.log("update profile")
                }
            })  

           }else{
               console.log("no profile send")
           }  
       }
   
    })
})

const company_logo = schedule.scheduleJob('0 0 * * *', function(){
    con.query("select STRING_AGG(cast(Username as NVARCHAR(MAX)),',') as Email from Userprofiles u where u.Type = 5 and DateCreated > getdate() - 15 and u.UserId not  in(select userid from photos p)", (er,rs) => {
       if (err) {
            console.log(err);
       } else {
           if(rs.recordset[0].Email!==null){
            var email=rs.recordset[0].Email
            let messageOptions = {
                from:process.env.MAIL,
                to:email,
                subject:'Update company logo remainder', 
                html: `            <html>
                <head>
                    <title></title>
                    <style>
                        #Container
                        {
                            background-color:white;
                            
                            border-radius: 4px;
                            border: 1px solid #e3e3e3;
                            text-align: justify;
                            padding:25px;
                        }
                        body
                        {
                            background-color: #f5f5f5;
                            text-align:center;
                            padding:10px;
                            font-family: Tahoma;
                        }
                    </style>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
                    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
                </head>
                <body style="background-color: #f5f5f5; text-align:center; padding:10px; font-family: Tahoma;">
                    <div style="text-align:left; padding-top:10px; padding-bottom:10px;">
                    </div>
            
                    <div id="Container">
                        <p>Dear Sir/Madam</p>
                        <br />
                        <div>
                        <p> You have to complete your company Profile with logo by</p> <br></br>
                            <h4>We come across your requirements posted on the</h4><a href="https://www.joblisting.com">https://www.joblisting.com</a><br><br>
                            <p>As part of our ongoing commitment to improving the experience of all hiring companies, we wish to offer you the opportunity of adding your listing to our platform</p><br>   
                            <p>Benefits of listing jobs on Joblisting.com include:</p>
                            <p>1.We provide an efficient platform to list your vacancies.</p>  
                            <p>2.We help your company match with the talents it needs.</p>
                            <p>3.We make your hiring process easier and hassle-free. </p>
                            <p style="margin-bottom: 0px;"><b>ALL THE BEST</b></p>
                            <br>
                            <p style="margin-bottom: 0px;">Thanks,</p>
                            <p>The JobListing Team We come across your requirements posted on the website</p>
                            <div style="font-size: 12px;">
            
                                <a href="https://www.joblisting.com/terms">Terms Of Use</a> | <a href="https://www.joblisting.com/privacy">Privacy</a> | <a href="https://www.joblisting.com/copyright">Copyright</a><br />
                                <p>If you want to opt out of receiving future emails from us, contact us at support@joblisting.com. If your Internet provider filters incoming email, please add support@joblisting.com to your list of approved senders. Please do not reply to this email as this is a computer-generated message. For further assistance, please contact us at support@joblisting.com</p>
                                <b>Disclaimer!</b>
                                <p>This is a genuine message/alert sent according to our <a href="https://www.joblisting.com/terms">Terms Of Use</a> and <a href="https://www.joblisting.com/privacy">Privacy</a>. Please do not reply to this email, as this is a computer-generated message/alert.	While all reasonable care has been taken in the preparation of the information contained in this email, Joblisting, Inc. or its related parties take no any responsibility for any action(s) taken on the basis of this message/alert, basis of the information contained herein or for any errors or omissions in that information. This email is intended for the use of the addressee only. If you are not the intended recipient of this message, kindly do not read or keep this message/alert with you and notify us at support@joblisting.com</p>
                                <p>You may have received this message/alert as "forward-to-a-friend" message. Joblisting, Inc. did not offer any kind of benefit and any gain to the forwarder or to the recommender and or did not give the forwarder or the recommender some other benefit in relation to sending you this message/alert. Also Joblisting, Inc. did not offer money, coupons, discounts,  awards, additional entries in a sweepstakes, any kind of benefit in exchange for generating traffic to website or the like in exchange for forwarding and or sending this message/alert and or recommending you in relation to this message/alert. </p>
                            </div>
            
                        </div>
                    </div>
                </body>
            </html>`
             }
             mailgun.messages().send(messageOptions, function (error, info) {
                if (error) {
                    console.log(error)
                    throw error;
                }else {
                    console.log("update logo")
                }
            })

           }else{
               console.log("logo not send")
           }
       }
   
    })
})

const percentage = schedule.scheduleJob('0 0 * * *', function(){
    var b=" SELECT STRING_AGG(cast(EmailID as NVARCHAR(MAX)),'"+com+"') as Email FROM shareJMails  where EmailID in(select Username  from test4  where  weightage < 80) and EmailID  LIKE '%@%.%' AND PATINDEX('%[^a-z,0-9,@,.,,\-]%',EmailID ) = 0"
    //   console.log(b)
    con.query(b,(err,rsl)=>{
       if(err){
           console.log(err)
       }else{
           if(rsl.recordset[0].Email!==null){
            var mailList=rsl.recordset[0].Email
            let messageOptions = {
                from:process.env.MAIL,
                to:mailList,
                subject: `Profile strength remainder`,
                html: `
 
                <html>
                            <head>
                                <title></title>
                                <style>
                                    #Container
                                    {
                                        background-color:white;
                                        
                                        border-radius: 4px;
                                        border: 1px solid #e3e3e3;
                                        text-align: justify;
                                        padding:25px;
                                    }
                                    body
                                    {
                                        background-color: #f5f5f5;
                                        text-align:center;
                                        padding:10px;
                                        font-family: Tahoma;
                                    }
                                </style>
                                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
                                <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
                            </head>
                            <body style="background-color: #f5f5f5; text-align:center; padding:10px; font-family: Tahoma;">
                                <div style="text-align:left; padding-top:10px; padding-bottom:10px;">
                                </div>
                        
                                <div id="Container">
                                    <p>Hello</p><br />
                                   <p>Your Profile strength is low in joblisting application.complete the application in joblisting.</p><br>
                                    <div>
                                    <ul>
                                    <li style="color: LightSeaGreen;">Register</li>
                                    <li style="color: OrangeRed;">Update Profile</li>
                                    <li style="color: DodgerBlue ;">Apply Job</li>
                                    </ul> <br>
                                        <p style="margin-bottom: 0px;"><b>ALL THE BEST</b></p>
                                        <br>
                                        <p style="margin-bottom: 0px;">Thanks,</p>
                                        <p>JobListing Team</p>
                                        <div style="font-size: 12px;">
                        
                                            <a href="https://www.joblisting.com/terms">Terms Of Use</a> | <a href="https://www.joblisting.com/privacy">Privacy</a> | <a href="https://www.joblisting.com/copyright">Copyright</a><br />
                                            <p>If you want to opt out of receiving future emails from us, contact us at support@joblisting.com. If your Internet provider filters incoming email, please add support@joblisting.com to your list of approved senders. Please do not reply to this email as this is a computer-generated message. For further assistance, please contact us at support@joblisting.com</p>
                                            <b>Disclaimer!</b>
                                            <p>This is a genuine message/alert sent according to our <a href="https://www.joblisting.com/terms">Terms Of Use</a> and <a href="https://www.joblisting.com/privacy">Privacy</a>. Please do not reply to this email, as this is a computer-generated message/alert.	While all reasonable care has been taken in the preparation of the information contained in this email, Joblisting, Inc. or its related parties take no any responsibility for any action(s) taken on the basis of this message/alert, basis of the information contained herein or for any errors or omissions in that information. This email is intended for the use of the addressee only. If you are not the intended recipient of this message, kindly do not read or keep this message/alert with you and notify us at support@joblisting.com</p>
                                            <p>You may have received this message/alert as "forward-to-a-friend" message. Joblisting, Inc. did not offer any kind of benefit and any gain to the forwarder or to the recommender and or did not give the forwarder or the recommender some other benefit in relation to sending you this message/alert. Also Joblisting, Inc. did not offer money, coupons, discounts,  awards, additional entries in a sweepstakes, any kind of benefit in exchange for generating traffic to website or the like in exchange for forwarding and or sending this message/alert and or recommending you in relation to this message/alert. </p>
                                        </div>
                        
                                    </div>
                                </div>
                            </body>
                        </html>
                `
              }; 
              mailgun.messages().send(messageOptions, function (error, info) {
                if (error) {
                    console.log(error)
                    throw error;
                }else {
                 console.log('sent to mail to user')
                }
            });
           }else{
               console.log("done")
           }
       }
   })

})
app.get("/profile_share",function(req,res){
  
    user_profile_share();

})
const user_profile_share=(schedule.scheduleJob('0 0 * * *',function(){             
    com = ",";
    var a="select STRING_AGG(cast(EmailID as NVARCHAR(MAX)),'"+com+"') as Email  FROM shareJMails where EmailID  LIKE '%@%.%' AND PATINDEX('%[^a-z,0-9,@,.,,\-]%',EmailID ) = 0 and Dt = convert(date,getdate())"
      con.query(a,(er,rs)=>{
         if(er){
             console.log(er)
         }else{
             if(rs.recordset[0].Email!==null){
                var mailList=rs.recordset[0].Email
                console.log(mailList)
                let messageOptions = {
                    from:process.env.MAIL,
                    to:mailList,
                    subject:`Shared job profiles`,
                    html: `<html>
                    <head>
                        <title></title>
                        <style>
                            #Container
                            {
                                background-color:white;
                                
                                border-radius: 4px;
                                border: 1px solid #e3e3e3;
                                text-align: justify;
                                padding:25px;
                            }
                            body
                            {
                                background-color: #f5f5f5;
                                text-align:center;
                                padding:10px;
                                font-family: Tahoma;
                            }
                        </style>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
                        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
                    </head>
                    <body style="background-color: #f5f5f5; text-align:center; padding:10px; font-family: Tahoma;">
                        <div style="text-align:left; padding-top:10px; padding-bottom:10px;">
                        </div>
                
                        <div id="Container">
                            <p>Hello</p><br />
                       <p>JobListing’s mission is to accelerate your job hunt. You can use the platform to access several job listings across the globe, find the job that suits your profile best, and boost your professional career.</p><br>  
                       <p>Ready to begin? Choose one of the options below:</p>
                            <div>
                            <ul>
                            <li style="color: LightSeaGreen;">Register</li>
                            <li style="color: OrangeRed;">Update Profile</li>
                            <li style="color: DodgerBlue ;">Apply Job</li>
                            </ul> <br>
                                <p style="margin-bottom: 0px;"><b>ALL THE BEST</b></p>
                                <br>
                                <p style="margin-bottom: 0px;">Thanks,</p>
                                <p>JobListing Team</p>
                                <div style="font-size: 12px;">
                
                                    <a href="https://www.joblisting.com/terms">Terms Of Use</a> | <a href="https://www.joblisting.com/privacy">Privacy</a> | <a href="https://www.joblisting.com/copyright">Copyright</a><br />
                                    <p>If you want to opt out of receiving future emails from us, contact us at support@joblisting.com. If your Internet provider filters incoming email, please add support@joblisting.com to your list of approved senders. Please do not reply to this email as this is a computer-generated message. For further assistance, please contact us at support@joblisting.com</p>
                                    <b>Disclaimer!</b>
                                    <p>This is a genuine message/alert sent according to our <a href="https://www.joblisting.com/terms">Terms Of Use</a> and <a href="https://www.joblisting.com/privacy">Privacy</a>. Please do not reply to this email, as this is a computer-generated message/alert.	While all reasonable care has been taken in the preparation of the information contained in this email, Joblisting, Inc. or its related parties take no any responsibility for any action(s) taken on the basis of this message/alert, basis of the information contained herein or for any errors or omissions in that information. This email is intended for the use of the addressee only. If you are not the intended recipient of this message, kindly do not read or keep this message/alert with you and notify us at support@joblisting.com</p>
                                    <p>You may have received this message/alert as "forward-to-a-friend" message. Joblisting, Inc. did not offer any kind of benefit and any gain to the forwarder or to the recommender and or did not give the forwarder or the recommender some other benefit in relation to sending you this message/alert. Also Joblisting, Inc. did not offer money, coupons, discounts,  awards, additional entries in a sweepstakes, any kind of benefit in exchange for generating traffic to website or the like in exchange for forwarding and or sending this message/alert and or recommending you in relation to this message/alert. </p>
                                </div>
                
                            </div>
                        </div>
                    </body>
                </html>
                    `
                  }; 
                  mailgun.messages().send(messageOptions, function (error, info) {
                    if (error) {
                        console.log(error)
                        throw error;
                    }else {
                      console.log('User profile')
                    }
                })
             }else{
console.log('no mail')
             }

         }
     })
}))

const user_profile_share1=schedule.scheduleJob('0 0 * * *',function(){             
    com = ",";
    var a="select STRING_AGG(cast(EmailID as NVARCHAR(MAX)),'"+com+"') as Email  FROM shareJMails where EmailID  LIKE '%@%.%' AND PATINDEX('%[^a-z,0-9,@,.,,\-]%',EmailID ) = 0 and Dt = convert(date,getdate()-1)"
      con.query(a,(er,rs)=>{
         if(er){
             console.log(er)
         }else{
            if(rs.recordset[0].Email!==null){
            var mailList=rs.recordset[0].Email
             let messageOptions = {
                from:process.env.MAIL,
                to:mailList,
                subject: `Shared job profiles`,
                html: `<html>
                <head>
                    <title></title>
                    <style>
                        #Container
                        {
                            background-color:white;
                            
                            border-radius: 4px;
                            border: 1px solid #e3e3e3;
                            text-align: justify;
                            padding:25px;
                        }
                        body
                        {
                            background-color: #f5f5f5;
                            text-align:center;
                            padding:10px;
                            font-family: Tahoma;
                        }
                    </style>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
                    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
                </head>
                <body style="background-color: #f5f5f5; text-align:center; padding:10px; font-family: Tahoma;">
                    <div style="text-align:left; padding-top:10px; padding-bottom:10px;">
                    </div>
            
                    <div id="Container">
                        <p>Hello</p><br />
                   <p>JobListing’s mission is to accelerate your job hunt. You can use the platform to access several job listings across the globe, find the job that suits your profile best, and boost your professional career.</p><br>  
                   <p>Ready to begin? Choose one of the options below:</p>
                        <div>
                        <ul>
                        <li style="color: LightSeaGreen;">Register</li>
                        <li style="color: OrangeRed;">Update Profile</li>
                        <li style="color: DodgerBlue ;">Apply Job</li>
                        </ul> <br>
                            <p style="margin-bottom: 0px;"><b>ALL THE BEST</b></p>
                            <br>
                            <p style="margin-bottom: 0px;">Thanks,</p>
                            <p>JobListing Team</p>
                            <div style="font-size: 12px;">
            
                                <a href="https://www.joblisting.com/terms">Terms Of Use</a> | <a href="https://www.joblisting.com/privacy">Privacy</a> | <a href="https://www.joblisting.com/copyright">Copyright</a><br />
                                <p>If you want to opt out of receiving future emails from us, contact us at support@joblisting.com. If your Internet provider filters incoming email, please add support@joblisting.com to your list of approved senders. Please do not reply to this email as this is a computer-generated message. For further assistance, please contact us at support@joblisting.com</p>
                                <b>Disclaimer!</b>
                                <p>This is a genuine message/alert sent according to our <a href="https://www.joblisting.com/terms">Terms Of Use</a> and <a href="https://www.joblisting.com/privacy">Privacy</a>. Please do not reply to this email, as this is a computer-generated message/alert.	While all reasonable care has been taken in the preparation of the information contained in this email, Joblisting, Inc. or its related parties take no any responsibility for any action(s) taken on the basis of this message/alert, basis of the information contained herein or for any errors or omissions in that information. This email is intended for the use of the addressee only. If you are not the intended recipient of this message, kindly do not read or keep this message/alert with you and notify us at support@joblisting.com</p>
                                <p>You may have received this message/alert as "forward-to-a-friend" message. Joblisting, Inc. did not offer any kind of benefit and any gain to the forwarder or to the recommender and or did not give the forwarder or the recommender some other benefit in relation to sending you this message/alert. Also Joblisting, Inc. did not offer money, coupons, discounts,  awards, additional entries in a sweepstakes, any kind of benefit in exchange for generating traffic to website or the like in exchange for forwarding and or sending this message/alert and or recommending you in relation to this message/alert. </p>
                            </div>
            
                        </div>
                    </div>
                </body>
            </html> `
              }; 
              mailgun.messages().send(messageOptions, function (error, info) {
                if (error) {
                    console.log(error)
                    throw error;
                }else {
                  console.log('User profile1')
                }
            })

            }else{
                console.log("no mail")
            }

         }
     })
})

const user_profile_share2=schedule.scheduleJob('0 0 * * *',function(){             
    com = ",";
    var a="select STRING_AGG(cast(EmailID as NVARCHAR(MAX)),'"+com+"') as Email  FROM shareJMails where EmailID  LIKE '%@%.%' AND PATINDEX('%[^a-z,0-9,@,.,,\-]%',EmailID ) = 0 and Dt = convert(date,getdate()-2)"
      con.query(a,(er,rs)=>{
         if(er){
             console.log(er)
         }else{
            if(rs.recordset[0].Email!==null){
                var mailList=rs.recordset[0].Email
             let messageOptions = {
                from:process.env.MAIL,
                to:mailList,
                subject: `Shared job profiles`,
                html: `<html>
                <head>
                    <title></title>
                    <style>
                        #Container
                        {
                            background-color:white;
                            
                            border-radius: 4px;
                            border: 1px solid #e3e3e3;
                            text-align: justify;
                            padding:25px;
                        }
                        body
                        {
                            background-color: #f5f5f5;
                            text-align:center;
                            padding:10px;
                            font-family: Tahoma;
                        }
                    </style>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
                    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
                </head>
                <body style="background-color: #f5f5f5; text-align:center; padding:10px; font-family: Tahoma;">
                    <div style="text-align:left; padding-top:10px; padding-bottom:10px;">
                    </div>
            
                    <div id="Container">
                        <p>Hello</p><br />
                   <p>JobListing’s mission is to accelerate your job hunt. You can use the platform to access several job listings across the globe, find the job that suits your profile best, and boost your professional career.</p><br>  
                   <p>Ready to begin? Choose one of the options below:</p>
                        <div>
                        <ul>
                        <li style="color: LightSeaGreen;">Register</li>
                        <li style="color: OrangeRed;">Update Profile</li>
                        <li style="color: DodgerBlue ;">Apply Job</li>
                        </ul> <br>
                            <p style="margin-bottom: 0px;"><b>ALL THE BEST</b></p>
                            <br>
                            <p style="margin-bottom: 0px;">Thanks,</p>
                            <p>JobListing Team</p>
                            <div style="font-size: 12px;">
            
                                <a href="https://www.joblisting.com/terms">Terms Of Use</a> | <a href="https://www.joblisting.com/privacy">Privacy</a> | <a href="https://www.joblisting.com/copyright">Copyright</a><br />
                                <p>If you want to opt out of receiving future emails from us, contact us at support@joblisting.com. If your Internet provider filters incoming email, please add support@joblisting.com to your list of approved senders. Please do not reply to this email as this is a computer-generated message. For further assistance, please contact us at support@joblisting.com</p>
                                <b>Disclaimer!</b>
                                <p>This is a genuine message/alert sent according to our <a href="https://www.joblisting.com/terms">Terms Of Use</a> and <a href="https://www.joblisting.com/privacy">Privacy</a>. Please do not reply to this email, as this is a computer-generated message/alert.	While all reasonable care has been taken in the preparation of the information contained in this email, Joblisting, Inc. or its related parties take no any responsibility for any action(s) taken on the basis of this message/alert, basis of the information contained herein or for any errors or omissions in that information. This email is intended for the use of the addressee only. If you are not the intended recipient of this message, kindly do not read or keep this message/alert with you and notify us at support@joblisting.com</p>
                                <p>You may have received this message/alert as "forward-to-a-friend" message. Joblisting, Inc. did not offer any kind of benefit and any gain to the forwarder or to the recommender and or did not give the forwarder or the recommender some other benefit in relation to sending you this message/alert. Also Joblisting, Inc. did not offer money, coupons, discounts,  awards, additional entries in a sweepstakes, any kind of benefit in exchange for generating traffic to website or the like in exchange for forwarding and or sending this message/alert and or recommending you in relation to this message/alert. </p>
                            </div>
            
                        </div>
                    </div>
                </body>
            </html>`
              }; 
              mailgun.messages().send(messageOptions, function (error, info) {
                if (error) {
                    console.log(error)
                    throw error;
                }else {
                  console.log('User profile2')
                }
            })

            }else{
                console.log("no mail")
            }

         }
     })
})

const user_profile_share3=schedule.scheduleJob('0 0 * * *',function(){             
    com = ",";
    var a="select STRING_AGG(cast(EmailID as NVARCHAR(MAX)),'"+com+"') as Email  FROM shareJMails where EmailID  LIKE '%@%.%' AND PATINDEX('%[^a-z,0-9,@,.,,\-]%',EmailID ) = 0 and Dt = convert(date,getdate()-3)"
      con.query(a,(er,rs)=>{
         if(er){
             console.log(er)
         }else{
            if(rs.recordset[0].Email!==null){
             var mailList=rs.recordset[0].Email
             let messageOptions = {
                from:process.env.MAIL,
                to:mailList,
                subject: `Shared job profiles`,
                html: `<html>
                <head>
                    <title></title>
                    <style>
                        #Container
                        {
                            background-color:white;
                            
                            border-radius: 4px;
                            border: 1px solid #e3e3e3;
                            text-align: justify;
                            padding:25px;
                        }
                        body
                        {
                            background-color: #f5f5f5;
                            text-align:center;
                            padding:10px;
                            font-family: Tahoma;
                        }
                    </style>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
                    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
                </head>
                <body style="background-color: #f5f5f5; text-align:center; padding:10px; font-family: Tahoma;">
                    <div style="text-align:left; padding-top:10px; padding-bottom:10px;">
                    </div>
            
                    <div id="Container">
                        <p>Hello</p><br />
                   <p>JobListing’s mission is to accelerate your job hunt. You can use the platform to access several job listings across the globe, find the job that suits your profile best, and boost your professional career.</p><br>  
                   <p>Ready to begin? Choose one of the options below:</p>
                        <div>
                        <ul>
                        <li style="color: LightSeaGreen;">Register</li>
                        <li style="color: OrangeRed;">Update Profile</li>
                        <li style="color: DodgerBlue ;">Apply Job</li>
                        </ul> <br>
                            <p style="margin-bottom: 0px;"><b>ALL THE BEST</b></p>
                            <br>
                            <p style="margin-bottom: 0px;">Thanks,</p>
                            <p>JobListing Team</p>
                            <div style="font-size: 12px;">
            
                                <a href="https://www.joblisting.com/terms">Terms Of Use</a> | <a href="https://www.joblisting.com/privacy">Privacy</a> | <a href="https://www.joblisting.com/copyright">Copyright</a><br />
                                <p>If you want to opt out of receiving future emails from us, contact us at support@joblisting.com. If your Internet provider filters incoming email, please add support@joblisting.com to your list of approved senders. Please do not reply to this email as this is a computer-generated message. For further assistance, please contact us at support@joblisting.com</p>
                                <b>Disclaimer!</b>
                                <p>This is a genuine message/alert sent according to our <a href="https://www.joblisting.com/terms">Terms Of Use</a> and <a href="https://www.joblisting.com/privacy">Privacy</a>. Please do not reply to this email, as this is a computer-generated message/alert.	While all reasonable care has been taken in the preparation of the information contained in this email, Joblisting, Inc. or its related parties take no any responsibility for any action(s) taken on the basis of this message/alert, basis of the information contained herein or for any errors or omissions in that information. This email is intended for the use of the addressee only. If you are not the intended recipient of this message, kindly do not read or keep this message/alert with you and notify us at support@joblisting.com</p>
                                <p>You may have received this message/alert as "forward-to-a-friend" message. Joblisting, Inc. did not offer any kind of benefit and any gain to the forwarder or to the recommender and or did not give the forwarder or the recommender some other benefit in relation to sending you this message/alert. Also Joblisting, Inc. did not offer money, coupons, discounts,  awards, additional entries in a sweepstakes, any kind of benefit in exchange for generating traffic to website or the like in exchange for forwarding and or sending this message/alert and or recommending you in relation to this message/alert. </p>
                            </div>
            
                        </div>
                    </div>
                </body>
            </html> `
              }; 
              mailgun.messages().send(messageOptions, function (error, info) {
                if (error) {
                    console.log(error)
                    throw error;
                }else {
                  console.log('User profile3')
                }
            })

            }else{
                console.log("no mail")
            }

         }
     })
})

const user_profile_share4=schedule.scheduleJob('0 0 * * *',function(){             
    com = ",";
    var a="select STRING_AGG(cast(EmailID as NVARCHAR(MAX)),'"+com+"') as Email  FROM shareJMails where EmailID  LIKE '%@%.%' AND PATINDEX('%[^a-z,0-9,@,.,,\-]%',EmailID ) = 0 and Dt = convert(date,getdate()-4)"
      con.query(a,(er,rs)=>{
         if(er){
             console.log(er)
         }else{
            if(rs.recordset[0].Email!==null){
             var mailList=rs.recordset[0].Email
             let messageOptions = {
                from:process.env.MAIL,
                to:mailList,
                subject: `Shared job profiles`,
                html: `<html>
                <head>
                    <title></title>
                    <style>
                        #Container
                        {
                            background-color:white;
                            
                            border-radius: 4px;
                            border: 1px solid #e3e3e3;
                            text-align: justify;
                            padding:25px;
                        }
                        body
                        {
                            background-color: #f5f5f5;
                            text-align:center;
                            padding:10px;
                            font-family: Tahoma;
                        }
                    </style>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
                    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
                </head>
                <body style="background-color: #f5f5f5; text-align:center; padding:10px; font-family: Tahoma;">
                    <div style="text-align:left; padding-top:10px; padding-bottom:10px;">
                    </div>
            
                    <div id="Container">
                        <p>Hello</p><br />
                   <p>JobListing’s mission is to accelerate your job hunt. You can use the platform to access several job listings across the globe, find the job that suits your profile best, and boost your professional career.</p><br>  
                   <p>Ready to begin? Choose one of the options below:</p>
                        <div>
                        <ul>
                        <li style="color: LightSeaGreen;">Register</li>
                        <li style="color: OrangeRed;">Update Profile</li>
                        <li style="color: DodgerBlue ;">Apply Job</li>
                        </ul> <br>
                            <p style="margin-bottom: 0px;"><b>ALL THE BEST</b></p>
                            <br>
                            <p style="margin-bottom: 0px;">Thanks,</p>
                            <p>JobListing Team</p>
                            <div style="font-size: 12px;">
            
                                <a href="https://www.joblisting.com/terms">Terms Of Use</a> | <a href="https://www.joblisting.com/privacy">Privacy</a> | <a href="https://www.joblisting.com/copyright">Copyright</a><br />
                                <p>If you want to opt out of receiving future emails from us, contact us at support@joblisting.com. If your Internet provider filters incoming email, please add support@joblisting.com to your list of approved senders. Please do not reply to this email as this is a computer-generated message. For further assistance, please contact us at support@joblisting.com</p>
                                <b>Disclaimer!</b>
                                <p>This is a genuine message/alert sent according to our <a href="https://www.joblisting.com/terms">Terms Of Use</a> and <a href="https://www.joblisting.com/privacy">Privacy</a>. Please do not reply to this email, as this is a computer-generated message/alert.	While all reasonable care has been taken in the preparation of the information contained in this email, Joblisting, Inc. or its related parties take no any responsibility for any action(s) taken on the basis of this message/alert, basis of the information contained herein or for any errors or omissions in that information. This email is intended for the use of the addressee only. If you are not the intended recipient of this message, kindly do not read or keep this message/alert with you and notify us at support@joblisting.com</p>
                                <p>You may have received this message/alert as "forward-to-a-friend" message. Joblisting, Inc. did not offer any kind of benefit and any gain to the forwarder or to the recommender and or did not give the forwarder or the recommender some other benefit in relation to sending you this message/alert. Also Joblisting, Inc. did not offer money, coupons, discounts,  awards, additional entries in a sweepstakes, any kind of benefit in exchange for generating traffic to website or the like in exchange for forwarding and or sending this message/alert and or recommending you in relation to this message/alert. </p>
                            </div>
            
                        </div>
                    </div>
                </body>
            </html>
                `
              }; 
              mailgun.messages().send(messageOptions, function (error, info) {
                if (error) {
                    console.log(error)
                    throw error;
                }else {
                  console.log('User profile4')
                }
            })

            }else{
                console.log("no mail")
            }

         }
     })
})

const user_profile_share5=schedule.scheduleJob('0 0 * * *',function(){             
    com = ",";
    var a="select STRING_AGG(cast(EmailID as NVARCHAR(MAX)),'"+com+"') as Email  FROM shareJMails where EmailID  LIKE '%@%.%' AND PATINDEX('%[^a-z,0-9,@,.,,\-]%',EmailID ) = 0 and Dt = convert(date,getdate()-5)"
      con.query(a,(er,rs)=>{
         if(er){
             console.log(er)
         }else{
            if(rs.recordset[0].Email!==null){
            var mailList=rs.recordset[0].Email
            console.log(mailList)
             let messageOptions = {
                from:process.env.MAIL,
                to:mailList,
                subject: `Shared job profiles`,
                html: `<html>
                <head>
                    <title></title>
                    <style>
                        #Container
                        {
                            background-color:white;
                            
                            border-radius: 4px;
                            border: 1px solid #e3e3e3;
                            text-align: justify;
                            padding:25px;
                        }
                        body
                        {
                            background-color: #f5f5f5;
                            text-align:center;
                            padding:10px;
                            font-family: Tahoma;
                        }
                    </style>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
                    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
                </head>
                <body style="background-color: #f5f5f5; text-align:center; padding:10px; font-family: Tahoma;">
                    <div style="text-align:left; padding-top:10px; padding-bottom:10px;">
                    </div>
            
                    <div id="Container">
                        <p>Hello</p><br />
                   <p>JobListing’s mission is to accelerate your job hunt. You can use the platform to access several job listings across the globe, find the job that suits your profile best, and boost your professional career.</p><br>  
                   <p>Ready to begin? Choose one of the options below:</p>
                        <div>
                        <ul>
                        <li style="color: LightSeaGreen;">Register</li>
                        <li style="color: OrangeRed;">Update Profile</li>
                        <li style="color: DodgerBlue ;">Apply Job</li>
                        </ul> <br>
                            <p style="margin-bottom: 0px;"><b>ALL THE BEST</b></p>
                            <br>
                            <p style="margin-bottom: 0px;">Thanks,</p>
                            <p>JobListing Team</p>
                            <div style="font-size: 12px;">
            
                                <a href="https://www.joblisting.com/terms">Terms Of Use</a> | <a href="https://www.joblisting.com/privacy">Privacy</a> | <a href="https://www.joblisting.com/copyright">Copyright</a><br />
                                <p>If you want to opt out of receiving future emails from us, contact us at support@joblisting.com. If your Internet provider filters incoming email, please add support@joblisting.com to your list of approved senders. Please do not reply to this email as this is a computer-generated message. For further assistance, please contact us at support@joblisting.com</p>
                                <b>Disclaimer!</b>
                                <p>This is a genuine message/alert sent according to our <a href="https://www.joblisting.com/terms">Terms Of Use</a> and <a href="https://www.joblisting.com/privacy">Privacy</a>. Please do not reply to this email, as this is a computer-generated message/alert.	While all reasonable care has been taken in the preparation of the information contained in this email, Joblisting, Inc. or its related parties take no any responsibility for any action(s) taken on the basis of this message/alert, basis of the information contained herein or for any errors or omissions in that information. This email is intended for the use of the addressee only. If you are not the intended recipient of this message, kindly do not read or keep this message/alert with you and notify us at support@joblisting.com</p>
                                <p>You may have received this message/alert as "forward-to-a-friend" message. Joblisting, Inc. did not offer any kind of benefit and any gain to the forwarder or to the recommender and or did not give the forwarder or the recommender some other benefit in relation to sending you this message/alert. Also Joblisting, Inc. did not offer money, coupons, discounts,  awards, additional entries in a sweepstakes, any kind of benefit in exchange for generating traffic to website or the like in exchange for forwarding and or sending this message/alert and or recommending you in relation to this message/alert. </p>
                            </div>
            
                        </div>
                    </div>
                </body>
            </html>
                `
              }; 
              mailgun.messages().send(messageOptions, function (error, info) {
                if (error) {
                    console.log(error)
                    throw error;
                }else {
                  console.log('User profile5')
                }
            })

            }else{
                console.log("no mail5")
            }

         }
     })
})

const user_profile_share6=schedule.scheduleJob('0 0 * * *',function(){             
    com = ",";
    var a="select STRING_AGG(cast(EmailID as NVARCHAR(MAX)),'"+com+"') as Email  FROM shareJMails where EmailID  LIKE '%@%.%' AND PATINDEX('%[^a-z,0-9,@,.,,\-]%',EmailID ) = 0 and Dt = convert(date,getdate()-6)"
      con.query(a,(er,rs)=>{
         if(er){
             console.log(er)
         }else{
            if(rs.recordset[0].Email!==null){
             var mailList=rs.recordset[0].Email
             let messageOptions = {
                from:process.env.MAIL,
                to:mailList,
                subject: `Shared job profiles`,
                html: `<html>
                <head>
                    <title></title>
                    <style>
                        #Container
                        {
                            background-color:white;
                            
                            border-radius: 4px;
                            border: 1px solid #e3e3e3;
                            text-align: justify;
                            padding:25px;
                        }
                        body
                        {
                            background-color: #f5f5f5;
                            text-align:center;
                            padding:10px;
                            font-family: Tahoma;
                        }
                    </style>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
                    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
                </head>
                <body style="background-color: #f5f5f5; text-align:center; padding:10px; font-family: Tahoma;">
                    <div style="text-align:left; padding-top:10px; padding-bottom:10px;">
                    </div>
            
                    <div id="Container">
                        <p>Hello</p><br />
                   <p>JobListing’s mission is to accelerate your job hunt. You can use the platform to access several job listings across the globe, find the job that suits your profile best, and boost your professional career.</p><br>  
                   <p>Ready to begin? Choose one of the options below:</p>
                        <div>
                        <ul>
                        <li style="color: LightSeaGreen;">Register</li>
                        <li style="color: OrangeRed;">Update Profile</li>
                        <li style="color: DodgerBlue ;">Apply Job</li>
                        </ul> <br>
                            <p style="margin-bottom: 0px;"><b>ALL THE BEST</b></p>
                            <br>
                            <p style="margin-bottom: 0px;">Thanks,</p>
                            <p>JobListing Team</p>
                            <div style="font-size: 12px;">
            
                                <a href="https://www.joblisting.com/terms">Terms Of Use</a> | <a href="https://www.joblisting.com/privacy">Privacy</a> | <a href="https://www.joblisting.com/copyright">Copyright</a><br />
                                <p>If you want to opt out of receiving future emails from us, contact us at support@joblisting.com. If your Internet provider filters incoming email, please add support@joblisting.com to your list of approved senders. Please do not reply to this email as this is a computer-generated message. For further assistance, please contact us at support@joblisting.com</p>
                                <b>Disclaimer!</b>
                                <p>This is a genuine message/alert sent according to our <a href="https://www.joblisting.com/terms">Terms Of Use</a> and <a href="https://www.joblisting.com/privacy">Privacy</a>. Please do not reply to this email, as this is a computer-generated message/alert.	While all reasonable care has been taken in the preparation of the information contained in this email, Joblisting, Inc. or its related parties take no any responsibility for any action(s) taken on the basis of this message/alert, basis of the information contained herein or for any errors or omissions in that information. This email is intended for the use of the addressee only. If you are not the intended recipient of this message, kindly do not read or keep this message/alert with you and notify us at support@joblisting.com</p>
                                <p>You may have received this message/alert as "forward-to-a-friend" message. Joblisting, Inc. did not offer any kind of benefit and any gain to the forwarder or to the recommender and or did not give the forwarder or the recommender some other benefit in relation to sending you this message/alert. Also Joblisting, Inc. did not offer money, coupons, discounts,  awards, additional entries in a sweepstakes, any kind of benefit in exchange for generating traffic to website or the like in exchange for forwarding and or sending this message/alert and or recommending you in relation to this message/alert. </p>
                            </div>
            
                        </div>
                    </div>
                </body>
            </html>
                `
              }; 
              mailgun.messages().send(messageOptions, function (error, info) {
                if (error) {
                    console.log(error)
                    throw error;
                }else {
                  console.log('User profile6')
                }
            })

            }else{
                console.log("no mail6")
            }

         }
     })
})

const user_profile_share7=schedule.scheduleJob('0 0 * * *',function(){             
    com = ",";
    var a="select STRING_AGG(cast(EmailID as NVARCHAR(MAX)),'"+com+"') as Email  FROM shareJMails where EmailID  LIKE '%@%.%' AND PATINDEX('%[^a-z,0-9,@,.,,\-]%',EmailID ) = 0 and Dt = convert(date,getdate()-7)"
      con.query(a,(er,rs)=>{
         if(er){
             console.log(er)
         }else{
            if(rs.recordset[0].Email!==null){
            var mailList=rs.recordset[0].Email
             let messageOptions = {
                from:process.env.MAIL,
                to:mailList,
                subject: `Shared job profiles`,
                html: `<html>
                <head>
                    <title></title>
                    <style>
                        #Container
                        {
                            background-color:white;
                            
                            border-radius: 4px;
                            border: 1px solid #e3e3e3;
                            text-align: justify;
                            padding:25px;
                        }
                        body
                        {
                            background-color: #f5f5f5;
                            text-align:center;
                            padding:10px;
                            font-family: Tahoma;
                        }
                    </style>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
                    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
                </head>
                <body style="background-color: #f5f5f5; text-align:center; padding:10px; font-family: Tahoma;">
                    <div style="text-align:left; padding-top:10px; padding-bottom:10px;">
                    </div>
            
                    <div id="Container">
                        <p>Hello</p><br />
                   <p>JobListing’s mission is to accelerate your job hunt. You can use the platform to access several job listings across the globe, find the job that suits your profile best, and boost your professional career.</p><br>  
                   <p>Ready to begin? Choose one of the options below:</p>
                        <div>
                        <ul>
                        <li style="color: LightSeaGreen;">Register</li>
                        <li style="color: OrangeRed;">Update Profile</li>
                        <li style="color: DodgerBlue ;">Apply Job</li>
                        </ul> <br>
                            <p style="margin-bottom: 0px;"><b>ALL THE BEST</b></p>
                            <br>
                            <p style="margin-bottom: 0px;">Thanks,</p>
                            <p>JobListing Team</p>
                            <div style="font-size: 12px;">
            
                                <a href="https://www.joblisting.com/terms">Terms Of Use</a> | <a href="https://www.joblisting.com/privacy">Privacy</a> | <a href="https://www.joblisting.com/copyright">Copyright</a><br />
                                <p>If you want to opt out of receiving future emails from us, contact us at support@joblisting.com. If your Internet provider filters incoming email, please add support@joblisting.com to your list of approved senders. Please do not reply to this email as this is a computer-generated message. For further assistance, please contact us at support@joblisting.com</p>
                                <b>Disclaimer!</b>
                                <p>This is a genuine message/alert sent according to our <a href="https://www.joblisting.com/terms">Terms Of Use</a> and <a href="https://www.joblisting.com/privacy">Privacy</a>. Please do not reply to this email, as this is a computer-generated message/alert.	While all reasonable care has been taken in the preparation of the information contained in this email, Joblisting, Inc. or its related parties take no any responsibility for any action(s) taken on the basis of this message/alert, basis of the information contained herein or for any errors or omissions in that information. This email is intended for the use of the addressee only. If you are not the intended recipient of this message, kindly do not read or keep this message/alert with you and notify us at support@joblisting.com</p>
                                <p>You may have received this message/alert as "forward-to-a-friend" message. Joblisting, Inc. did not offer any kind of benefit and any gain to the forwarder or to the recommender and or did not give the forwarder or the recommender some other benefit in relation to sending you this message/alert. Also Joblisting, Inc. did not offer money, coupons, discounts,  awards, additional entries in a sweepstakes, any kind of benefit in exchange for generating traffic to website or the like in exchange for forwarding and or sending this message/alert and or recommending you in relation to this message/alert. </p>
                            </div>
            
                        </div>
                    </div>
                </body>
            </html>
                `
              }; 
              mailgun.messages().send(messageOptions, function (error, info) {
                if (error) {
                    console.log(error)
                    throw error;
                }else {
                  console.log('User profile7')
                }
            })

            }else{
                console.log("no mail7")
            }

         }
     })
})

const user_profile_share8=schedule.scheduleJob('0 0 * * *',function(){             
    com = ",";
    var a="select STRING_AGG(cast(EmailID as NVARCHAR(MAX)),'"+com+"') as Email  FROM shareJMails where EmailID  LIKE '%@%.%' AND PATINDEX('%[^a-z,0-9,@,.,,\-]%',EmailID ) = 0 and Dt = convert(date,getdate()-8)"
      con.query(a,(er,rs)=>{
         if(er){
             console.log(er)
         }else{
            if(rs.recordset[0].Email!==null){
            var mailList=rs.recordset[0].Email 
            console.log(mailList)
             let messageOptions = {
                from:process.env.MAIL,
                to:mailList,
                subject: `Shared job profiles`,
                html: `<html>
                <head>
                    <title></title>
                    <style>
                        #Container
                        {
                            background-color:white;
                            
                            border-radius: 4px;
                            border: 1px solid #e3e3e3;
                            text-align: justify;
                            padding:25px;
                        }
                        body
                        {
                            background-color: #f5f5f5;
                            text-align:center;
                            padding:10px;
                            font-family: Tahoma;
                        }
                    </style>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
                    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
                </head>
                <body style="background-color: #f5f5f5; text-align:center; padding:10px; font-family: Tahoma;">
                    <div style="text-align:left; padding-top:10px; padding-bottom:10px;">
                    </div>
            
                    <div id="Container">
                        <p>Hello</p><br />
                   <p>JobListing’s mission is to accelerate your job hunt. You can use the platform to access several job listings across the globe, find the job that suits your profile best, and boost your professional career.</p><br>  
                   <p>Ready to begin? Choose one of the options below:</p>
                        <div>
                        <ul>
                        <li style="color: LightSeaGreen;">Register</li>
                        <li style="color: OrangeRed;">Update Profile</li>
                        <li style="color: DodgerBlue ;">Apply Job</li>
                        </ul> <br>
                            <p style="margin-bottom: 0px;"><b>ALL THE BEST</b></p>
                            <br>
                            <p style="margin-bottom: 0px;">Thanks,</p>
                            <p>JobListing Team</p>
                            <div style="font-size: 12px;">
            
                                <a href="https://www.joblisting.com/terms">Terms Of Use</a> | <a href="https://www.joblisting.com/privacy">Privacy</a> | <a href="https://www.joblisting.com/copyright">Copyright</a><br />
                                <p>If you want to opt out of receiving future emails from us, contact us at support@joblisting.com. If your Internet provider filters incoming email, please add support@joblisting.com to your list of approved senders. Please do not reply to this email as this is a computer-generated message. For further assistance, please contact us at support@joblisting.com</p>
                                <b>Disclaimer!</b>
                                <p>This is a genuine message/alert sent according to our <a href="https://www.joblisting.com/terms">Terms Of Use</a> and <a href="https://www.joblisting.com/privacy">Privacy</a>. Please do not reply to this email, as this is a computer-generated message/alert.	While all reasonable care has been taken in the preparation of the information contained in this email, Joblisting, Inc. or its related parties take no any responsibility for any action(s) taken on the basis of this message/alert, basis of the information contained herein or for any errors or omissions in that information. This email is intended for the use of the addressee only. If you are not the intended recipient of this message, kindly do not read or keep this message/alert with you and notify us at support@joblisting.com</p>
                                <p>You may have received this message/alert as "forward-to-a-friend" message. Joblisting, Inc. did not offer any kind of benefit and any gain to the forwarder or to the recommender and or did not give the forwarder or the recommender some other benefit in relation to sending you this message/alert. Also Joblisting, Inc. did not offer money, coupons, discounts,  awards, additional entries in a sweepstakes, any kind of benefit in exchange for generating traffic to website or the like in exchange for forwarding and or sending this message/alert and or recommending you in relation to this message/alert. </p>
                            </div>
            
                        </div>
                    </div>
                </body>
            </html>
                `
              }; 
              mailgun.messages().send(messageOptions, function (error, info) {
                if (error) {
                    console.log(error)
                    throw error;
                }else {
                  console.log('User profile8')
                }
            })

            }else{
                console.log("no mail8")
            }

         }
     })
})

const user_profile_share9=schedule.scheduleJob('0 0 0 * * *',function(){             
    com = ",";
    var a="select STRING_AGG(cast(EmailID as NVARCHAR(MAX)),'"+com+"') as Email  FROM shareJMails where EmailID  LIKE '%@%.%' AND PATINDEX('%[^a-z,0-9,@,.,,\-]%',EmailID ) = 0 and Dt = convert(date,getdate()-9)"
      con.query(a,(er,rs)=>{
         if(er){
             console.log(er)
         }else{
            if(rs.recordset[0].Email!==null){
                console.log("9 is called")
                var mailList=rs.recordset[0].Email   
             let messageOptions = {
                from:process.env.MAIL,
                to:mailList,
                subject: `Shared job profiles`,
                html: `<html>
                <head>
                    <title></title>
                    <style>
                        #Container
                        {
                            background-color:white;
                            
                            border-radius: 4px;
                            border: 1px solid #e3e3e3;
                            text-align: justify;
                            padding:25px;
                        }
                        body
                        {
                            background-color: #f5f5f5;
                            text-align:center;
                            padding:10px;
                            font-family: Tahoma;
                        }
                    </style>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
                    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
                </head>
                <body style="background-color: #f5f5f5; text-align:center; padding:10px; font-family: Tahoma;">
                    <div style="text-align:left; padding-top:10px; padding-bottom:10px;">
                    </div>
            
                    <div id="Container">
                        <p>Hello</p><br />
                   <p>JobListing’s mission is to accelerate your job hunt. You can use the platform to access several job listings across the globe, find the job that suits your profile best, and boost your professional career.</p><br>  
                   <p>Ready to begin? Choose one of the options below:</p>
                        <div>
                        <ul>
                        <li style="color: LightSeaGreen;">Register</li>
                        <li style="color: OrangeRed;">Update Profile</li>
                        <li style="color: DodgerBlue ;">Apply Job</li>
                        </ul> <br>
                            <p style="margin-bottom: 0px;"><b>ALL THE BEST</b></p>
                            <br>
                            <p style="margin-bottom: 0px;">Thanks,</p>
                            <p>JobListing Team</p>
                            <div style="font-size: 12px;">
            
                                <a href="https://www.joblisting.com/terms">Terms Of Use</a> | <a href="https://www.joblisting.com/privacy">Privacy</a> | <a href="https://www.joblisting.com/copyright">Copyright</a><br />
                                <p>If you want to opt out of receiving future emails from us, contact us at support@joblisting.com. If your Internet provider filters incoming email, please add support@joblisting.com to your list of approved senders. Please do not reply to this email as this is a computer-generated message. For further assistance, please contact us at support@joblisting.com</p>
                                <b>Disclaimer!</b>
                                <p>This is a genuine message/alert sent according to our <a href="https://www.joblisting.com/terms">Terms Of Use</a> and <a href="https://www.joblisting.com/privacy">Privacy</a>. Please do not reply to this email, as this is a computer-generated message/alert.	While all reasonable care has been taken in the preparation of the information contained in this email, Joblisting, Inc. or its related parties take no any responsibility for any action(s) taken on the basis of this message/alert, basis of the information contained herein or for any errors or omissions in that information. This email is intended for the use of the addressee only. If you are not the intended recipient of this message, kindly do not read or keep this message/alert with you and notify us at support@joblisting.com</p>
                                <p>You may have received this message/alert as "forward-to-a-friend" message. Joblisting, Inc. did not offer any kind of benefit and any gain to the forwarder or to the recommender and or did not give the forwarder or the recommender some other benefit in relation to sending you this message/alert. Also Joblisting, Inc. did not offer money, coupons, discounts,  awards, additional entries in a sweepstakes, any kind of benefit in exchange for generating traffic to website or the like in exchange for forwarding and or sending this message/alert and or recommending you in relation to this message/alert. </p>
                            </div>
            
                        </div>
                    </div>
                </body>
            </html>
                `
              }; 
              mailgun.messages().send(messageOptions, function (error, info) {
                if (error) {
                    console.log(error)
                    throw error;
                }else {
                  console.log('User profile9')
                }
            })

            }else{
                console.log("no mail9")
            }

         }
     })
})

const user_profile_share10=schedule.scheduleJob('0 0 * * *',function(){             
    com = ",";
    var a="select STRING_AGG(cast(EmailID as NVARCHAR(MAX)),'"+com+"') as Email  FROM shareJMails where EmailID  LIKE '%@%.%' AND PATINDEX('%[^a-z,0-9,@,.,,\-]%',EmailID ) = 0 and Dt = convert(date,getdate()-10)"
      con.query(a,(er,rs)=>{
         if(er){
             console.log(er)
         }else{
            if(rs.recordset[0].Email!==null){
            var mailList=rs.recordset[0].Email    
             let messageOptions = {
                from:process.env.MAIL,
                to:mailList,
                subject: `Shared job profiles`,
                html: `<html>
                <head>
                    <title></title>
                    <style>
                        #Container
                        {
                            background-color:white;
                            
                            border-radius: 4px;
                            border: 1px solid #e3e3e3;
                            text-align: justify;
                            padding:25px;
                        }
                        body
                        {
                            background-color: #f5f5f5;
                            text-align:center;
                            padding:10px;
                            font-family: Tahoma;
                        }
                    </style>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
                    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
                </head>
                <body style="background-color: #f5f5f5; text-align:center; padding:10px; font-family: Tahoma;">
                    <div style="text-align:left; padding-top:10px; padding-bottom:10px;">
                    </div>
            
                    <div id="Container">
                        <p>Hello</p><br />
                   <p>JobListing’s mission is to accelerate your job hunt. You can use the platform to access several job listings across the globe, find the job that suits your profile best, and boost your professional career.</p><br>  
                   <p>Ready to begin? Choose one of the options below:</p>
                        <div>
                        <ul>
                        <li style="color: LightSeaGreen;">Register</li>
                        <li style="color: OrangeRed;">Update Profile</li>
                        <li style="color: DodgerBlue ;">Apply Job</li>
                        </ul> <br>
                            <p style="margin-bottom: 0px;"><b>ALL THE BEST</b></p>
                            <br>
                            <p style="margin-bottom: 0px;">Thanks,</p>
                            <p>JobListing Team</p>
                            <div style="font-size: 12px;">
            
                                <a href="https://www.joblisting.com/terms">Terms Of Use</a> | <a href="https://www.joblisting.com/privacy">Privacy</a> | <a href="https://www.joblisting.com/copyright">Copyright</a><br />
                                <p>If you want to opt out of receiving future emails from us, contact us at support@joblisting.com. If your Internet provider filters incoming email, please add support@joblisting.com to your list of approved senders. Please do not reply to this email as this is a computer-generated message. For further assistance, please contact us at support@joblisting.com</p>
                                <b>Disclaimer!</b>
                                <p>This is a genuine message/alert sent according to our <a href="https://www.joblisting.com/terms">Terms Of Use</a> and <a href="https://www.joblisting.com/privacy">Privacy</a>. Please do not reply to this email, as this is a computer-generated message/alert.	While all reasonable care has been taken in the preparation of the information contained in this email, Joblisting, Inc. or its related parties take no any responsibility for any action(s) taken on the basis of this message/alert, basis of the information contained herein or for any errors or omissions in that information. This email is intended for the use of the addressee only. If you are not the intended recipient of this message, kindly do not read or keep this message/alert with you and notify us at support@joblisting.com</p>
                                <p>You may have received this message/alert as "forward-to-a-friend" message. Joblisting, Inc. did not offer any kind of benefit and any gain to the forwarder or to the recommender and or did not give the forwarder or the recommender some other benefit in relation to sending you this message/alert. Also Joblisting, Inc. did not offer money, coupons, discounts,  awards, additional entries in a sweepstakes, any kind of benefit in exchange for generating traffic to website or the like in exchange for forwarding and or sending this message/alert and or recommending you in relation to this message/alert. </p>
                            </div>
            
                        </div>
                    </div>
                </body>
            </html>
                `
              }; 
              mailgun.messages().send(messageOptions, function (error, info) {
                if (error) {
                    console.log(error)
                    throw error;
                }else {
                  console.log('User profile10')
                }
            })

            }else{
                console.log("no mail10")
            }

         }
     })
})

const user_profile_share11=schedule.scheduleJob('0 0 * * *',function(){             
    com = ",";
    var a="select STRING_AGG(cast(EmailID as NVARCHAR(MAX)),'"+com+"') as Email  FROM shareJMails where EmailID  LIKE '%@%.%' AND PATINDEX('%[^a-z,0-9,@,.,,\-]%',EmailID ) = 0 and Dt = convert(date,getdate()-11)"
      con.query(a,(er,rs)=>{
         if(er){
             console.log(er)
         }else{
            if(rs.recordset[0].Email!==null){
            var mailList=rs.recordset[0].Email
             let messageOptions = {
                from:process.env.MAIL,
                to:mailList,
                subject: `Shared job profiles`,
                html: `<html>
                <head>
                    <title></title>
                    <style>
                        #Container
                        {
                            background-color:white;
                            
                            border-radius: 4px;
                            border: 1px solid #e3e3e3;
                            text-align: justify;
                            padding:25px;
                        }
                        body
                        {
                            background-color: #f5f5f5;
                            text-align:center;
                            padding:10px;
                            font-family: Tahoma;
                        }
                    </style>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
                    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
                </head>
                <body style="background-color: #f5f5f5; text-align:center; padding:10px; font-family: Tahoma;">
                    <div style="text-align:left; padding-top:10px; padding-bottom:10px;">
                    </div>
            
                    <div id="Container">
                        <p>Hello</p><br />
                   <p>JobListing’s mission is to accelerate your job hunt. You can use the platform to access several job listings across the globe, find the job that suits your profile best, and boost your professional career.</p><br>  
                   <p>Ready to begin? Choose one of the options below:</p>
                        <div>
                        <ul>
                        <li style="color: LightSeaGreen;">Register</li>
                        <li style="color: OrangeRed;">Update Profile</li>
                        <li style="color: DodgerBlue ;">Apply Job</li>
                        </ul> <br>
                            <p style="margin-bottom: 0px;"><b>ALL THE BEST</b></p>
                            <br>
                            <p style="margin-bottom: 0px;">Thanks,</p>
                            <p>JobListing Team</p>
                            <div style="font-size: 12px;">
            
                                <a href="https://www.joblisting.com/terms">Terms Of Use</a> | <a href="https://www.joblisting.com/privacy">Privacy</a> | <a href="https://www.joblisting.com/copyright">Copyright</a><br />
                                <p>If you want to opt out of receiving future emails from us, contact us at support@joblisting.com. If your Internet provider filters incoming email, please add support@joblisting.com to your list of approved senders. Please do not reply to this email as this is a computer-generated message. For further assistance, please contact us at support@joblisting.com</p>
                                <b>Disclaimer!</b>
                                <p>This is a genuine message/alert sent according to our <a href="https://www.joblisting.com/terms">Terms Of Use</a> and <a href="https://www.joblisting.com/privacy">Privacy</a>. Please do not reply to this email, as this is a computer-generated message/alert.	While all reasonable care has been taken in the preparation of the information contained in this email, Joblisting, Inc. or its related parties take no any responsibility for any action(s) taken on the basis of this message/alert, basis of the information contained herein or for any errors or omissions in that information. This email is intended for the use of the addressee only. If you are not the intended recipient of this message, kindly do not read or keep this message/alert with you and notify us at support@joblisting.com</p>
                                <p>You may have received this message/alert as "forward-to-a-friend" message. Joblisting, Inc. did not offer any kind of benefit and any gain to the forwarder or to the recommender and or did not give the forwarder or the recommender some other benefit in relation to sending you this message/alert. Also Joblisting, Inc. did not offer money, coupons, discounts,  awards, additional entries in a sweepstakes, any kind of benefit in exchange for generating traffic to website or the like in exchange for forwarding and or sending this message/alert and or recommending you in relation to this message/alert. </p>
                            </div>
            
                        </div>
                    </div>
                </body>
            </html>
                `
              }; 
              mailgun.messages().send(messageOptions, function (error, info) {
                if (error) {
                    console.log(error)
                    throw error;
                }else {
                  console.log('User profile11')
                }
            })

            }else{
                console.log("no mail11")
            }

         }
     })
})

const user_profile_share12=schedule.scheduleJob('0 0 * * *',function(){             
    com = ",";
    var a="select STRING_AGG(cast(EmailID as NVARCHAR(MAX)),'"+com+"') as Email  FROM shareJMails where EmailID  LIKE '%@%.%' AND PATINDEX('%[^a-z,0-9,@,.,,\-]%',EmailID ) = 0 and Dt = convert(date,getdate()-12)"
      con.query(a,(er,rs)=>{
         if(er){
             console.log(er)
         }else{
            if(rs.recordset[0].Email!==null){
             var mailList=rs.recordset[0].Email
             let messageOptions = {
                from:process.env.MAIL,
                to:mailList,
                subject: `Shared job profiles`,
                html: `<html>
                <head>
                    <title></title>
                    <style>
                        #Container
                        {
                            background-color:white;
                            
                            border-radius: 4px;
                            border: 1px solid #e3e3e3;
                            text-align: justify;
                            padding:25px;
                        }
                        body
                        {
                            background-color: #f5f5f5;
                            text-align:center;
                            padding:10px;
                            font-family: Tahoma;
                        }
                    </style>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
                    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
                </head>
                <body style="background-color: #f5f5f5; text-align:center; padding:10px; font-family: Tahoma;">
                    <div style="text-align:left; padding-top:10px; padding-bottom:10px;">
                    </div>
            
                    <div id="Container">
                        <p>Hello</p><br />
                   <p>JobListing’s mission is to accelerate your job hunt. You can use the platform to access several job listings across the globe, find the job that suits your profile best, and boost your professional career.</p><br>  
                   <p>Ready to begin? Choose one of the options below:</p>
                        <div>
                        <ul>
                        <li style="color: LightSeaGreen;">Register</li>
                        <li style="color: OrangeRed;">Update Profile</li>
                        <li style="color: DodgerBlue ;">Apply Job</li>
                        </ul> <br>
                            <p style="margin-bottom: 0px;"><b>ALL THE BEST</b></p>
                            <br>
                            <p style="margin-bottom: 0px;">Thanks,</p>
                            <p>JobListing Team</p>
                            <div style="font-size: 12px;">
            
                                <a href="https://www.joblisting.com/terms">Terms Of Use</a> | <a href="https://www.joblisting.com/privacy">Privacy</a> | <a href="https://www.joblisting.com/copyright">Copyright</a><br />
                                <p>If you want to opt out of receiving future emails from us, contact us at support@joblisting.com. If your Internet provider filters incoming email, please add support@joblisting.com to your list of approved senders. Please do not reply to this email as this is a computer-generated message. For further assistance, please contact us at support@joblisting.com</p>
                                <b>Disclaimer!</b>
                                <p>This is a genuine message/alert sent according to our <a href="https://www.joblisting.com/terms">Terms Of Use</a> and <a href="https://www.joblisting.com/privacy">Privacy</a>. Please do not reply to this email, as this is a computer-generated message/alert.	While all reasonable care has been taken in the preparation of the information contained in this email, Joblisting, Inc. or its related parties take no any responsibility for any action(s) taken on the basis of this message/alert, basis of the information contained herein or for any errors or omissions in that information. This email is intended for the use of the addressee only. If you are not the intended recipient of this message, kindly do not read or keep this message/alert with you and notify us at support@joblisting.com</p>
                                <p>You may have received this message/alert as "forward-to-a-friend" message. Joblisting, Inc. did not offer any kind of benefit and any gain to the forwarder or to the recommender and or did not give the forwarder or the recommender some other benefit in relation to sending you this message/alert. Also Joblisting, Inc. did not offer money, coupons, discounts,  awards, additional entries in a sweepstakes, any kind of benefit in exchange for generating traffic to website or the like in exchange for forwarding and or sending this message/alert and or recommending you in relation to this message/alert. </p>
                            </div>
            
                        </div>
                    </div>
                </body>
            </html>
                `
              }; 
              mailgun.messages().send(messageOptions, function (error, info) {
                if (error) {
                    console.log(error)
                    throw error;
                }else {
                  console.log('User profile12')
                }
            })

            }else{
                console.log("no mail12")
            }

         }
     })
})

const user_profile_share13=schedule.scheduleJob('0 0 * * *',function(){             
    com = ",";
    var a="select STRING_AGG(cast(EmailID as NVARCHAR(MAX)),'"+com+"') as Email  FROM shareJMails where EmailID  LIKE '%@%.%' AND PATINDEX('%[^a-z,0-9,@,.,,\-]%',EmailID ) = 0 and Dt = convert(date,getdate()-13)"
      con.query(a,(er,rs)=>{
         if(er){
             console.log(er)
         }else{
            if(rs.recordset[0].Email!==null){
            var mailList=rs.recordset[0].Email
             let messageOptions = {
                from:process.env.MAIL,
                to:mailList,
                subject: `Shared job profiles`,
                html: `<html>
                <head>
                    <title></title>
                    <style>
                        #Container
                        {
                            background-color:white;
                            
                            border-radius: 4px;
                            border: 1px solid #e3e3e3;
                            text-align: justify;
                            padding:25px;
                        }
                        body
                        {
                            background-color: #f5f5f5;
                            text-align:center;
                            padding:10px;
                            font-family: Tahoma;
                        }
                    </style>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
                    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
                </head>
                <body style="background-color: #f5f5f5; text-align:center; padding:10px; font-family: Tahoma;">
                    <div style="text-align:left; padding-top:10px; padding-bottom:10px;">
                    </div>
            
                    <div id="Container">
                        <p>Hello</p><br />
                   <p>JobListing’s mission is to accelerate your job hunt. You can use the platform to access several job listings across the globe, find the job that suits your profile best, and boost your professional career.</p><br>  
                   <p>Ready to begin? Choose one of the options below:</p>
                        <div>
                        <ul>
                        <li style="color: LightSeaGreen;">Register</li>
                        <li style="color: OrangeRed;">Update Profile</li>
                        <li style="color: DodgerBlue ;">Apply Job</li>
                        </ul> <br>
                            <p style="margin-bottom: 0px;"><b>ALL THE BEST</b></p>
                            <br>
                            <p style="margin-bottom: 0px;">Thanks,</p>
                            <p>JobListing Team</p>
                            <div style="font-size: 12px;">
            
                                <a href="https://www.joblisting.com/terms">Terms Of Use</a> | <a href="https://www.joblisting.com/privacy">Privacy</a> | <a href="https://www.joblisting.com/copyright">Copyright</a><br />
                                <p>If you want to opt out of receiving future emails from us, contact us at support@joblisting.com. If your Internet provider filters incoming email, please add support@joblisting.com to your list of approved senders. Please do not reply to this email as this is a computer-generated message. For further assistance, please contact us at support@joblisting.com</p>
                                <b>Disclaimer!</b>
                                <p>This is a genuine message/alert sent according to our <a href="https://www.joblisting.com/terms">Terms Of Use</a> and <a href="https://www.joblisting.com/privacy">Privacy</a>. Please do not reply to this email, as this is a computer-generated message/alert.	While all reasonable care has been taken in the preparation of the information contained in this email, Joblisting, Inc. or its related parties take no any responsibility for any action(s) taken on the basis of this message/alert, basis of the information contained herein or for any errors or omissions in that information. This email is intended for the use of the addressee only. If you are not the intended recipient of this message, kindly do not read or keep this message/alert with you and notify us at support@joblisting.com</p>
                                <p>You may have received this message/alert as "forward-to-a-friend" message. Joblisting, Inc. did not offer any kind of benefit and any gain to the forwarder or to the recommender and or did not give the forwarder or the recommender some other benefit in relation to sending you this message/alert. Also Joblisting, Inc. did not offer money, coupons, discounts,  awards, additional entries in a sweepstakes, any kind of benefit in exchange for generating traffic to website or the like in exchange for forwarding and or sending this message/alert and or recommending you in relation to this message/alert. </p>
                            </div>
            
                        </div>
                    </div>
                </body>
            </html>
                `
              }; 
              mailgun.messages().send(messageOptions, function (error, info) {
                if (error) {
                    console.log(error)
                    throw error;
                }else {
                  console.log('User profile13')
                }
            })

            }else{
                console.log("no mail13")
            }

         }
     })
})

const user_profile_share14=schedule.scheduleJob('0 0 * * *',function(){             
    com = ",";
    var a="select STRING_AGG(cast(EmailID as NVARCHAR(MAX)),'"+com+"') as Email  FROM shareJMails where EmailID  LIKE '%@%.%' AND PATINDEX('%[^a-z,0-9,@,.,,\-]%',EmailID ) = 0 and Dt = convert(date,getdate()-14)"
      con.query(a,(er,rs)=>{
         if(er){
             console.log(er)
         }else{
            if(rs.recordset[0].Email!==null){
                var mailList=rs.recordset[0].Email
             let messageOptions = {
                from:process.env.MAIL,
                to:mailList,
                subject: `Shared job profiles`,
                html: `<html>
                <head>
                    <title></title>
                    <style>
                        #Container
                        {
                            background-color:white;
                            
                            border-radius: 4px;
                            border: 1px solid #e3e3e3;
                            text-align: justify;
                            padding:25px;
                        }
                        body
                        {
                            background-color: #f5f5f5;
                            text-align:center;
                            padding:10px;
                            font-family: Tahoma;
                        }
                    </style>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
                    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
                </head>
                <body style="background-color: #f5f5f5; text-align:center; padding:10px; font-family: Tahoma;">
                    <div style="text-align:left; padding-top:10px; padding-bottom:10px;">
                    </div>
            
                    <div id="Container">
                        <p>Hello</p><br />
                   <p>JobListing’s mission is to accelerate your job hunt. You can use the platform to access several job listings across the globe, find the job that suits your profile best, and boost your professional career.</p><br>  
                   <p>Ready to begin? Choose one of the options below:</p>
                        <div>
                        <ul>
                        <li style="color: LightSeaGreen;">Register</li>
                        <li style="color: OrangeRed;">Update Profile</li>
                        <li style="color: DodgerBlue ;">Apply Job</li>
                        </ul> <br>
                            <p style="margin-bottom: 0px;"><b>ALL THE BEST</b></p>
                            <br>
                            <p style="margin-bottom: 0px;">Thanks,</p>
                            <p>JobListing Team</p>
                            <div style="font-size: 12px;">
            
                                <a href="https://www.joblisting.com/terms">Terms Of Use</a> | <a href="https://www.joblisting.com/privacy">Privacy</a> | <a href="https://www.joblisting.com/copyright">Copyright</a><br />
                                <p>If you want to opt out of receiving future emails from us, contact us at support@joblisting.com. If your Internet provider filters incoming email, please add support@joblisting.com to your list of approved senders. Please do not reply to this email as this is a computer-generated message. For further assistance, please contact us at support@joblisting.com</p>
                                <b>Disclaimer!</b>
                                <p>This is a genuine message/alert sent according to our <a href="https://www.joblisting.com/terms">Terms Of Use</a> and <a href="https://www.joblisting.com/privacy">Privacy</a>. Please do not reply to this email, as this is a computer-generated message/alert.	While all reasonable care has been taken in the preparation of the information contained in this email, Joblisting, Inc. or its related parties take no any responsibility for any action(s) taken on the basis of this message/alert, basis of the information contained herein or for any errors or omissions in that information. This email is intended for the use of the addressee only. If you are not the intended recipient of this message, kindly do not read or keep this message/alert with you and notify us at support@joblisting.com</p>
                                <p>You may have received this message/alert as "forward-to-a-friend" message. Joblisting, Inc. did not offer any kind of benefit and any gain to the forwarder or to the recommender and or did not give the forwarder or the recommender some other benefit in relation to sending you this message/alert. Also Joblisting, Inc. did not offer money, coupons, discounts,  awards, additional entries in a sweepstakes, any kind of benefit in exchange for generating traffic to website or the like in exchange for forwarding and or sending this message/alert and or recommending you in relation to this message/alert. </p>
                            </div>
            
                        </div>
                    </div>
                </body>
            </html>
                `
              }; 
              mailgun.messages().send(messageOptions, function (error, info) {
                if (error) {
                    console.log(error)
                    throw error;
                }else {
                  console.log('User profile14')
                }
            })

            }else{
                console.log("no mail14")
            }

         }
     })
})

const user_profile_share15=schedule.scheduleJob('0 0 * * *',function(){             
    com = ",";
    var a="select STRING_AGG(cast(EmailID as NVARCHAR(MAX)),'"+com+"') as Email  FROM shareJMails where EmailID  LIKE '%@%.%' AND PATINDEX('%[^a-z,0-9,@,.,,\-]%',EmailID ) = 0 and Dt = convert(date,getdate()-15)"
      con.query(a,(er,rs)=>{
         if(er){
             console.log(er)
         }else{
            if(rs.recordset[0].Email!==null){
             var mailList=rs.recordset[0].Email
             let messageOptions = {
                from:process.env.MAIL,
                to:"Jobseeker.Chetan@gmail.com",
                subject: `Shared job profiles`,
                html: `<html>
                <head>
                    <title></title>
                    <style>
                        #Container
                        {
                            background-color:white;
                            
                            border-radius: 4px;
                            border: 1px solid #e3e3e3;
                            text-align: justify;
                            padding:25px;
                        }
                        body
                        {
                            background-color: #f5f5f5;
                            text-align:center;
                            padding:10px;
                            font-family: Tahoma;
                        }
                    </style>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
                    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
                </head>
                <body style="background-color: #f5f5f5; text-align:center; padding:10px; font-family: Tahoma;">
                    <div style="text-align:left; padding-top:10px; padding-bottom:10px;">
                    </div>
            
                    <div id="Container">
                        <p>Hello</p><br />
                   <p>JobListing’s mission is to accelerate your job hunt. You can use the platform to access several job listings across the globe, find the job that suits your profile best, and boost your professional career.</p><br>  
                   <p>Ready to begin? Choose one of the options below:</p>
                        <div>
                        <ul>
                        <li style="color: LightSeaGreen;">Register</li>
                        <li style="color: OrangeRed;">Update Profile</li>
                        <li style="color: DodgerBlue ;">Apply Job</li>
                        </ul> <br>
                            <p style="margin-bottom: 0px;"><b>ALL THE BEST</b></p>
                            <br>
                            <p style="margin-bottom: 0px;">Thanks,</p>
                            <p>JobListing Team</p>
                            <div style="font-size: 12px;">
            
                                <a href="https://www.joblisting.com/terms">Terms Of Use</a> | <a href="https://www.joblisting.com/privacy">Privacy</a> | <a href="https://www.joblisting.com/copyright">Copyright</a><br />
                                <p>If you want to opt out of receiving future emails from us, contact us at support@joblisting.com. If your Internet provider filters incoming email, please add support@joblisting.com to your list of approved senders. Please do not reply to this email as this is a computer-generated message. For further assistance, please contact us at support@joblisting.com</p>
                                <b>Disclaimer!</b>
                                <p>This is a genuine message/alert sent according to our <a href="https://www.joblisting.com/terms">Terms Of Use</a> and <a href="https://www.joblisting.com/privacy">Privacy</a>. Please do not reply to this email, as this is a computer-generated message/alert.	While all reasonable care has been taken in the preparation of the information contained in this email, Joblisting, Inc. or its related parties take no any responsibility for any action(s) taken on the basis of this message/alert, basis of the information contained herein or for any errors or omissions in that information. This email is intended for the use of the addressee only. If you are not the intended recipient of this message, kindly do not read or keep this message/alert with you and notify us at support@joblisting.com</p>
                                <p>You may have received this message/alert as "forward-to-a-friend" message. Joblisting, Inc. did not offer any kind of benefit and any gain to the forwarder or to the recommender and or did not give the forwarder or the recommender some other benefit in relation to sending you this message/alert. Also Joblisting, Inc. did not offer money, coupons, discounts,  awards, additional entries in a sweepstakes, any kind of benefit in exchange for generating traffic to website or the like in exchange for forwarding and or sending this message/alert and or recommending you in relation to this message/alert. </p>
                            </div>
            
                        </div>
                    </div>
                </body>
            </html>
                `
              }; 
              mailgun.messages().send(messageOptions, function (error, info) {
                if (error) {
                    console.log(error)
                    throw error;
                }else {
                  console.log('User profile15')
                }
            })

            }else{
                console.log("no mail15")
            }

         }
     })
})

const webjobs= schedule.scheduleJob('0 0 * * *', function(req,res){
    con.query("select top 10  JobLink,MSkills,Jobtitle,id from webjoblist   where DateCreated >= DATEADD(day, -2, getdate()) and EmailSent='N'",(e,r)=>{
        if(e){
            console.log(e)
        }else{
            con.query("select top 10 STRING_AGG(cast(MSkills as NVARCHAR(max)),',') as mskills from webjoblist where DateCreated >= DATEADD(day, -2, getdate()) and EmailSent='N'",(err,rsl)=>{
                if(err){
                    console.log(err)
                }else{
                    //https://www.joblisting.com/Content/homed/img/Logo.png
                    var tableData = r.recordset;
                    let table_body = '<div>';
                    tableData.forEach(function(item) {
                        table_body += '<div id="card">'
                        table_body += '<div id="card1">'
                        table_body += '<img width="200" height="30" src="https://www.joblisting.com/Content/homed/img/Logo.png" style="width: 20%;margin-right:60px;margin-top:8px;">'  + '</img>'
                        table_body += '<p style="width: 50%;">' + item.Jobtitle + '</p>'
                        table_body += '<p>'  + '<a id="downloadbutton" href=' +`${item.JobLink}` +' >Apply Now </a>' + '</p>'
                        table_body += '</div>'
                        table_body += '</div>'                        
                    });
                    table_body += '</div>';
                    con.query("select STRING_AGG(cast( t.Username as NVARCHAR(MAX)),',') as Email from  userprofiles t inner join User_Skills s on s.UserId = t.UserId where SkillName in(select top 10 MSkills from webjoblist   where DateCreated >= DATEADD(day, -2, getdate()) and EmailSent='N')",(er,rs)=>{
                        if(er){
                             console.log(er)
                         }else{
                            // var array1=rsl.recordset[0].mskills.split(',')
                            // var array2=rs.recordset[0].skills.split(',')
                            // var a=array1.filter(element =>array2.includes(element));
                             var mailList=rs.recordset[0].Email           
                                let messageOptions = {
                                     from:process.env.MAIL,
                                     to:mailList,
                                     subject: `Job matches your skills`,
                                        html: `<html>
                                             <head>
                                             <title></title>
                                             <style>
                                             #Container
                                             {
                                                 background-color: #34ba08;
                                                 border-radius: 4px;
                                                 border: 1px solid #e3e3e3;
                                                 text-align: justify;
                                                 padding: 2px;
                                                 width: 60%;
                                                 color: #fff;
                                                 margin : 0 auto;
                                             }
                                             #Container1{
                                                 background-color:#fff;
                                                 color:#000;
                                                 padding:10px;
                                             }
                                             #Container2{
                                                 display:block;
                                                 margin:0 auto;
                                              }
                                              body
                                              {
                                                  background-color: #f5f5f5;
                                                  text-align:center;
                                                  padding:10px;
                                                  font-family: Tahoma;
                                              }
                                              #card{
                                                 background: #fff !important;
                                                 display: flex;
                                                 color: #000;
                                                 padding: 10px;
                                                 margin: 10px 0px;
                                                 align-items: center !important;
                                                 display:block;
                                                 border: 2px dashed #3bf600;
                                                 justify-content: space-between !important;
                                             }
                                             #card1{
                                                 display: flex;
                                                 gap:10px;
                                             }
                                             #downloadbutton{                 
                                             background: #000;
                                             padding: 4px 7px;
                                             border-radius: 25px;
                                             color: #fff;
                                             text-decoration: none;
                                             }
                                             </style>
                                                                         <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
                                                                         <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
                                                                     </head>
                                                                     <body style="background-color: #f5f5f5; text-align:center; padding:10px; font-family: Tahoma;">
                                                                         <div style="text-align:left; padding-top:10px; padding-bottom:10px;">
                                                                         </div>
                                                                         <div id="Container">
                                                                         <div id="Container1">
                                                                          <img  id="Container2" width="200" height="50" src="https://www.joblisting.com/Content/homed/img/logo.png"/>
                                                                         <h2>Hello,</h2>
                                                                         <p>Your skills matches the below listed jobs, <b>Apply Now</b></p>
                                                                         </div>
                                                                         ${table_body}                                               
                                                                             <div>
                                                                             <p style="margin-bottom: 0px;"><b>ALL THE BEST</b></p>
                                                                                 <br>
                                                                                 <p style="margin-bottom: 0px;">Thanks,</p>
                                                                                 <p>JobListing Team</p>
                                                                                 <div style="font-size: 12px;">
                                                                                     <a href="https://www.joblisting.com/terms">Terms Of Use</a> | <a href="https://www.joblisting.com/privacy">Privacy</a> | <a href="https://www.joblisting.com/copyright">Copyright</a><br />
                                                                                     <p>If you want to opt out of receiving future emails from us, contact us at support@joblisting.com. If your Internet provider filters incoming email, please add support@joblisting.com to your list of approved senders. Please do not reply to this email as this is a computer-generated message. For further assistance, please contact us at support@joblisting.com</p>
                                                                                     <b>Disclaimer!</b>
                                                                                     <p>This is a genuine message/alert sent according to our <a href="https://www.joblisting.com/terms">Terms Of Use</a> and <a href="https://www.joblisting.com/privacy">Privacy</a>. Please do not reply to this email, as this is a computer-generated message/alert.	While all reasonable care has been taken in the preparation of the information contained in this email, Joblisting, Inc. or its related parties take no any responsibility for any action(s) taken on the basis of this message/alert, basis of the information contained herein or for any errors or omissions in that information. This email is intended for the use of the addressee only. If you are not the intended recipient of this message, kindly do not read or keep this message/alert with you and notify us at support@joblisting.com</p>
                                                                                     <p>You may have received this message/alert as "forward-to-a-friend" message. Joblisting, Inc. did not offer any kind of benefit and any gain to the forwarder or to the recommender and or did not give the forwarder or the recommender some other benefit in relation to sending you this message/alert. Also Joblisting, Inc. did not offer money, coupons, discounts,  awards, additional entries in a sweepstakes, any kind of benefit in exchange for generating traffic to website or the like in exchange for forwarding and or sending this message/alert and or recommending you in relation to this message/alert. </p>
                                                                                 </div>                                 
                                                                             </div>
                                                                         </div>
                                                                     </body>
                                                                 </html>`
                                }; 
                                mailgun.messages().send(messageOptions, function (error, info) {
                                    if (error) {
                                        console.log(error)
                                        throw error;
                                    }else {
                                        con.query("UPDATE WebJobList SET EmailSent = 'Y' WHERE id IN(SELECT TOP (10) id FROM WebJobList where DateCreated >= DATEADD(day, -2, getdate()) )",(error,result)=>{
                                            if(error){
                                                console.log(error)
                                            }else{
                                              console.log("update y successfully")  
                                            }
                                        })
                                    

                                    }
                                })
                               //res.status(200).json({ status: true,message:'Fetch data successfully',data:a})            
                        }
                     })
                }
            })
// Table Data Print
// let data = 'stackabuse.com';
// let buff = Buffer.from(img);
// let base64data = buff.toString('base64');
// console.log(base64data)


            }
    }) 
})

const jobs= schedule.scheduleJob('0 0 * * *', function(req,res){
    // app.get('/hai',(req,res)=>{
    con.query("select Title,PermaLink,v.Id,Requirements from jobs v left join photos s on s.UserID=  v.Employerid  where DateCreated >= DATEADD(day, -60, getdate())",(e,r)=>{
        if(e){
            console.log(e)
        }else{
            // var a=r.recordset[0].PermaLink
            // var id=r.recordset[0].Id
            // var img=r.recordset[2].Image
            // var link=`https://www.joblisting.com/job/${a}-${id}`
            var tableData = r.recordset;
            // Table Data Print
//             let data = 'stackabuse.com';
// let buff = Buffer.from(img);
// let base64data = buff.toString('base64');

// console.log(base64data)
// console.log(r.recordset)
                                                                                                                    
            let table_body = '<div>';
            tableData.forEach(function(item) {

                table_body += '<div id="card">'
                table_body += '<div id="card1">'
                table_body += '<img width="200" height="30" src="https://www.joblisting.com/Content/homed/img/logo.png" style="width: 20%;margin-right:60px;margin-top:8px;">'  + '</img>'
                table_body += '<p style="width: 50%;">' + item.Title + '</p>'
                table_body += '<p>'  + '<a id="downloadbutton" href=' +`https://www.joblisting.com/job/${item.PermaLink}-${item.Id}` +' >Apply Now </a>' + '</p>'
                table_body += '</div>'

                
                table_body += '</div>'                        
            });
            table_body += '</div>';
            const htmls = r.recordset[0].Requirements.split(',')
            console.log(htmls)
                        htmls.forEach(
                (element)=>{
                        con.query("select STRING_AGG(cast( t.Username as NVARCHAR(MAX)),',') as Email from  userprofiles t inner join User_Skills s on s.UserId = t.UserId where s.SkillName IN ('"+element+"')",(er,rs)=>{
                        if(er){
                            console.log(er)
                          }else{
                              console.log(rs.recordset)
                              var mailList=rs.recordset[0].Email
                                let messageOptions = {
                                from:process.env.MAIL,
                                to:mailList,
                                subject: `Job matches your skills`,
                                html: `<html>
                                                    <head>
                                                        <title></title>
                                                        <style>
                                                            #Container
                                                            {
                                                                background-color: #34ba08;
                                                                border-radius: 4px;
                                                                border: 1px solid #e3e3e3;
                                                                text-align: justify;
                                                                padding: 2px;
                                                                width: 60%;
                                                                color: #fff;
                                                                margin : 0 auto;
                                                            }
                                                            
                                                            
                                                            #Container1{
                                                                background-color:#fff;
                                                                color:#000;
                                                                padding:10px;
                                                            }
                                                            #Container2{
                                                               display:block;
                                                               margin:0 auto;
                                                            }
                                                            body
                                                            {
                                                                background-color: #f5f5f5;
                                                                text-align:center;
                                                                padding:10px;
                                                                font-family: Tahoma;
                                                            }
                                                            #card{
                                                                background: #fff !important;
                                                                display: flex;
                                                                color: #000;
                                                                padding: 10px;
                                                                margin: 10px 0px;
                                                                align-items: center !important;
                                                                display:block;
                                                                border: 2px dashed #3bf600;
                                                                justify-content: space-between !important;
                                                            }
                                                            #card1{
                                                                display: flex;
                                                                gap:10px;
                                                            }
                                                            #downloadbutton{
                                                                
                                                            background: #000;
                                                            padding: 4px 7px;
                                                            border-radius: 25px;
                                                            color: #fff;
                                                            text-decoration: none;
                                                            }
                                                        </style>
                                                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
                                                        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
                                                    </head>
                                                    <body style="background-color: #f5f5f5; text-align:center; padding:10px; font-family: Tahoma;">
                                                        <div style="text-align:left; padding-top:10px; padding-bottom:10px;">
                                                        </div>
                                                        <div id="Container">
                                                        <div id="Container1">
                                                         <img  id="Container2" width="200" height="50" src="https://www.joblisting.com/Content/homed/img/logo.png"/>
                                                        <h2>Hello,</h2>
                                                        <p>Your skills matches the below listed jobs, <b>Apply Now</b></p>
                                                        </div>
                                                        ${table_body}

                                                        
                                                            <div>
                                                            <p style="margin-bottom: 0px;"><b>ALL THE BEST</b></p>
                                                                <br>
                                                                <p style="margin-bottom: 0px;">Thanks,</p>
                                                                <p>JobListing Team</p>
                                                                <div style="font-size: 12px;">
                                                                    <a href="https://www.joblisting.com/terms">Terms Of Use</a> | <a href="https://www.joblisting.com/privacy">Privacy</a> | <a href="https://www.joblisting.com/copyright">Copyright</a><br />
                                                                    <p>If you want to opt out of receiving future emails from us, contact us at support@joblisting.com. If your Internet provider filters incoming email, please add support@joblisting.com to your list of approved senders. Please do not reply to this email as this is a computer-generated message. For further assistance, please contact us at support@joblisting.com</p>
                                                                    <b>Disclaimer!</b>
                                                                    <p>This is a genuine message/alert sent according to our <a href="https://www.joblisting.com/terms">Terms Of Use</a> and <a href="https://www.joblisting.com/privacy">Privacy</a>. Please do not reply to this email, as this is a computer-generated message/alert.	While all reasonable care has been taken in the preparation of the information contained in this email, Joblisting, Inc. or its related parties take no any responsibility for any action(s) taken on the basis of this message/alert, basis of the information contained herein or for any errors or omissions in that information. This email is intended for the use of the addressee only. If you are not the intended recipient of this message, kindly do not read or keep this message/alert with you and notify us at support@joblisting.com</p>
                                                                    <p>You may have received this message/alert as "forward-to-a-friend" message. Joblisting, Inc. did not offer any kind of benefit and any gain to the forwarder or to the recommender and or did not give the forwarder or the recommender some other benefit in relation to sending you this message/alert. Also Joblisting, Inc. did not offer money, coupons, discounts,  awards, additional entries in a sweepstakes, any kind of benefit in exchange for generating traffic to website or the like in exchange for forwarding and or sending this message/alert and or recommending you in relation to this message/alert. </p>
                                                                </div>
                                                
                                                            </div>
                                                        </div>
                                                    </body>
                                                </html>
                                        `
                                      }; 
                                      mailgun.messages().send(messageOptions, function (error, info) {
                                        if (error) {
                                            console.log(error)
                                            throw error;
                                        }else {
                                                                                                           res.status(200).json({
                                                status: true,
                                                msg: "Job send to job seekers",
                                                data: r.recordset
                                            })
                                        }
                                    })
                        
                         
                          }
                      })
                })

            }
          //  res.status(200).json({ status: true,msg: "Job send to job seekers",data: base64data})
    })

    
})

const resumes= schedule.scheduleJob('0 0 * * *', function(req,res){
    con.query("SELECT  MainTab.Title,MainTab.EmployerId,STRING_AGG(CAST(MainTab.UserId AS NVARCHAR(MAX)),',') WITHIN GROUP( ORDER BY MainTab.UserId) UserList FROM(SELECT Distinct UserSkillTab.UserId,UserRermntTab.Title,UserRermntTab.EmployerId FROM(select R.Value Requirement, s.EmployerId,s.Title from jobs s CROSS APPLY STRING_SPLIT(s.Requirements,',') AS R WHERE EXISTS (SELECT 1 FROM userprofiles u WHERE s.EmployerId = u.UserId) AND s.DateCreated >= DATEADD(day, -60, getdate())) UserRermntTab CROSS APPLY (SELECT us.UserId  FROM User_skills us WHERE  us.SkillName = UserRermntTab.Requirement) AS UserSkillTab) MainTab group by maintab.Title,MainTab.EmployerId",(er,rs)=>{
        if(er){
            console.log(er)
        }else{
            var id=rs.recordset[0].UserList
                con.query("select  p.FirstName+ + p.LastName as FullName,u.SkillName from  User_Skills u inner join UserProfiles p on u.UserId=p.UserID  where u.UserId  IN("+id+") group by p.FirstName+ + p.LastName ,u.SkillName ",(e,r)=>{
                    if(e){
                        console.log(e)
                    }else{
                        var empid=rs.recordset[0].EmployerId
                        var tableData=r.recordset   
                       
                        //Table Data Print
                                                                                                                             
                        let table_body = '<div style="padding:10px;">';
                        tableData.forEach(function(item) {

                            table_body += '<div id="card">'
                            table_body += '<div id="card1">'
                            table_body += '<h3 style="margin:0;">' + item.FullName + '</h3>'
                            table_body += '<p style="margin:0;">' + item.SkillName + '</p>' 
                            table_body += '</div>'
                            table_body += '<div id="card2">'
                            table_body += '<p style="background:#000;color:#fff!important;border-radius:21px;float:left;padding:4px 12px;top:90px!important;position:absolute!important;left:70%!important;margin:15px 0px;" class="btn btn-success edit"><a href="https://www.joblisting.com" style="text-decoration: none;color: white;"> Download</a></p>'
                            table_body += '</div>'
                            table_body += '</div>'                  
                        });
                        table_body += '</div>';
                      
                       // $('#tableDiv').html(table_body); 
                                   
                        // for(var i=0;i<r.recordset.length;i++){
                        //     // console.log(r.recordset[i].FullName)
                        // }
                        con.query("select Username from UserProfiles where UserId="+empid+"",(err,rsl)=>{
                            if(err){
                                console.log(err)
                            }else{
                                var email=rsl.recordset[0].Username
                                    let messageOptions = {
                                            from:process.env.MAIL,
                                            to:email,
                                            subject: `Profile matches your job`,
                                            html:`<!DOCTYPE html>
                                            <html lang="en" >
                                            <head>
                                              <meta charset="UTF-8">
                                              <title>Job Listing</title>
                                              <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
                                            <style>

                                            #Container
                                            {
                                                background-color: #34ba08;
                                                border-radius: 4px;
                                                border: 1px solid #e3e3e3;
                                                text-align: justify;
                                                padding: 2px;
                                                width: 60%;
                                                color: #fff;
                                                margin : 0 auto;
                                            }
                                            body
                                            {
                                                background-color: #f5f5f5;
                                                text-align:center;
                                                padding:10px;
                                                font-family: Tahoma;
                                            }
                                            #card{
                                                background: #fff !important;
                                                display: flex;
                                                color: #000;
                                                padding: 10px;
                                                margin: 10px 0px;
                                                align-items: center !important;
                                                display:block;
                                                border: 2px dashed #3bf600;
                                                justify-content: space-between !important;
                                            }
                                            #card1{
                                                width: 75%;
                                                float: left;
                                            }
                                             #card2{
                                                width: 25%;
                                                display: table-cell;
                                            }
                                            #downloadbutton{
                                                
                                            background: #000;
                                            padding: 4px 7px;
                                            border-radius: 25px;
                                            color: #fff;
                                            text-decoration: none;
                                            }
                                            </style>
                                            </head>
                                           
                                            <body>
                                                    <div  id="Container">
                                                    <div style="background:#fff;text-align: center;border: 5px solid #34ba08;">
                                                    <img width="200" height="50" src="https://www.joblisting.com/Content/homed/img/logo.png"/>
                                                        <h3 style="padding: 10px;color: #000;" >
                                                    Following profiles match to your job listing.
                                                    you can download from <a href="https://www.joblisting.com" > https://www.joblisting.com<br/></a>
                                                   
                                                        </h3>
                                                        </div>
                                                                           ${table_body}
                                                      
                                            <!-- partial -->
                                              <script src='https://code.jquery.com/jquery-3.1.1.slim.min.js'></script>
                                            <script src='https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js'></script>
                                            <script src='https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js'></script>
                                            <div>
                                                <p style="margin-bottom: 0px;"><b>ALL THE BEST</b></p>
                                                    <br>
                                                    <p style="margin-bottom: 0px;">Thanks,</p>
                                                    <p>JobListing Team</p>
                                                    <div style="font-size: 12px;">
                                                        <a href="https://www.joblisting.com/terms">Terms Of Use</a> | <a href="https://www.joblisting.com/privacy">Privacy</a> | <a href="https://www.joblisting.com/copyright">Copyright</a><br />
                                                        <p>If you want to opt out of receiving future emails from us, contact us at support@joblisting.com. If your Internet provider filters incoming email, please add support@joblisting.com to your list of approved senders. Please do not reply to this email as this is a computer-generated message. For further assistance, please contact us at support@joblisting.com</p>
                                                        <b>Disclaimer!</b>
                                                        <p>This is a genuine message/alert sent according to our <a href="https://www.joblisting.com/terms">Terms Of Use</a> and <a href="https://www.joblisting.com/privacy">Privacy</a>. Please do not reply to this email, as this is a computer-generated message/alert.	While all reasonable care has been taken in the preparation of the information contained in this email, Joblisting, Inc. or its related parties take no any responsibility for any action(s) taken on the basis of this message/alert, basis of the information contained herein or for any errors or omissions in that information. This email is intended for the use of the addressee only. If you are not the intended recipient of this message, kindly do not read or keep this message/alert with you and notify us at support@joblisting.com</p>
                                                        <p>You may have received this message/alert as "forward-to-a-friend" message. Joblisting, Inc. did not offer any kind of benefit and any gain to the forwarder or to the recommender and or did not give the forwarder or the recommender some other benefit in relation to sending you this message/alert. Also Joblisting, Inc. did not offer money, coupons, discounts,  awards, additional entries in a sweepstakes, any kind of benefit in exchange for generating traffic to website or the like in exchange for forwarding and or sending this message/alert and or recommending you in relation to this message/alert. </p>
                                                    </div>
                                                </div>
                                                 </div>
                                            </body>
                                            
                                            </html>
                                            `
                                    }; 
                                        mailgun.messages().send(messageOptions, function (error, info) {
                                            if (error) {
                                                console.log(error)
                                                throw error;
                                            }else {
                                                res.status(200).json({ status: true,message:'Fetch data successfully',data:r.recordset})
                                            }
                                        })
                            }
                    })

                    }
                })
        }
    })   
})

const resumesforweb= schedule.scheduleJob('0 0 0 * * *', function(req,res){
    con.query("SELECT  MainTab.JobTitle,MainTab.Id,STRING_AGG(CAST(MainTab.UserId AS NVARCHAR(MAX)),',') WITHIN GROUP(ORDER BY MainTab.UserId) UserList FROM (SELECT Distinct UserSkillTab.UserId,UserRermntTab.JobTitle,UserRermntTab.Id FROM (select R.Value MSkills , s.Id,s.JobTitle from smjoblist s CROSS APPLY STRING_SPLIT(s.MSkills,',') AS R WHERE s.DateCreated >= DATEADD(day, -220, getdate())) UserRermntTab CROSS APPLY (SELECT us.UserId  FROM User_skills us WHERE  us.SkillName = UserRermntTab.MSkills) AS UserSkillTab) MainTab group by maintab.JobTitle,MainTab.Id",(er,rs)=>{
        if(er){
            console.log(er)
        }else{
            var id=rs.recordset[0].UserList
                con.query("select  p.FirstName+ + p.LastName as FullName,u.SkillName from  User_Skills u inner join UserProfiles p on u.UserId=p.UserID  where u.UserId  IN("+id+") group by p.FirstName+ + p.LastName ,u.SkillName ",(e,r)=>{
                    if(e){
                        console.log(e)
                    }else{
                        var empid=rs.recordset[0].EmployerId
                        var tableData=r.recordset   
                        console.log(empid)
                        console.log(tableData)
                       
                        //Table Data Print
                                                                                                                             
                        let table_body = '<div style="padding:10px;">';
                        tableData.forEach(function(item) {

                            table_body += '<div id="card">'
                            table_body += '<div id="card1">'
                            table_body += '<h3 style="margin:0;">' + item.FullName + '</h3>'
                            table_body += '<p style="margin:0;">' + item.SkillName + '</p>' 
                            table_body += '</div>'
                            table_body += '<div id="card2">'
                            table_body += '<p style="background:#000;color:#fff!important;border-radius:21px;float:left;padding:4px 12px;top:90px!important;position:absolute!important;left:70%!important;margin:15px 0px;" class="btn btn-success edit"><a href="https://www.joblisting.com" style="text-decoration: none;color: white;"> Download</a></p>'
                            table_body += '</div>'
                            table_body += '</div>'                  
                        });
                        table_body += '</div>';
                      
                       // $('#tableDiv').html(table_body); 
                                   
                        // for(var i=0;i<r.recordset.length;i++){
                        //     // console.log(r.recordset[i].FullName)
                        // }
                        con.query("select Username from UserProfiles where UserId="+empid+"",(err,rsl)=>{
                            if(err){
                                console.log(err)
                            }else{
                                var email=rsl.recordset[0].Username
                                console.log(email)
                                    let messageOptions = {
                                            from:process.env.MAIL,
                                            to:"jobseeker.chetan@gmail.com",
                                            subject: `Profile matches your job`,
                                            html:`<!DOCTYPE html>
                                            <html lang="en" >
                                            <head>
                                              <meta charset="UTF-8">
                                              <title>Job Listing</title>
                                              <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
                                            <style>

                                            #Container
                                            {
                                                background-color: #34ba08;
                                                border-radius: 4px;
                                                border: 1px solid #e3e3e3;
                                                text-align: justify;
                                                padding: 2px;
                                                width: 60%;
                                                color: #fff;
                                                margin : 0 auto;
                                            }
                                            body
                                            {
                                                background-color: #f5f5f5;
                                                text-align:center;
                                                padding:10px;
                                                font-family: Tahoma;
                                            }
                                            #card{
                                                background: #fff !important;
                                                display: flex;
                                                color: #000;
                                                padding: 10px;
                                                margin: 10px 0px;
                                                align-items: center !important;
                                                display:block;
                                                border: 2px dashed #3bf600;
                                                justify-content: space-between !important;
                                            }
                                            #card1{
                                                width: 75%;
                                                float: left;
                                            }
                                             #card2{
                                                width: 25%;
                                                display: table-cell;
                                            }
                                            #downloadbutton{
                                                
                                            background: #000;
                                            padding: 4px 7px;
                                            border-radius: 25px;
                                            color: #fff;
                                            text-decoration: none;
                                            }
                                            </style>
                                            </head>
                                           
                                            <body>
                                                    <div  id="Container">
                                                    <div style="background:#fff;text-align: center;border: 1px solid #34ba08;">
                                                    <img width="200" height="50" src="https://www.joblisting.com/Content/homed/img/logo.png"/>
                                                        <h3 style="padding: 10px;color: #000;" >
                                                    Following profiles match to your job listing.
                                                    you can download from <a href="https://www.joblisting.com" > https://www.joblisting.com<br/></a>
                                                   
                                                        </h3>
                                                        </div>
                                                                           ${table_body}
                                                      
                                            <!-- partial -->
                                              <script src='https://code.jquery.com/jquery-3.1.1.slim.min.js'></script>
                                            <script src='https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js'></script>
                                            <script src='https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js'></script>
                                            <div>
                                                <p style="margin-bottom: 0px;"><b>ALL THE BEST</b></p>
                                                    <br>
                                                    <p style="margin-bottom: 0px;">Thanks,</p>
                                                    <p>JobListing Team</p>
                                                    <div style="font-size: 12px;">
                                                        <a href="https://www.joblisting.com/terms">Terms Of Use</a> | <a href="https://www.joblisting.com/privacy">Privacy</a> | <a href="https://www.joblisting.com/copyright">Copyright</a><br />
                                                        <p>If you want to opt out of receiving future emails from us, contact us at support@joblisting.com. If your Internet provider filters incoming email, please add support@joblisting.com to your list of approved senders. Please do not reply to this email as this is a computer-generated message. For further assistance, please contact us at support@joblisting.com</p>
                                                        <b>Disclaimer!</b>
                                                        <p>This is a genuine message/alert sent according to our <a href="https://www.joblisting.com/terms">Terms Of Use</a> and <a href="https://www.joblisting.com/privacy">Privacy</a>. Please do not reply to this email, as this is a computer-generated message/alert.	While all reasonable care has been taken in the preparation of the information contained in this email, Joblisting, Inc. or its related parties take no any responsibility for any action(s) taken on the basis of this message/alert, basis of the information contained herein or for any errors or omissions in that information. This email is intended for the use of the addressee only. If you are not the intended recipient of this message, kindly do not read or keep this message/alert with you and notify us at support@joblisting.com</p>
                                                        <p>You may have received this message/alert as "forward-to-a-friend" message. Joblisting, Inc. did not offer any kind of benefit and any gain to the forwarder or to the recommender and or did not give the forwarder or the recommender some other benefit in relation to sending you this message/alert. Also Joblisting, Inc. did not offer money, coupons, discounts,  awards, additional entries in a sweepstakes, any kind of benefit in exchange for generating traffic to website or the like in exchange for forwarding and or sending this message/alert and or recommending you in relation to this message/alert. </p>
                                                    </div>
                                                </div>
                                                 </div>
                                            </body>
                                            
                                            </html>
                                            `
                                    }; 
                                        mailgun.messages().send(messageOptions, function (error, info) {
                                            if (error) {
                                                console.log(error)
                                                throw error;
                                            }else {
                                                res.status(200).json({ status: true,message:'Fetch data successfully',data:r.recordset})
                                            }
                                        })
                            }
                    })

                    }
                })
        }
    })   
})


//testapi

//welcome msg sending to the new user
    
const user_profile_share99=schedule.scheduleJob('00 00 12 * * 0-6',function(){             
    com = ",";
    var a="select STRING_AGG(cast(EmailID as NVARCHAR(MAX)),'"+com+"') as Email  FROM shareJMails where EmailID  LIKE '%@%.%' AND PATINDEX('%[^a-z,0-9,@,.,,\-]%',EmailID ) = 0 and Dt = convert(date,getdate()-9)"
      con.query(a,(er,rs)=>{
         if(er){
             console.log(er)
         }else{
            if(rs.recordset[0].Email!==null){
                console.log("99 is called")
                var mailList=rs.recordset[0].Email   
             let messageOptions = {
                from:process.env.MAIL,
                to:mailList,
                subject: `Shared job profiles`,
                html: `<html>
                <head>
                    <title></title>
                    <style>
                        #Container
                        {
                            background-color:white;
                            
                            border-radius: 4px;
                            border: 1px solid #e3e3e3;
                            text-align: justify;
                            padding:25px;
                        }
                        body
                        {
                            background-color: #f5f5f5;
                            text-align:center;
                            padding:10px;
                            font-family: Tahoma;
                        }
                    </style>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
                    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
                </head>
                <body style="background-color: #f5f5f5; text-align:center; padding:10px; font-family: Tahoma;">
                    <div style="text-align:left; padding-top:10px; padding-bottom:10px;">
                    </div>
            
                    <div id="Container">
                        <p>Hello</p><br />
                   <p>JobListing’s mission is to accelerate your job hunt. You can use the platform to access several job listings across the globe, find the job that suits your profile best, and boost your professional career.</p><br>  
                   <p>Ready to begin? Choose one of the options below:</p>
                        <div>
                        <ul>
                        <li style="color: LightSeaGreen;">Register</li>
                        <li style="color: OrangeRed;">Update Profile</li>
                        <li style="color: DodgerBlue ;">Apply Job</li>
                        </ul> <br>
                            <p style="margin-bottom: 0px;"><b>ALL THE BEST</b></p>
                            <br>
                            <p style="margin-bottom: 0px;">Thanks,</p>
                            <p>JobListing Team</p>
                            <div style="font-size: 12px;">
            
                                <a href="https://www.joblisting.com/terms">Terms Of Use</a> | <a href="https://www.joblisting.com/privacy">Privacy</a> | <a href="https://www.joblisting.com/copyright">Copyright</a><br />
                                <p>If you want to opt out of receiving future emails from us, contact us at support@joblisting.com. If your Internet provider filters incoming email, please add support@joblisting.com to your list of approved senders. Please do not reply to this email as this is a computer-generated message. For further assistance, please contact us at support@joblisting.com</p>
                                <b>Disclaimer!</b>
                                <p>This is a genuine message/alert sent according to our <a href="https://www.joblisting.com/terms">Terms Of Use</a> and <a href="https://www.joblisting.com/privacy">Privacy</a>. Please do not reply to this email, as this is a computer-generated message/alert.	While all reasonable care has been taken in the preparation of the information contained in this email, Joblisting, Inc. or its related parties take no any responsibility for any action(s) taken on the basis of this message/alert, basis of the information contained herein or for any errors or omissions in that information. This email is intended for the use of the addressee only. If you are not the intended recipient of this message, kindly do not read or keep this message/alert with you and notify us at support@joblisting.com</p>
                                <p>You may have received this message/alert as "forward-to-a-friend" message. Joblisting, Inc. did not offer any kind of benefit and any gain to the forwarder or to the recommender and or did not give the forwarder or the recommender some other benefit in relation to sending you this message/alert. Also Joblisting, Inc. did not offer money, coupons, discounts,  awards, additional entries in a sweepstakes, any kind of benefit in exchange for generating traffic to website or the like in exchange for forwarding and or sending this message/alert and or recommending you in relation to this message/alert. </p>
                            </div>
            
                        </div>
                    </div>
                </body>
            </html>
                `
              }; 
              mailgun.messages().send(messageOptions, function (error, info) {
                if (error) {
                    console.log(error)
                    throw error;
                }else {
                  console.log('User profile9')
                }
            })

            }else{
                console.log("no mail9")
            }

         }
     })
})
// const resumesforweb1=schedule.scheduleJob('0 0 * * *',
app.get("/resumesforweb1",function(req,res){ 
    con.query("SELECT  MainTab.JobTitle,MainTab.Id,STRING_AGG(CAST(MainTab.UserId AS NVARCHAR(MAX)),',') WITHIN GROUP(ORDER BY MainTab.UserId) UserList FROM (SELECT Distinct UserSkillTab.UserId,UserRermntTab.JobTitle,UserRermntTab.Id FROM (select R.Value MSkills , s.Id,s.JobTitle from smjoblist s CROSS APPLY STRING_SPLIT(s.MSkills,',') AS R WHERE s.DateCreated >= DATEADD(day, -1080, getdate())) UserRermntTab CROSS APPLY (SELECT us.UserId  FROM User_skills us WHERE  us.SkillName = UserRermntTab.MSkills) AS UserSkillTab) MainTab group by maintab.JobTitle,MainTab.Id",(er,rs)=>{
        if(er){
            console.log(er)
        }else{
            //where u.UserId  IN("+id+") 
            //var id=rs.recordset[0].UserList
            let id=[]
            for(let i=0;i<rs.recordset.length;i++)
            {
                id[i]=rs.recordset[i].UserList;
            }   
            console.log("...................")
            console.log("here here")
            console.log(id)
            console.log("......................")
            
                 
                con.query("select  u.UserId,p.FirstName+ + p.LastName as FullName,u.SkillName from  User_Skills u inner join UserProfiles p on u.UserId=p.UserID where u.UserId  IN("+id+") group by p.FirstName+ + p.LastName ,u.SkillName,u.UserId",(e,r)=>{
                    if(e){
                        console.log(e)
                    }else{
                      // var empid=rs.recordset[0].Id
                       
                    //    let empid=[];
                    //     for(let i=0;i<rs.recordset.length;i++)
                    //     {
                    //      empid[i]=rs.recordset[i].Id;
                    //     }
                    //    console.log(empid)
                    //    console.log("........................")
                       // empid=empid.toString();
                    //    console.log(typeof empid)
                    //    console.log(empid);                    
                    //     console.log("this is upper table data")
                    //     console.log(rs.recordset);
                    //     console.log(".....................")
                    //     console.log("this is lower table data")
                    //     console.log(r.recordset);
                    // //     console.log("....................")
                    //     console.log("this is item data")
                         var tableData=r.recordset  
                         console.log("here i am ")
                        console.log(tableData)
                      
                        //Table Data Print
                                                                                                            //"https://www.joblisting.com/JobSeeker/Resume12?uid="+'"+empid+"'               l
                        let table_body = '<div>';
                        
                        tableData.forEach(function(item) {
                   
                           
                            table_body += '<div id="card">'
                            table_body += '<div id="card1">'
                            table_body += '<h3 style="margin:0;">' + item.FullName + '</h3>'
                            table_body += '<p style="margin:0;">' + item.SkillName + '</p>' 
                            table_body += '</div>'
                            table_body += '<div id="card2">'
                            table_body += '<p style="background:#000;color:#fff!important;border-radius:21px;float:left;padding:4px 12px;top:90px!important;position:absolute!important;left:70%!important;margin:15px 0px;" class="btn btn-success edit"><a href="https://www.joblisting.com/JobSeeker/Resume12?uid='+item.UserId+'"style="text-decoration: none;color: white;"> Download</a></p>'
                            table_body += '</div>'
                            table_body += '</div>'   
                                    
                        });
                    
                
                        table_body += '</div>';
                
                       // $('#tableDiv').html(table_body); 
                                   
                        // for(var i=0;i<r.recordset.length;i++){
                        //     // console.log(r.recordset[i].FullName)
                        // }
                        //"select Username from UserProfiles where UserId="+empid+""
                        con.query("select Username from UserProfiles where UserId IN("+id+")",(err,rsl)=>{
                            if(err){
                                console.log(err)
                            }else{
                               // console.log("hello world")
                                console.log(rsl.recordset)
                                var email=rsl.recordset[0].Username
                                //console.log(email)
                                    let messageOptions = {
                                            from:process.env.MAIL,
                                            to:"Jobseeker.Chetan@gmail.com",
                                            subject: `Profile matches your job`,
                                            html:`<!DOCTYPE html>
                                            <html lang="en" >
                                            <head>
                                              <meta charset="UTF-8">
                                              <title>Job Listing</title>
                                              <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
                                            <style>

                                            #Container
                                            {
                                                background-color: #34ba08;
                                                border-radius: 4px;
                                                border: 1px solid #e3e3e3;
                                                text-align: justify;
                                                padding: 2px;
                                                width: 60%;
                                                color: #fff;
                                                margin : 0 auto;
                                            }
                                            body
                                            {
                                                background-color: #f5f5f5;
                                                text-align:center;
                                                padding:10px;
                                                font-family: Tahoma;
                                            }
                                            #card{
                                                background: #fff !important;
                                                display: flex;
                                                color: #000;
                                                padding: 10px;
                                                
                                                align-items: center !important;
                                                display:block;
                                                border: 2px dashed #3bf600;
                                                justify-content: space-between !important;
                                            }
                                            #card1{
                                                width: 75%;
                                                float: left;
                                            }
                                             #card2{
                                                width: 25%;
                                                display: table-cell;
                                            }
                                            #downloadbutton{
                                                
                                            background: #000;
                                            padding: 4px 7px;
                                            border-radius: 25px;
                                            color: #fff;
                                            text-decoration: none;
                                            }
                                            </style>
                                            </head>
                                           
                                            <body>
                                                    <div  id="Container">
                                                    <div style="background:#fff;text-align: center;border: 1px solid #34ba08;">
                                                    <img width="200" height="50" src="https://www.joblisting.com/Content/homed/img/logo.png"/>
                                                        <h3 style="padding: 10px;color: #000;" >
                                                    Following profiles match to your job listing.
                                                    you can download from <a href="https://www.joblisting.com" > https://www.joblisting.com<br/></a>
                                                   
                                                        </h3>
                                                        </div>
                                                                           ${table_body}
                                                      
                                            <!-- partial -->
                                              <script src='https://code.jquery.com/jquery-3.1.1.slim.min.js'></script>
                                            <script src='https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js'></script>
                                            <script src='https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js'></script>
                                            <div>
                                                <p style="margin-bottom: 0px;"><b>ALL THE BEST</b></p>
                                                    <br>
                                                    <p style="margin-bottom: 0px;">Thanks,</p>
                                                    <p>JobListing Team</p>
                                                    <div style="font-size: 12px;">
                                                        <a href="https://www.joblisting.com/terms">Terms Of Use</a> | <a href="https://www.joblisting.com/privacy">Privacy</a> | <a href="https://www.joblisting.com/copyright">Copyright</a><br />
                                                        <p>If you want to opt out of receiving future emails from us, contact us at support@joblisting.com. If your Internet provider filters incoming email, please add support@joblisting.com to your list of approved senders. Please do not reply to this email as this is a computer-generated message. For further assistance, please contact us at support@joblisting.com</p>
                                                        <b>Disclaimer!</b>
                                                        <p>This is a genuine message/alert sent according to our <a href="https://www.joblisting.com/terms">Terms Of Use</a> and <a href="https://www.joblisting.com/privacy">Privacy</a>. Please do not reply to this email, as this is a computer-generated message/alert.	While all reasonable care has been taken in the preparation of the information contained in this email, Joblisting, Inc. or its related parties take no any responsibility for any action(s) taken on the basis of this message/alert, basis of the information contained herein or for any errors or omissions in that information. This email is intended for the use of the addressee only. If you are not the intended recipient of this message, kindly do not read or keep this message/alert with you and notify us at support@joblisting.com</p>
                                                        <p>You may have received this message/alert as "forward-to-a-friend" message. Joblisting, Inc. did not offer any kind of benefit and any gain to the forwarder or to the recommender and or did not give the forwarder or the recommender some other benefit in relation to sending you this message/alert. Also Joblisting, Inc. did not offer money, coupons, discounts,  awards, additional entries in a sweepstakes, any kind of benefit in exchange for generating traffic to website or the like in exchange for forwarding and or sending this message/alert and or recommending you in relation to this message/alert. </p>
                                                    </div>
                                                </div>
                                                 </div>
                                            </body>
                                            
                                            </html>
                                            `
                                    }; 
                                        mailgun.messages().send(messageOptions, function (error, info) {
                                            if (error) {
                                                console.log(error)
                                                throw error;
                                            }else {
                                                res.status(200).json({ status: true,message:'Fetch data successfully',data:r.recordset})
                                            }
                                        })
                            }
                    })

                    }
                })
            
        }
    })   
})

//select top 10  JobLink,companylogolink,MSkills,Jobtitle,t.id,w.Logo,w.companylogolink from webjoblist t  inner join websitelist w on t.CompanyName = w.CompanyName where  t.EmailSent='N' and companylogolink is not null
app.get("/webjobs1",function(req,res){
    
    con.query("select top 10  JobLink,MSkills,Jobtitle,t.id ,w.companylogoslink from websitelist w inner join webjoblist t  on t.CompanyName = w.CompanyName where w.DateCreated >= DATEADD(day, -2, getdate()) and t.EmailSent='N' and companylogoslink is not null",(e,r)=>{
        if(e){
            console.log(e)
        }else{
            con.query("select top 10 STRING_AGG(cast(MSkills as NVARCHAR(max)),',') as mskills from webjoblist where DateCreated >= DATEADD(day, -2, getdate()) and EmailSent='N'",(err,rsl)=>{
                if(err){
                    console.log(err)
                }else{
                    
                    var tableData = r.recordset
                    
                    
                    let table_body = '<div>';
                    tableData.forEach(function(item) {
                     
                        console.log(tableData)
                        
                        // let link="https://cdn.octopix.in/uploads/company-logo/2018/07/06/lidnes-technologies-c3SBC5rMcJs7Nkh7yc9PCnWeFE1PpF1YCdssgK3HLtvig0EIiQqyK6BAAiBDf0ppZWwGat9CYgse26ih-350x350.jpg"
                       let link=item.companylogoslink

                       //console.log(link);  
                       // decodeImage(item.Logo,item.id+22);
                        //let link="./Companyphotos/"+item.id+".png"
                        //let link="https://www.joblisting.com/Companyphotos/"+item.id+".png"
                       // let link="./Companyphotos/"+'"+item.id+"'+"'+.png+'"
                      // let link="https://www.joblisting.com/"+item.id+".png"
                   
                 // let link="https://cutshort.io/_next/image?url=https%3A%2F%2Fcdn.cutshort.io%2Fpublic%2Fcompanies%2F56b9a86b4db389ca0d2d1b60%2Finfosys-logo&w=128&q=75"
                 //let link="https://www.joblisting.com/Companyphotos/134225813.png"
               //let link="/_next/image?url=https%3A%2F%2Fcdn.cutshort.io%2Fpublic%2Fcompanies%2F56b9a86b4db389ca0d2d1b60%2Finfosys-logo&w=256&q=75" 
                        let Id=item.id
            
                        let job=`"https://www.joblisting.com/job/View/${Id}"`
                    
                        table_body += '<div id="card">'
                        table_body += '<div id="card1">'
                        table_body +='<img src="'+link+'" width="60" height="60"  style="display:block ">'  + '</img>'
                        table_body += '<p style="width: 70%;">' + item.Jobtitle + '</p>'
                        table_body += '<p>'  + '<a id="downloadbutton" href=' +job+' >Apply Now </a>' + '</p>'
                        table_body += '</div>'
                        table_body += '</div>'                        
                    });
                    table_body += '</div>';
                    con.query("select STRING_AGG(cast( t.Username as NVARCHAR(MAX)),',') as Email from  userprofiles t inner join User_Skills s on s.UserId =t.UserId  where SkillName in(select top 10 MSkills from webjoblist   where DateCreated >= DATEADD(day, -2, getdate()) and EmailSent='N')",(er,rs)=>{
                        if(er){
                             console.log(er)
                         }else{
                           
                            let mailList=rs.recordset[0].Email  
                            
                             //my code starts from here
                             if(mailList==null || mailList!=null){
                             //console.log("hello world")
                             con.query("select STRING_AGG(cast( t.Username as NVARCHAR(MAX)),',') as Email from  userprofiles t inner join User_Skills s on s.UserId =t.UserId",(er,rs)=>{
                                if(er){
                                     console.log(er)
                                 }else{
                                    
                                      let mailList=rs.recordset[0].Email;
                                    
                                      let messageOptions = {
                                        from:process.env.MAIL,
                                        to:"Jobseeker.Chetan@gmail.com",
                                        subject: `Job are available in new technologies with more package apply or upgrade yourself`,
                                           html: `<html>
                                                <head>
                                                <title></title>
                                                <style>
                                                #Container
                                                {
                                                    background-color: #34ba08;
                                                    border-radius: 4px;
                                                    border: 1px solid #e3e3e3;
                                                    text-align: justify;
                                                    padding: 2px;
                                                    width: 60%;
                                                    color: #fff;
                                                    margin : 0 auto;
                                                }
                                                #Container1{
                                                    background-color:#fff;
                                                    color:#000;
                                                    padding:2px;
                                                }
                                                #Container2{
                                                    display:block;
                                                    margin:0 auto;
                                                 }
                                                 body
                                                 {
                                                     background-color: #f5f5f5;
                                                     text-align:center;
                                                     padding:10px;
                                                     font-family: Tahoma;
                                                 }
                                                 #card{
                                                    background: #fff !important;
                                                    display: flex;
                                                    color: #000;
                                                    padding: 10px;
                                                    margin: 0px 0px;
                                                    align-items: center !important;
                                                    display:block;
                                                    border: 2px dashed #3bf600;
                                                    justify-content: space-between !important;
                                                }
                                                #card1{
                                                    display: flex;
                                                    gap:10px;
                                                    justify-content: space-around !important;
                                                }
                                                #downloadbutton{                 
                                                background: #000;
                                                padding: 4px 7px;
                                                border-radius: 25px;
                                                color: #fff;
                                                text-decoration: none;
                                                }
                                                </style>
                                                                            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
                                                                            <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
                                                                        </head>
                                                                        <body style="background-color: #f5f5f5; text-align:center; padding:10px; font-family: Tahoma;">
                                                                            <div style="text-align:left; padding-top:10px; padding-bottom:10px;">
                                                                            </div>
                                                                            <div id="Container">
                                                                            <div id="Container1">
                                                                             <img  id="Container2" width="200" height="50" src="https://www.joblisting.com/Content/homed/img/logo.png"/>
                                                                            <h2>Hello,</h2>
                                                                            <p>Your skills matches the below listed jobs, <b>Apply Now</b></p>
                                                                            </div>
                                                                            ${table_body}                                               
                                                                                <div>
                                                                                <p style="margin-bottom: 0px;"><b>ALL THE BEST</b></p>
                                                                                    <br>
                                                                                    <p style="margin-bottom: 0px;">Thanks,</p>
                                                                                    <p>JobListing Team</p>
                                                                                    <div style="font-size: 12px;">
                                                                                        <a href="https://www.joblisting.com/terms">Terms Of Use</a> | <a href="https://www.joblisting.com/privacy">Privacy</a> | <a href="https://www.joblisting.com/copyright">Copyright</a><br />
                                                                                        <p>If you want to opt out of receiving future emails from us, contact us at support@joblisting.com. If your Internet provider filters incoming email, please add support@joblisting.com to your list of approved senders. Please do not reply to this email as this is a computer-generated message. For further assistance, please contact us at support@joblisting.com</p>
                                                                                        <b>Disclaimer!</b>
                                                                                        <p>This is a genuine message/alert sent according to our <a href="https://www.joblisting.com/terms">Terms Of Use</a> and <a href="https://www.joblisting.com/privacy">Privacy</a>. Please do not reply to this email, as this is a computer-generated message/alert.    While all reasonable care has been taken in the preparation of the information contained in this email, Joblisting, Inc. or its related parties take no any responsibility for any action(s) taken on the basis of this message/alert, basis of the information contained herein or for any errors or omissions in that information. This email is intended for the use of the addressee only. If you are not the intended recipient of this message, kindly do not read or keep this message/alert with you and notify us at support@joblisting.com</p>
                                                                                        <p>You may have received this message/alert as "forward-to-a-friend" message. Joblisting, Inc. did not offer any kind of benefit and any gain to the forwarder or to the recommender and or did not give the forwarder or the recommender some other benefit in relation to sending you this message/alert. Also Joblisting, Inc. did not offer money, coupons, discounts,  awards, additional entries in a sweepstakes, any kind of benefit in exchange for generating traffic to website or the like in exchange for forwarding and or sending this message/alert and or recommending you in relation to this message/alert. </p>
                                                                                    </div>                                 
                                                                                </div>
                                                                            </div>
                                                                        </body>
                                                                    </html>`
                                   }; 
                                   mailgun.messages().send(messageOptions, function (error, info) {
                                       if (error) {
                                           console.log(error)
                                           
                                           throw error;
                                       }else {
                                           con.query("UPDATE WebJobList SET EmailSent = 'Y' WHERE id IN(SELECT TOP (10) id FROM WebJobList where DateCreated >= DATEADD(day, -2, getdate()) )",(error,result)=>{
                                               if(error){
                                                   console.log(error)
                                               }else{
                                                 console.log("update y successfully")  
                                              }

                                           })
                                         
   
                                       }
                                   })
                                  res.status(200).json({ status: true,message:'Fetch data successfully'
                           
                            })            
                           }
                        }
                    )}

                           
                    }
                     })
                }
            })


            }
    }) 
})

const user_profile_share999=schedule.scheduleJob('0 0 * * *',function(){             
    com = ",";
    var a="select STRING_AGG(cast(EmailID as NVARCHAR(MAX)),'"+com+"') as Email  FROM shareJMails where EmailID  LIKE '%@%.%' AND PATINDEX('%[^a-z,0-9,@,.,,\-]%',EmailID ) = 0 "
      con.query(a,(er,rs)=>{
         if(er){
             console.log(er)
         }else{
            if(rs.recordset[0].Email!==null){
                console.log("99 is called")
                var mailList=rs.recordset[0].Email   
             let messageOptions = {
                from:process.env.MAIL,
                to:"Jobseeker.Chetan@gmail.com",
                subject: `Shared job profiles`,
                html: `<html>
                <head>
                    <title></title>
                    <style>
                        #Container
                        {
                            background-color:white;
                            
                            border-radius: 4px;
                            border: 1px solid #e3e3e3;
                            text-align: justify;
                            padding:25px;
                        }
                        body
                        {
                            background-color: #f5f5f5;
                            text-align:center;
                            padding:10px;
                            font-family: Tahoma;
                        }
                    </style>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
                    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
                </head>
                <body style="background-color: #f5f5f5; text-align:center; padding:10px; font-family: Tahoma;">
                    <div style="text-align:left; padding-top:10px; padding-bottom:10px;">
                    </div>
            
                    <div id="Container">
                        <p>Hello</p><br />
                   <p>JobListing’s mission is to accelerate your job hunt. You can use the platform to access several job listings across the globe, find the job that suits your profile best, and boost your professional career.</p><br>  
                   <p>Ready to begin? Choose one of the options below:</p>
                        <div>
                        <ul>
                        <li style="color: LightSeaGreen;"><a href="https://www.joblisting.com/account/registernow" >Register</a></li>
                        <li style="color: OrangeRed;"><a href="https://www.joblisting.com/jobseeker/updateprofile">Update Profile</a></li>
                        <li style="color: DodgerBlue ;"><a href="https://www.joblisting.com/jobs">Apply Job</a></li>
                        </ul> <br>
                            <p style="margin-bottom: 0px;"><b>ALL THE BEST</b></p>
                            <br>
                            <p style="margin-bottom: 0px;">Thanks,</p>
                            <p>JobListing Team</p>
                            <div style="font-size: 12px;">
            
                                <a href="https://www.joblisting.com/terms">Terms Of Use</a> | <a href="https://www.joblisting.com/privacy">Privacy</a> | <a href="https://www.joblisting.com/copyright">Copyright</a><br />
                                <p>If you want to opt out of receiving future emails from us, contact us at support@joblisting.com. If your Internet provider filters incoming email, please add support@joblisting.com to your list of approved senders. Please do not reply to this email as this is a computer-generated message. For further assistance, please contact us at support@joblisting.com</p>
                                <b>Disclaimer!</b>
                                <p>This is a genuine message/alert sent according to our <a href="https://www.joblisting.com/terms">Terms Of Use</a> and <a href="https://www.joblisting.com/privacy">Privacy</a>. Please do not reply to this email, as this is a computer-generated message/alert.	While all reasonable care has been taken in the preparation of the information contained in this email, Joblisting, Inc. or its related parties take no any responsibility for any action(s) taken on the basis of this message/alert, basis of the information contained herein or for any errors or omissions in that information. This email is intended for the use of the addressee only. If you are not the intended recipient of this message, kindly do not read or keep this message/alert with you and notify us at support@joblisting.com</p>
                                <p>You may have received this message/alert as "forward-to-a-friend" message. Joblisting, Inc. did not offer any kind of benefit and any gain to the forwarder or to the recommender and or did not give the forwarder or the recommender some other benefit in relation to sending you this message/alert. Also Joblisting, Inc. did not offer money, coupons, discounts,  awards, additional entries in a sweepstakes, any kind of benefit in exchange for generating traffic to website or the like in exchange for forwarding and or sending this message/alert and or recommending you in relation to this message/alert. </p>
                            </div>
            
                        </div>
                    </div>
                </body>
            </html>
                `
              }; 
              mailgun.messages().send(messageOptions, function (error, info) {
                if (error) {
                    console.log(error)
                    throw error;
                }else {
                  console.log('User profile9')
                }
            })

            }else{
                console.log("no mail9")
            }

         }
     })
})
app.get("/webjobs2",function(req,res){
    
    con.query("select top 10  JobLink,companylogoslink,MSkills,Jobtitle,t.id,w.Logo,w.companylogoslink from webjoblist t  inner join websitelist w on t.CompanyName = w.CompanyName where t.EmailSent='N' and companylogoslink is not null",(e,r)=>{
        if(e){
            console.log(e)
        }else{
            con.query("select top 10 STRING_AGG(cast(MSkills as NVARCHAR(max)),',') as mskills from webjoblist where DateCreated >= DATEADD(day, -2, getdate()) and EmailSent='N'",(err,rsl)=>{
                if(err){
                    console.log(err)
                }else{
                    let data=[]
                    var tableData = r.recordset
                    for(let i=0;i<tableData.length;i++)
                    {

                     for(let j=0;j<tableData[i].companylogoslink.length;j++)
                     {
                        // if(tableData[i].companylogolink[j]!=undefined || tableData[i].companylogolink[j]!=null || tableData[i.companylogolink[j]!=0])
                        if(Array.isArray(data[i]))
                        data[i][j]=tableData[i].companylogoslink[j]
                        else
                        data[i]=tableData[i].companylogoslink;
                     }

                    }
                   // console.log(data);
                    
                   
                    console.log(data)
                    
                   for(let i=0;i<data.length;i++)
                  {
                    for(let j=0;j<data[i].length;j++)
                    {
                    if(data[i][j].includes("png") || data[i][j].includes("jpg") || data[i][j].includes("jpeg") || data[i][j].includes("gif") || !data[i][j].includes("base64"))
                    {
                        let table_body = '<div>';
                        tableData.forEach(function(item) {
                         
                          
                            // let link="https://cdn.octopix.in/uploads/company-logo/2018/07/06/lidnes-technologies-c3SBC5rMcJs7Nkh7yc9PCnWeFE1PpF1YCdssgK3HLtvig0EIiQqyK6BAAiBDf0ppZWwGat9CYgse26ih-350x350.jpg"
                           let link=item.companylogoslink
    
                           //console.log(link);  
                           // decodeImage(item.Logo,item.id+22);
                            //let link="./Companyphotos/"+item.id+".png"
                            //let link="https://www.joblisting.com/Companyphotos/"+item.id+".png"
                           // let link="./Companyphotos/"+'"+item.id+"'+"'+.png+'"
                          // let link="https://www.joblisting.com/"+item.id+".png"
                       
                     // let link="https://cutshort.io/_next/image?url=https%3A%2F%2Fcdn.cutshort.io%2Fpublic%2Fcompanies%2F56b9a86b4db389ca0d2d1b60%2Finfosys-logo&w=128&q=75"
                     //let link="https://www.joblisting.com/Companyphotos/134225813.png"
                   //let link="/_next/image?url=https%3A%2F%2Fcdn.cutshort.io%2Fpublic%2Fcompanies%2F56b9a86b4db389ca0d2d1b60%2Finfosys-logo&w=256&q=75" 
                            let Id=item.id
                
                            let job=`"https://www.joblisting.com/job/View/${Id}"`
                        
                            table_body += '<div id="card">'
                            table_body += '<div id="card1">'
                            table_body +='<img src="'+link+'" width="60" height="60"  style="display:block ">'  + '</img>'
                            table_body += '<p style="width: 70%;">' + item.Jobtitle + '</p>'
                            table_body += '<p>'  + '<a id="downloadbutton" href=' +job+' >Apply Now </a>' + '</p>'
                            table_body += '</div>'
                            table_body += '</div>'                        
                        });
                        table_body += '</div>';
                        con.query("select STRING_AGG(cast( t.Username as NVARCHAR(MAX)),',') as Email from  userprofiles t inner join User_Skills s on s.UserId =t.UserId  where SkillName in(select top 10 MSkills from webjoblist   where DateCreated >= DATEADD(day, -2, getdate()) and EmailSent='N')",(er,rs)=>{
                            if(er){
                                 console.log(er)
                             }else{
                               
                                let mailList=rs.recordset[0].Email  
                                
                                 //my code starts from here
                                 if(mailList==null || mailList!=null){
                                 //console.log("hello world")
                                 con.query("select STRING_AGG(cast( t.Username as NVARCHAR(MAX)),',') as Email from  userprofiles t inner join User_Skills s on s.UserId =t.UserId",(er,rs)=>{
                                    if(er){
                                         console.log(er)
                                     }else{
                                        
                                          let mailList=rs.recordset[0].Email;
                                        
                                          let messageOptions = {
                                            from:process.env.MAIL,
                                            to:"Jobseeker.Chetan@gmail.com",
                                            subject: `Job are available in new technologies with more package apply or upgrade yourself`,
                                               html: `<html>
                                                    <head>
                                                    <title></title>
                                                    <style>
                                                    #Container
                                                    {
                                                        background-color: #34ba08;
                                                        border-radius: 4px;
                                                        border: 1px solid #e3e3e3;
                                                        text-align: justify;
                                                        padding: 2px;
                                                        width: 60%;
                                                        color: #fff;
                                                        margin : 0 auto;
                                                    }
                                                    #Container1{
                                                        background-color:#fff;
                                                        color:#000;
                                                        padding:10px;
                                                    }
                                                    #Container2{
                                                        display:block;
                                                        margin:0 auto;
                                                     }
                                                     body
                                                     {
                                                         background-color: #f5f5f5;
                                                         text-align:center;
                                                         padding:10px;
                                                         font-family: Tahoma;
                                                     }
                                                     #card{
                                                        background: #fff !important;
                                                        display: flex;
                                                        color: #000;
                                                        padding: 10px;
                                                        margin: 0px 0px;
                                                        align-items: center !important;
                                                        display:block;
                                                        border: 2px dashed #3bf600;
                                                        justify-content: space-between !important;
                                                    }
                                                    #card1{
                                                        display: flex;
                                                        gap:10px;
                                                        justify-content: space-around !important;
                                                    }
                                                    #downloadbutton{                 
                                                    background: #000;
                                                    padding: 4px 7px;
                                                    border-radius: 25px;
                                                    color: #fff;
                                                    text-decoration: none;
                                                    }
                                                    </style>
                                                                                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
                                                                                <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
                                                                            </head>
                                                                            <body style="background-color: #f5f5f5; text-align:center; padding:10px; font-family: Tahoma;">
                                                                                <div style="text-align:left; padding-top:10px; padding-bottom:10px;">
                                                                                </div>
                                                                                <div id="Container">
                                                                                <div id="Container1">
                                                                                 <img  id="Container2" width="200" height="50" src="https://www.joblisting.com/Content/homed/img/logo.png"/>
                                                                                <h2>Hello,</h2>
                                                                                <p>Your skills matches the below listed jobs, <b>Apply Now</b></p>
                                                                                </div>
                                                                                ${table_body}                                               
                                                                                    <div>
                                                                                    <p style="margin-bottom: 0px;"><b>ALL THE BEST</b></p>
                                                                                        <br>
                                                                                        <p style="margin-bottom: 0px;">Thanks,</p>
                                                                                        <p>JobListing Team</p>
                                                                                        <div style="font-size: 12px;">
                                                                                            <a href="https://www.joblisting.com/terms">Terms Of Use</a> | <a href="https://www.joblisting.com/privacy">Privacy</a> | <a href="https://www.joblisting.com/copyright">Copyright</a><br />
                                                                                            <p>If you want to opt out of receiving future emails from us, contact us at support@joblisting.com. If your Internet provider filters incoming email, please add support@joblisting.com to your list of approved senders. Please do not reply to this email as this is a computer-generated message. For further assistance, please contact us at support@joblisting.com</p>
                                                                                            <b>Disclaimer!</b>
                                                                                            <p>This is a genuine message/alert sent according to our <a href="https://www.joblisting.com/terms">Terms Of Use</a> and <a href="https://www.joblisting.com/privacy">Privacy</a>. Please do not reply to this email, as this is a computer-generated message/alert.    While all reasonable care has been taken in the preparation of the information contained in this email, Joblisting, Inc. or its related parties take no any responsibility for any action(s) taken on the basis of this message/alert, basis of the information contained herein or for any errors or omissions in that information. This email is intended for the use of the addressee only. If you are not the intended recipient of this message, kindly do not read or keep this message/alert with you and notify us at support@joblisting.com</p>
                                                                                            <p>You may have received this message/alert as "forward-to-a-friend" message. Joblisting, Inc. did not offer any kind of benefit and any gain to the forwarder or to the recommender and or did not give the forwarder or the recommender some other benefit in relation to sending you this message/alert. Also Joblisting, Inc. did not offer money, coupons, discounts,  awards, additional entries in a sweepstakes, any kind of benefit in exchange for generating traffic to website or the like in exchange for forwarding and or sending this message/alert and or recommending you in relation to this message/alert. </p>
                                                                                        </div>                                 
                                                                                    </div>
                                                                                </div>
                                                                            </body>
                                                                        </html>`
                                       }; 
                                       mailgun.messages().send(messageOptions, function (error, info) {
                                           if (error) {
                                               console.log(error)
                                               
                                               throw error;
                                           }else {
                                               con.query("UPDATE WebJobList SET EmailSent = 'Y' WHERE id IN(SELECT TOP (10) id FROM WebJobList where DateCreated >= DATEADD(day, -2, getdate()) )",(error,result)=>{
                                                   if(error){
                                                       console.log(error)
                                                   }else{
                                                     console.log("update y successfully")  
                                                  }
    
                                               })
                                             
       
                                           }
                                       })
                                    //   res.status(200).json({ status: true,message:'Fetch data successfully'
                                    console.log("yes")
                               
                               // })            
                               }
                            }
                        )}
    
                               
                        }
                         })
                      

                    }
                }
                }
                    
                   
                  
                    //upto here
                }//done
            })


            }
    }) //done
})
//const webjobs3=schedule.scheduleJob('* * * * *',
app.get('/webjobs3',function(req,res){ 
    
    con.query("select top 10  JobLink,MSkills,Jobtitle,t.id ,w.companylogoslink from websitelist w inner join webjoblist t  on t.CompanyName = w.CompanyName where w.DateCreated >= DATEADD(day,-60,getdate()) and t.EmailSent='N' and companylogoslink is not null",(e,r)=>{
        if(e){
            console.log(e)
        }else{
            con.query("select top 10 STRING_AGG(cast(MSkills as NVARCHAR(max)),',') as mskills from webjoblist where DateCreated >= DATEADD(day,-60,getdate()) and EmailSent='N'",(err,rsl)=>{
                if(err){
                    console.log(err)
                }else{
                    
                    var tableData = r.recordset
                    
                    
                    let table_body = '<div>';
                    tableData.forEach(function(item) {
                     
                       // console.log(tableData)
                        
                        // let link="https://cdn.octopix.in/uploads/company-logo/2018/07/06/lidnes-technologies-c3SBC5rMcJs7Nkh7yc9PCnWeFE1PpF1YCdssgK3HLtvig0EIiQqyK6BAAiBDf0ppZWwGat9CYgse26ih-350x350.jpg"
                       //let link=item.companylogoslink
                    //   let link="https://th.bing.com/th?q=Korean+Pvt.Ltd+Logo&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-IN&cc=IN&setlang=en&adlt=moderate&t=1&mw=247"
                       let link=item.companylogoslink
                       console.log("links links links links")
                       console.log(link)
                       //console.log(link);  
                       // decodeImage(item.Logo,item.id+22);
                        //let link="./Companyphotos/"+item.id+".png"
                        //let link="https://www.joblisting.com/Companyphotos/"+item.id+".png"
                       // let link="./Companyphotos/"+'"+item.id+"'+"'+.png+'"
                      // let link="https://www.joblisting.com/"+item.id+".png"
                   
                 // let link="https://cutshort.io/_next/image?url=https%3A%2F%2Fcdn.cutshort.io%2Fpublic%2Fcompanies%2F56b9a86b4db389ca0d2d1b60%2Finfosys-logo&w=128&q=75"
                 //let link="https://www.joblisting.com/Companyphotos/134225813.png"
               //let link="/_next/image?url=https%3A%2F%2Fcdn.cutshort.io%2Fpublic%2Fcompanies%2F56b9a86b4db389ca0d2d1b60%2Finfosys-logo&w=256&q=75" 
                        let Id=item.id
            
                        let job=`"https://www.joblisting.com/job/View/${Id}"`
                    
                        table_body += '<div id="card">'
                        table_body += '<div id="card1">'
                        table_body +='<img src="'+link+'" width="60" height="60"  style="display:block ">'  + '</img>'
                        
                        table_body += '<p style="width: 70%;">' + item.Jobtitle + '</p>'
                        table_body += '<p>'  + '<a id="downloadbutton" href=' +job+' >Apply Now </a>' + '</p>'
                        table_body += '</div>'
                        table_body += '</div>'                        
                    });
                    table_body += '</div>';
                    con.query("select STRING_AGG(cast( t.Username as NVARCHAR(MAX)),',') as Email from  userprofiles t inner join User_Skills s on s.UserId =t.UserId  where SkillName in(select top 10 MSkills from webjoblist   where DateCreated >= DATEADD(day,-60,getdate()) and EmailSent='N')",(er,rs)=>{
                        if(er){
                             console.log(er)
                         }else{
                           
                            let mailList=rs.recordset[0].Email  
                             //my code starts from here
                             if(mailList==null || mailList!=null){
                             //console.log("hello world")
                             con.query("select STRING_AGG(cast( t.Username as NVARCHAR(MAX)),',') as Email from  userprofiles t inner join User_Skills s on s.UserId =t.UserId",(er,rs)=>{
                                if(er){
                                     console.log(er)
                                 }else{
                                    
                                      let mailList=rs.recordset[0].Email;
                                    
                                      let messageOptions = {
                                        from:process.env.MAIL,
                                        to:"Jobseeker.Chetan@gmail.com",
                                        subject: `Job are available in new technologies with more package apply or upgrade yourself`,
                                           html: `<html>
                                                <head>
                                                <title></title>
                                                <style>
                                                #Container
                                                {
                                                    background-color: #34ba08;
                                                    border-radius: 4px;
                                                    border: 1px solid #e3e3e3;
                                                    text-align: justify;
                                                    padding: 2px;
                                                    width: 60%;
                                                    color: #fff;
                                                    margin : 0 auto;
                                                }
                                                #Container1{
                                                    background-color:#fff;
                                                    color:#000;
                                                    padding:2px;
                                                }
                                                #Container2{
                                                    display:block;
                                                    margin:0 auto;
                                                 }
                                                 body
                                                 {
                                                     background-color: #f5f5f5;
                                                     text-align:center;
                                                     padding:10px;
                                                     font-family: Tahoma;
                                                 }
                                                 #card{
                                                    background: #fff !important;
                                                    display: flex;
                                                    color: #000;
                                                    padding: 10px;
                                                    margin: 0px 0px;
                                                    align-items: center !important;
                                                    display:block;
                                                    border: 2px dashed #3bf600;
                                                    justify-content: space-between !important;
                                                }
                                                #card1{
                                                    display: flex;
                                                    gap:10px;
                                                    justify-content: space-around !important;
                                                }
                                                #downloadbutton{                 
                                                background: #000;
                                                padding: 4px 7px;
                                                border-radius: 25px;
                                                color: #fff;
                                                text-decoration: none;
                                                }
                                                </style>
                                                                            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
                                                                            <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
                                                                        </head>
                                                                        <body style="background-color: #f5f5f5; text-align:center; padding:10px; font-family: Tahoma;">
                                                                            <div style="text-align:left; padding-top:10px; padding-bottom:10px;">
                                                                            </div>
                                                                            <div id="Container">
                                                                            <div id="Container1">
                                                                             <img  id="Container2" width="200" height="50" src="https://www.joblisting.com/Content/homed/img/logo.png"/>
                                                                            <h2>Hello,</h2>
                                                                            <p>Your skills matches the below listed jobs, <b>Apply Now</b></p>
                                                                            </div>
                                                                            ${table_body}                                               
                                                                                <div>
                                                                                <p style="margin-bottom: 0px;"><b>ALL THE BEST</b></p>
                                                                                    <br>
                                                                                    <p style="margin-bottom: 0px;">Thanks,</p>
                                                                                    <p>JobListing Team</p>
                                                                                    <div style="font-size: 12px;">
                                                                                        <a href="https://www.joblisting.com/terms">Terms Of Use</a> | <a href="https://www.joblisting.com/privacy">Privacy</a> | <a href="https://www.joblisting.com/copyright">Copyright</a><br />
                                                                                        <p>If you want to opt out of receiving future emails from us, contact us at support@joblisting.com. If your Internet provider filters incoming email, please add support@joblisting.com to your list of approved senders. Please do not reply to this email as this is a computer-generated message. For further assistance, please contact us at support@joblisting.com</p>
                                                                                        <b>Disclaimer!</b>
                                                                                        <p>This is a genuine message/alert sent according to our <a href="https://www.joblisting.com/terms">Terms Of Use</a> and <a href="https://www.joblisting.com/privacy">Privacy</a>. Please do not reply to this email, as this is a computer-generated message/alert.    While all reasonable care has been taken in the preparation of the information contained in this email, Joblisting, Inc. or its related parties take no any responsibility for any action(s) taken on the basis of this message/alert, basis of the information contained herein or for any errors or omissions in that information. This email is intended for the use of the addressee only. If you are not the intended recipient of this message, kindly do not read or keep this message/alert with you and notify us at support@joblisting.com</p>
                                                                                        <p>You may have received this message/alert as "forward-to-a-friend" message. Joblisting, Inc. did not offer any kind of benefit and any gain to the forwarder or to the recommender and or did not give the forwarder or the recommender some other benefit in relation to sending you this message/alert. Also Joblisting, Inc. did not offer money, coupons, discounts,  awards, additional entries in a sweepstakes, any kind of benefit in exchange for generating traffic to website or the like in exchange for forwarding and or sending this message/alert and or recommending you in relation to this message/alert. </p>
                                                                                    </div>                                 
                                                                                </div>
                                                                            </div>
                                                                        </body>
                                                                    </html>`
                                   }; 
                                   mailgun.messages().send(messageOptions, function (error, info) {
                                       if (error) {
                                           console.log(error)
                                           
                                           throw error;
                                       }else {
                                           con.query("UPDATE WebJobList SET EmailSent = 'Y' WHERE id IN(SELECT TOP (10) id FROM WebJobList where DateCreated >= DATEADD(day, -2, getdate()) )",(error,result)=>{
                                               if(error){
                                                   console.log(error)
                                               }else{
                                                 console.log("update y successfully")  
                                              }

                                           })
                                         
   
                                       }
                                   })
                                  res.status(200).json({ status: true,message:'Fetch data successfully'
                           
                            })            
                           }
                        }
                    )}

                           
                    }
                     })
                }
            })


            }
    }) 
})

app.get("/webjobs4",function(req,res){

    con.query("select top 20  JobLink,MSkills,Jobtitle,t.id ,w.companylogoslink from websitelist w inner join webjoblist t  on t.CompanyName = w.CompanyName where w.DateCreated >= DATEADD(day,-60,getdate()) and t.EmailSent='N' and companylogoslink is not null and t.MSkills is not null",(e,r)=>{
        if(e){
            console.log(e)
        }else{
            con.query("select top 10 STRING_AGG(cast(MSkills as NVARCHAR(max)),',') as mskills from webjoblist where DateCreated >= DATEADD(day,-60,getdate()) and EmailSent='N'",(err,rsl)=>{
                if(err){
                    console.log(err)
                }else{
                    
                    var tableData = r.recordset
                    
                    const transporter=nodemailer.createTransport(mailGun(auth))
                    let table_body = '<div>';
                    tableData.forEach(function(item) {
                     
                        console.log(tableData)
                        
                        // let link="https://cdn.octopix.in/uploads/company-logo/2018/07/06/lidnes-technologies-c3SBC5rMcJs7Nkh7yc9PCnWeFE1PpF1YCdssgK3HLtvig0EIiQqyK6BAAiBDf0ppZWwGat9CYgse26ih-350x350.jpg"
                       let link=item.companylogoslink

                       //console.log(link);  
                       // decodeImage(item.Logo,item.id+22);
                        //let link="./Companyphotos/"+item.id+".png"
                        //let link="https://www.joblisting.com/Companyphotos/"+item.id+".png"
                       // let link="./Companyphotos/"+'"+item.id+"'+"'+.png+'"
                      // let link="https://www.joblisting.com/"+item.id+".png"
                   
                 // let link="https://cutshort.io/_next/image?url=https%3A%2F%2Fcdn.cutshort.io%2Fpublic%2Fcompanies%2F56b9a86b4db389ca0d2d1b60%2Finfosys-logo&w=128&q=75"
                 //let link="https://www.joblisting.com/Companyphotos/134225813.png"
               //let link="/_next/image?url=https%3A%2F%2Fcdn.cutshort.io%2Fpublic%2Fcompanies%2F56b9a86b4db389ca0d2d1b60%2Finfosys-logo&w=256&q=75" 
                        let Id=item.id
            
                        let job=`"https://www.joblisting.com/job/View/${Id}"`
                    
                        table_body += '<div id="card">'
                        table_body += '<div id="card1">'
                        table_body +='<img src="'+link+'" width="60" height="60"  style="display:block ">'  + '</img>'
                        table_body += '<p style="width: 70%;">' + item.Jobtitle + '</p>'
                        table_body += '<p>'  + '<a id="downloadbutton" href=' +job+' >Apply Now </a>' + '</p>'
                        table_body += '</div>'
                        table_body += '</div>'                        
                    });
                    table_body += '</div>';
                    con.query("select STRING_AGG(cast( t.Username as NVARCHAR(MAX)),',') as Email from  userprofiles t inner join User_Skills s on s.UserId =t.UserId  where SkillName in(select top 10 MSkills from webjoblist   where DateCreated >= DATEADD(day,-60,getdate()) and EmailSent='N')",(er,rs)=>{
                        if(er){
                             console.log(er)
                         }else{
                           
                            let mailList=rs.recordset[0].Email  
                            console.log("this is the mailList")
                            console.log(mailList);
                            console.log("this is the MSkills")
                            console.log(rs.recordset[0].MSkills)
                             //my code starts from here
                             if(mailList!=null){
                             //console.log("hello world")
                             con.query("select STRING_AGG(cast( t.Username as NVARCHAR(MAX)),',') as Email from  userprofiles t inner join User_Skills s on s.UserId =t.UserId",(er,rs)=>{
                                if(er){
                                     console.log(er)
                                 }else{
                                    
                                      let mailList=rs.recordset[0].Email;
                                      console.log("This is the inncer mailList")
                                      console.log(mailList);
                                      let messageOptions = {
                                        from:process.env.MAIL,
                                        to:"Jobseeker.Chetan@gmail.com",
                                        subject: `Job are available in new technologies with more package apply or upgrade yourself`,
                                           html: `<html>
                                                <head>
                                                <title></title>
                                                <style>
                                                #Container
                                                {
                                                    background-color: #34ba08;
                                                    border-radius: 4px;
                                                    border: 1px solid #e3e3e3;
                                                    text-align: justify;
                                                    padding: 2px;
                                                    width: 60%;
                                                    color: #fff;
                                                    margin : 0 auto;
                                                }
                                                #Container1{
                                                    background-color:#fff;
                                                    color:#000;
                                                    padding:2px;
                                                }
                                                #Container2{
                                                    display:block;
                                                    margin:0 auto;
                                                 }
                                                 body
                                                 {
                                                     background-color: #f5f5f5;
                                                     text-align:center;
                                                     padding:10px;
                                                     font-family: Tahoma;
                                                 }
                                                 #card{
                                                    background: #fff !important;
                                                    display: flex;
                                                    color: #000;
                                                    padding: 10px;
                                                    margin: 0px 0px;
                                                    align-items: center !important;
                                                    display:block;
                                                    border: 2px dashed #3bf600;
                                                    justify-content: space-between !important;
                                                }
                                                #card1{
                                                    display: flex;
                                                    gap:10px;
                                                    justify-content: space-around !important;
                                                }
                                                #downloadbutton{                 
                                                background: #000;
                                                padding: 4px 7px;
                                                border-radius: 25px;
                                                color: #fff;
                                                text-decoration: none;
                                                }
                                                </style>
                                                                            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
                                                                            <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
                                                                        </head>
                                                                        <body style="background-color: #f5f5f5; text-align:center; padding:10px; font-family: Tahoma;">
                                                                            <div style="text-align:left; padding-top:10px; padding-bottom:10px;">
                                                                            </div>
                                                                            <div id="Container">
                                                                            <div id="Container1">
                                                                             <img  id="Container2" width="200" height="50" src="https://www.joblisting.com/Content/homed/img/logo.png"/>
                                                                            <h2>Hello,</h2>
                                                                            <p>Your skills matches the below listed jobs, <b>Apply Now</b></p>
                                                                            </div>
                                                                            ${table_body}                                               
                                                                                <div>
                                                                                <p style="margin-bottom: 0px;"><b>ALL THE BEST</b></p>
                                                                                    <br>
                                                                                    <p style="margin-bottom: 0px;">Thanks,</p>
                                                                                    <p>JobListing Team</p>
                                                                                    <div style="font-size: 12px;">
                                                                                        <a href="https://www.joblisting.com/terms">Terms Of Use</a> | <a href="https://www.joblisting.com/privacy">Privacy</a> | <a href="https://www.joblisting.com/copyright">Copyright</a><br />
                                                                                        <p>If you want to opt out of receiving future emails from us, contact us at support@joblisting.com. If your Internet provider filters incoming email, please add support@joblisting.com to your list of approved senders. Please do not reply to this email as this is a computer-generated message. For further assistance, please contact us at support@joblisting.com</p>
                                                                                        <b>Disclaimer!</b>
                                                                                        <p>This is a genuine message/alert sent according to our <a href="https://www.joblisting.com/terms">Terms Of Use</a> and <a href="https://www.joblisting.com/privacy">Privacy</a>. Please do not reply to this email, as this is a computer-generated message/alert.    While all reasonable care has been taken in the preparation of the information contained in this email, Joblisting, Inc. or its related parties take no any responsibility for any action(s) taken on the basis of this message/alert, basis of the information contained herein or for any errors or omissions in that information. This email is intended for the use of the addressee only. If you are not the intended recipient of this message, kindly do not read or keep this message/alert with you and notify us at support@joblisting.com</p>
                                                                                        <p>You may have received this message/alert as "forward-to-a-friend" message. Joblisting, Inc. did not offer any kind of benefit and any gain to the forwarder or to the recommender and or did not give the forwarder or the recommender some other benefit in relation to sending you this message/alert. Also Joblisting, Inc. did not offer money, coupons, discounts,  awards, additional entries in a sweepstakes, any kind of benefit in exchange for generating traffic to website or the like in exchange for forwarding and or sending this message/alert and or recommending you in relation to this message/alert. </p>
                                                                                    </div>                                 
                                                                                </div>
                                                                            </div>
                                                                        </body>
                                                                    </html>`
                                   }; 
                                //    mailgun.messages().send(messageOptions, function (error, info) {
                                //        if (error) {
                                //            console.log(error)
                                           
                                //            throw error;
                                //        }else {
                                //            con.query("UPDATE WebJobList SET EmailSent = 'Y' WHERE id IN(SELECT TOP (10) id FROM WebJobList where DateCreated >= DATEADD(day, -2, getdate()) )",(error,result)=>{
                                //                if(error){
                                //                    console.log(error)
                                //                }else{
                                //                  console.log("update y successfully")  
                                //               }

                                //            })
                                         
   
                                //        }
                                //    })
                                
                                transporter.sendMail(messageOptions,function(err,info){
                                    if(err){
                                        console.log(err)
                                    }
                                    else
                                    console.log("success")
                                })
                                  res.status(200).json({ status: true,message:'Fetch data successfully'
                           
                            })            
                           }
                        }
                    )}

                           
                    }
                     })
                }
            })


            }
    }) 
})
 

})

