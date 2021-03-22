var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Draw = require('../models/Draw')
const { check, body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.get('/canvas-list', auth, async function(req, res, next) {
    try {
      const draw = await Draw.find({ owner_id : req.user.id })
      return res.status(200).json({ success :true, result :  draw })
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ success :false, errors:error.message})
    }
});

router.get('/user-list', auth, async function(req, res, next) {
  try {
    const user = await User.find({_id : {$ne : req.user.id}}).select('name id')//get user list without 
    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json({ success :false, errors:error.message})
  }
})

router.get('/canvas/:_id', auth, async function(req, res, next) {
    try {
      const draw = await Draw.findById(req.params._id)
      return res.status(200).json({ success :true, result :  draw })
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ success :false, errors:error.message})
    }
});

router.post('/canvas/update', auth, [
    check('canvas_id','Canvas id is required').not().isEmpty(),
    check('node','node id is required').not().isEmpty(),
    check('owner_id','owner id is required').not().isEmpty()
  ],async function(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({ errors: errors.array() });
    }
    const { 
        canvas_id,node,owner_id,
    } = req.body;
    let payload = {
      canvas_id : canvas_id,
      node : node,
      owner_id : owner_id
    }
    Draw.findByIdAndUpdate(canvas_id,payload).then(updated => {
      return res.status(200).json({ success :true , msg : 'drawing updated', result : updated })
    }).catch(err => {
      return res.json({ success :false, result : err })
    })
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success :false, errors:error.message})
  }
});

router.post('/save', auth, [
    check('canvas_id','Canvas id is required').not().isEmpty(),
    check('node','node id is required').not().isEmpty(),
    check('owner_id','owner id is required').not().isEmpty()
  ],
  async function(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(200).json({ errors: errors.array() });
        }
        const { 
            canvas_id,node,owner_id,
            //street_address 
        } = req.body;
        draw = new Draw({
            canvas_id,
            node,
            owner_id
        })
        await draw.save()
        return res.status(200).json({ success :true , msg : 'drawing saved', result : draw })
        // resolve({ status: getStatus, success: successStatus, result: finalResult }) 

    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ success :false, errors:error.message})
    }
});

module.exports = router;