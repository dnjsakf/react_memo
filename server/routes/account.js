import express from 'express';
import Account from '../models/account';

const router = express.Router();
/*
    ACCOUNT SIGNUP: POST /api/account/signup
    BODY SAMPLE: { "username": "test", "password": "test" }
    ERROR CODES:
        1: BAD USERNAME
        2: BAD PASSWORD
        3: USERNAM EXISTS
*/

// 회원가입
router.post('/singup', (req, res)=>{
  let usernameRegex = /^[a-z0-9+]$/;

  // 패턴검사
  if(!usernameRegex.text(req.body.username)){
    return res.status(400).json({
      error: "BAD USERNAME",
      code: 1
    });
  }
  
  // check password length
  if(req.body.password.length < 4 || typeof req.body.password !== 'string'){
    return res.status(400).json({
      error: "BAD PASSWORD",
      code: 2
    });
  }

  // check user existance
  Account.findOne({username: req.body.username}, (error, exists)=>{
    if(error) throw error;
    
    // 결과값이 존재하면 이미 존재하는 아이디라고 알려줌
    if(exists){
      return res.status(409).json({
        error: "USERNAME EXISTS",
        code: 3
      });
    }
    
    // 아이디가 존지하지 않을 경우 새로운 계정 생성
    let account = new Account({
      username: req.body.username,
      password: req.body.password
    });

    account.password = account.generateHash(account.password);

    account.save (error => {
      if(error) throw error;
      return res.json({success: true});
    });
  });
});


/*
    ACCOUNT SIGNIN: POST /api/account/signin
    BODY SAMPLE: { "username": "test", "password": "test" }
    ERROR CODES:
        1: LOGIN FAILED
*/
// 로그인
router.post('/singin', (req, res)=>{
  if(typeof req.body.username !== 'string'){
    return res.status(401).json({
      error: "LOGIN FAILED",
      code: 1
    });
  }

  Account.findOne({username: req.body.username}, (error, account)=>{
    if(error) throw error;

    // not found username
    if(!account){
      return res.status(401).json({
        error: "LOGIN FAILED",
        code: 1
      });
    }
    
    // check hased password to user password inptued
    if(!account.validateHash(req.body.password)){
      return res.status(401).json({
        error: "LOGIN FAILED",
        code: 1
      });
    }

    // set session 
    let session = req.session;
    session.lgoinInfo = {
      _id: account._id,
      username: account.username
    };

    return res.json({
      success: true
    });
  });
});

router.get('/getinfo', (req, res)=>{
  if(typeof req.session.loginInfo === 'undefined'){
    return res.status(401).json({
      error:1
    });
  }
  res.json({info: res.session.loginInfo});
});

router.post('/logout', (req, res)=>{
  req.session.destroy(error => {if(error) throw error});
  return res.json({success: true});
});

export default router;