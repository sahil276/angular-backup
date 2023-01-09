const { json } = require("express")
// import jsonwebtoken
const jwt = require('jsonwebtoken');

userDetails = {
    1000 : {acno:1000, username:'Amal', password:1000, balance:2000, transaction:[]},
    1001 : {acno:1001, username:'Arun', password:1001, balance:2000, transaction:[]},
    1002 : {acno:1002, username:'Akshay', password:1002, balance:2000, transaction:[]}
  }

  const register = (acno, username, password) => {
    if (acno in userDetails){
      return {
        status:false,
        statusCode:401,
        message:'User already exists'
      }
    } else {
      userDetails[acno] = {
        acno:acno,
        username:username,
        password:password,
        balance:0,
        transaction:[]
      }
      return {
        status:true,
        statusCode:200,
        message:'Register successfull'
      }
    }
  }

  const login = (acno, password) => {
    if(acno in userDetails){
      if(password == userDetails[acno].password){
        currentUser = userDetails[acno].username;
        currenAcno = acno;
        // Token generation
        const token = jwt.sign({currenAcno:acno}, 'superkey2023');
        // superkey2023 will generate a number eg dfjasdijfadsjdjk
        return {
          status:true,
          statusCode:200,
          message:'login successfull',
          token:token
        }
      }else{
        return {
          status:false,
          statusCode:401,
          message:'wrong password'
        }
      }
    }else{
      return {
        status:false,
        statusCode:401,
        message:'Invalid user'
      }
    }
  }

  const deposit = (acno, password, dAmt) => {
    if (acno in userDetails){
      if (password == userDetails[acno].password){
        dAmt = parseInt(dAmt);
        userDetails[acno].balance += dAmt;

        userDetails[acno]['transaction'].push({
          type:'Credit',
          amount:dAmt
        })
        return {
          status:true,
          statusCode:200,
          message:`${dAmt} is credited to account ${acno} and balance is ${userDetails[acno].balance}`
        }
      }else{
        return {
          status:false,
          statusCode:401,
          message:'Invalid password'
        }
      }
    }else{
      return {
        status:false,
        statusCode:401,
        message:'Invalid user'
      }
    }
  }
     
  const withdraw = (acno, password, wAmt) => {
    const acno1 = acno;
    const pswd1 = password;
    if(acno1 in userDetails){
      if(pswd1 == userDetails[acno1].password){
        wAmt = parseInt(wAmt);
        if(userDetails[acno1].balance > wAmt){
          userDetails[acno1].balance -= wAmt;

          userDetails[acno1]['transaction'].push({
            type:'Debit',
            amount:wAmt
          })
          return {
            status:true,
            statusCode:200,
            message:`${wAmt} is debited to account ${acno} and balance is ${userDetails[acno1].balance}`
          }
        } else{
          return {
            status:false,
            statusCode:401,
            message:'Insufficient balance'
          }
        }
      }else{
        return {
          status:false,
          statusCode:401,
          message:'Invalid password'
        }
      }
    }else{
      return {
        status:false,
        statusCode:401,
        message:'Invalid user'
      }
    }
  }

  const getTransaction = (acno) => {
    if(acno in userDetails){
      return {
        status:true,
        statusCode:200,
        transaction:userDetails[acno].transaction
      }
    }else {
      return {
        status:false,
        statusCode:401,
        message:'Invalid user'
      }
    }
  }


  module.exports = {
    register,
    login,
    deposit,
    withdraw,
    getTransaction
  }