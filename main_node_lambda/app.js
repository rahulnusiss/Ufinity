'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const compression = require('compression')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const app = express()

// For validation api's
var validater = require('./validate').validation;
var verification = new validater();

// using lambda
var AWS = require('aws-sdk');
AWS.config.region = 'ap-southeast-1';
var lambda = new AWS.Lambda();

// API's
var API_REGISTER = '/register'
var API_SUSPEND = '/suspend'
var API_NOTIFY = '/notify'
var API_COMMON = '/common'

app.set('view engine', 'pug')
app.use(compression())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(awsServerlessExpressMiddleware.eventContext())

app.get('/', (req, res) => {
  res.render('index', {
    apiUrl: req.apiGateway ? `https://${req.apiGateway.event.headers.Host}/${req.apiGateway.event.requestContext.stage}` : 'http://localhost:3000'
  })
})

// register
app.post(API_REGISTER, (req, res) => { 

  // validate and then process
  if (verification.validateRegister(req.body)){

    var params= {
      FunctionName: 'ufinity_ufinity_register_new',
      InvocationType: 'RequestResponse',
      LogType: 'Tail',
      Payload: JSON.stringify(req.body)
    }
    lambda.invoke(params, function(err, data){
      if (err){
        res.status(500).json(err)
      }else{
        res.status(200).json(data.Payload)
      }
    })
  }
  else{
    return res.status(504).json({'message' : 'One or more values is not email id in payload'})
  }    
})

// suspend
app.post(API_SUSPEND, (req, res) => {  
  
  if (verification.validateSuspend(req.body)){
    var params= {
      FunctionName: 'ufinity_suspend',
      InvocationType: 'RequestResponse',
      LogType: 'Tail',
      Payload: JSON.stringify(req.body)
    }
    lambda.invoke(params, function(err, data){
      if (err){
        res.status(500).json(err)
      }else{
        res.status(200).json(data.Payload)
      }
    })
  }else{
    return res.status(504).json({'message' : 'please provide correct email id of student'})
  }  
})

// notify
app.post(API_NOTIFY, (req, res) => {  
  
  if (verification.validateNotify(req.body)){
    var params= {
      FunctionName: 'ufinity_notify',
      InvocationType: 'RequestResponse',
      LogType: 'Tail',
      Payload: JSON.stringify(req.body)
    }
    lambda.invoke(params, function(err, data){
      if (err){
        res.status(500).json(err)
      }else{
        res.status(200).json(data.Payload)
      }
    })
  }else{
    return res.status(504).json({'message' : 'One or more values incorrect in payload'})
  }  
})

// common
app.get(API_COMMON, (req, res) => {
  
  var params= {
    FunctionName: 'ufinity_common',
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
    Payload: JSON.stringify(req.query)
  }
  lambda.invoke(params, function(err, data){
    if (err){
      res.status(500).json(err)
    }else{
      res.status(200).json(data.Payload)
    }
  })  
})

// Export your express server so you can import it in the lambda function.
module.exports = app
