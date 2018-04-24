const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

app.set('port',(process.env.PORT || 5000))

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.get('/',function(req,res){
	res.send('Hi I am lol')
})

let token = ""

app.get('/webhook/',function(req,res){
	if(req.query['hub.verify_token']=='mchatb'){
		res.send(req.query['hub.challenge'])
	}
	res.send('Wrong Token')
})



app.post('/webhook/',function(req,res){
	let mevent = req.body.entry[0].messaging
	for(i=0;i<mevent.length;i++){
		let ev = messaging_events[i]
		let sender = ev.sender.id
		if(ev.message && ev.message.text){
			let texta = ev.message.text
			sendText(sender,'Text Echo: I got it')
		}
	}
	res.sendStatus(200)
})

function sendText(sender,text){
	let mess = {text:text}
	request({
		url:'graph.facebook.com/v2.6/me/messages',
		qs:{access_token:token},
		method:"POST",
		json:{
			recipient:{id:sender},
			message:mess
		}
	},function(error,response,body){
		if(error){
			console.log('Sending Error')
		}else if(response.body.error){
			console.log('Response Body Error')
		}
	})
}

app.listen(app.get('port'),function(){
	console.log('Server Running')
})