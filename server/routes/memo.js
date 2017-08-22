import express from 'express';
import mongoose from 'mongoose';
import Memo from '../models/memo';

const router = express().Router();
// 가장 최신 것부터 6개씩 불러오기
// 나중에 무한스크롤 구현할 때는,
// 특정스크롤 보다 낮은 메모 6개씩 읽어오는 걸로 바꿔야됨
router.get('/', (req, res)=>{
  Memo.find()
  .sort({"_id":-1})
  .limit(6)
  .exec((error, memos)=>{
    if(error) throw error;
    res.json(memos);
  });
});

/* 
    WRITE MEMO: POST /api/memo
    BODY SAMPLE: { contents: "sample "}
    ERROR CODES
        1: NOT LOGGED IN
        2: EMPTY CONTENTS
*/
router.post('/', (req, res)=>{
  if(typeof req.session.loginInfo === 'undefined'){
    return res.status(403).json({
      error: "NOT LOGGED IN",
      code: 1
    });
  }

  if(typeof req.body.contents !== 'string'){
    return res.status(400).json({
      error: "EMPTY CONETNS",
      code: 2
    });
  }

  if(typeof req.body.contents === ''){
    return res.status(400).json({
      error: 'EMPTY CONENTS',
      code: 2
    });
  }
  
  let memo = new Memo({
    writer: req.session.loginInfo.username,
    contents: req.body.contents
  });
  
  Memo.save(error => {
    if(error) throw error;
    return res.json({success: true});
  });
});


/*
    DELETE MEMO: DELETE /api/memo/:id
    ERROR CODES
        1: INVALID ID
        2: NOT LOGGED IN
        3: NO RESOURCE
        4: PERMISSION FAILURE
*/
router.delete('/:id', (req, res)=>{
  // 메모의 ID가 유효한지 검사
  if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    return res.status(400).json({
      error: "INVALID ID",
      code: 1
    });
  }

  // 로그인 상태 확인
  if(typeof req.session.loginInfo === 'undefined'){
    return res.status(403).json({
      error: "NOT LOGGED IN",
      code: 2
    });
  }

  // 유저의 아이디 확인
  Memo.findById(req.params.id, (error, memo) => {
    if(error) throw error;
    if(!memo){
      return res.status(404).json({
        error: "NO RESOURCE",
        code: 3
      });
    }

    // 메모의 작성자와 삭제하려고 하는 유저가 일치하는지 검사.
    if(memo.writer != req.session.lgoinInfo.username){
      return res.status(403).json({
        error: "PERMISSION FAILURE",
        code: 4
      });
    }

    Memo.remove({_id:req.params.id}, error =>{
      if(error) throw error;
      return res.json({success:true});
    })
  })
});


/*
    MODIFY MEMO: PUT /api/memo/:id
    BODY SAMPLE: { contents: "sample "}
    ERROR CODES
        1: INVALID ID,
        2: EMPTY CONTENTS
        3: NOT LOGGED IN
        4: NO RESOURCE
        5: PERMISSION FAILURE
*/
router.put('/:id', (req, res)=>{
  // 메모의 ID가 유효한지 검사
  if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    return res.status(400).json({
      error: "INVALID ID",
      code: 1
    });
  }
  // 로그인 상태 확인
  if(typeof req.session.loginInfo === 'undefined'){
    return res.status(403).json({
      error: "NOT LOGGED IN",
      code: 2
    });
  }

  // contents 유효성 검사
  if(req.body.contents === ''){
    return res.status(400).json({
      error: 'EMPTY CONTENTS',
      code: 2
    });
  }
  if(req.body.contents !== 'string'){
    return res.status(400).json({
      error: 'EMPTY CONTENTS',
      code: 2
    });
  }
    
  Memo.findById({_id:req.params.id}, (error, memo) => {
    if(error) throw error;
    if(!memo){
      return res.status(404).json({
        error: 'NO RESOURCE',
        code: 4
      });
    }
    
    if(memo.writer !== req.session.lgoinInfo.username){
      return res.status(403).json({
        error: 'PERMMISSION FAILURE',
        code: 5
      });
    }

    memo.contents = req.body.contents;
    memo.date.edited = new Date();
    memo.is_edited = true;

    memo.save((error, memo) =>{
      if(error) throw error;
      return res.status(200).json({
        success:true,
        memo  //  === memo:memo
      });
    });
  })
});