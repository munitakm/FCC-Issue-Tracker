'use strict';
const mongoose = require('mongoose');
const Issue = require('../server.js');

module.exports = function (app) {
 
  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      console.log('List of Issues')
      res.send('casa')
    })
    
    .post(function(req, res) {
      let p = req.body;
      let dateNow = new Date();
        console.log(p);
        let savedIssue = new Issue({
          assigned_to: p.assigned_to,
          status_text: p.status_text,
          open: true,
          issue_title: p.issue_title,
          issue_test: p.issue_test,
          created_by: p.created_by,
          created_on: dateNow.toISOString(),
          updated_on: dateNow.toISOString()
        });
      savedIssue.save((err, saved) => { 
        if(err) console.log(err);
         res.json({ 
          assigned_to: saved.assigned_to,
          status_text: saved.status_text,
          open: saved.open,
          _id: saved.id,
          issue_title: saved.issue_title,
          issue_test: saved.issue_test,
          created_by: saved.created_by,
          created_on: saved.created_on,
          updated_on: saved.updated_on
         
         })
      })
  })
    
    .put(function (req, res){
      let p = req.body;
      let dateUp = new Date();
      console.log(req.body);
      if(req.body.open){
      Issue.findOneAndUpdate({_id: p._id, open: true}, {
        updated_on: dateUp.toISOString(),
        issue_title: p.issue_title,
        issue_text: p.issue_text,
        created_by: p.created_by,
        assigned_to: p.assigned_to,
        status_text: p.status_text,
      }, (err, found) => { 
      if(err) { 
        return res.json({message: 'nao encontrado'})
      } 
      res.json({message: 'successfully updated', _id: p._id})
      })
    } else {
      
      Issue.findOneAndUpdate({_id: p._id, open: true}, {
        updated_on: dateUp.toISOString(),
        issue_title: p.issue_title,
        issue_text: p.issue_text,
        created_by: p.created_by,
        assigned_to: p.assigned_to,
        status_text: p.status_text,
        open: false
      }, (err, found) => { 
        return res.json({message: 'successfully updated', _id: p._id})
      })
    }
    })
    
    .delete(function (req, res){
      let p = req.body;
      console.log('deleted');
      if(p._id.length == 24) {
      Issue.remove({_id: p._id}, (err, deleted)=> { 
        if(err) { 
          res.json({error: 'could not delete', _id: p._id})
        } else { 
          res.json({result: 'successfully deleted', _id: p._id})
        }
      })
    }
  });
    
};
