'use strict';
const mongoose = require('mongoose');
const Issue = require('../server.js');

module.exports = function (app) {
 
  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      let filter = req.query;
      filter.project = project; 
      console.log(filter)
      
      Issue.find(filter, (err, found) => { 
        if(err) { 
          res.send(found);
        } else {
        res.send(found)
        }
      }) 
    }) 
    
    .post(function(req, res) {
      let project = req.params.project;
      let p = req.body;
      if(p.issue_title && p.issue_text && p.created_by) {
      let dateNow = new Date();
        console.log(p);
        let savedIssue = new Issue({
          assigned_to: p.assigned_to,
          status_text: p.status_text,
          open: true,
          issue_title: p.issue_title,
          issue_text: p.issue_text,
          created_by: p.created_by,
          created_on: dateNow.toISOString(),
          updated_on: dateNow.toISOString(),
          project: project
        });
      savedIssue.save((err, saved) => { 
        if(err) console.log(err);
         res.json({ 
          assigned_to: saved.assigned_to,
          status_text: saved.status_text,
          open: saved.open,
          _id: saved.id,
          issue_title: saved.issue_title,
          issue_text: saved.issue_text,
          created_by: saved.created_by,
          created_on: saved.created_on,
          updated_on: saved.updated_on
         
          })
        })
      } else { 
          res.json({error: 'required field(s) missing'})       
      }
})
    
    .put((req, res) => {
      let project = req.params.project;
      let p = req.body;
      let dateUp = new Date();
      console.log(req.body);
     if(!(/^[a-fA-F0-9]{24}$/).test(p._id)) return res.json( 
      { error: 'missing _id'}
     );
    if( 
      p.issue_title == '' &&
      p.issue_text == '' &&
      p.created_by == '' &&
      p.assigned_to == '' &&
      p.status_text == ''
    ) return res.json({ error: 'no update field(s) sent', _id: p._id});
   console.log('chegamos ate aqui') 
    if(p.open) {
      console.log('open falso');
      Issue.findOneAndUpdate({_id: p._id, open: true}, {
        updated_on: dateUp.toISOString(),
        issue_title: p.issue_title,
        issue_text: p.issue_text,
        created_by: p.created_by,
        assigned_to: p.assigned_to,
        status_text: p.status_text,
      }, (err, found) => { 
      if(err) { 
        return res.json({error: 'could not update', _id: p._id})
      } 
      res.json({result: 'successfully updated', _id: p._id})
      })
    } else { 
      console.log('open true');
       Issue.findOneAndUpdate({ _id: p._id, open: true}, { 
        updated_on: dateUp.toISOString(),
        issue_title: p.issue_title,
        issue_text: p.issue_text,
        created_by: p.created_by,
        assigned_to: p.assigned_to,
        status_text: p.status_text,
      }, (err, found) => { 
        if(err) {
          return res.json({error: 'could not update', _id: p._id})
        }
        res.json({result: 'successfully updated', _id: p._id})
      })
    }     
})  
    
    .delete(function (req, res){
      let p = req.body;
      console.log('deleted');
      if(p._id.length == 24) {
      Issue.deleteOne({_id: p._id}, (err, deleted)=> { 
        if(err) { 
          res.json({error: 'could not delete', _id: p._id})
        } else { 
          res.json({result: 'successfully deleted', _id: p._id})
        }
      })
    }
  });
    
};
