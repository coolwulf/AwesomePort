// Try to crawl certain blog content & turns out we can directly read json results after analyzing the network traffic LOL

var request= require('request');
var moment = require('moment');
var nodemailer = require('nodemailer'); 
var jade = require('jade');
var EmailTemplate = require('email-templates').EmailTemplate;

var r=request.defaults({jar:true, timeout: 30000});

var blog_addr_json_prefix='http://47.93.113.146:6656/api/v1/list/ccf/';
var blog_addr_json_postfix='/final';

var args = process.argv.slice(2);

var date;

if (args.length>0)
	date=args[0];
else
	date = moment(new Date()).format('YYYY-MM-DD');

console.log('Getting NewsLetter for '+date);

var blog_addr_json=blog_addr_json_prefix+date+blog_addr_json_postfix;

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yours@gmail.com',
    pass: 'yours'
  }
});

var mailOptions = {
  from: 'yours@gmail.com',
  to: 'contact@gmail.com',
  subject: 'Awesomeport.cn NewsLetter '+date,
  text: '',
  html: '',
};

r({
	method: 'GET',
	url: blog_addr_json,	
	dataType: 'json',		
	headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	}		
}, function(error, response, body){
	var body_json=JSON.parse(body);
	// construct the newsletter, just a mockup here you can format in better html form.
	if (body_json.data.length>0) {

		
		var html = jade.renderFile('./html.jade', {data: body_json.data});
		mailOptions.html=html;

		transporter.sendMail(mailOptions, function(error, info){
		  if (error) {
		    console.log(error);
		  } else {
		    console.log('Email sent: ' + info.response);
		  }
		}); 	
	} else {
		console.log('No news for the day.');
	}
});