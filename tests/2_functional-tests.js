const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const mongoose = require('mongoose')
const Issue = require('../server')  
chai.use(chaiHttp);
let id_test;
suite('Functional Tests', function() {
  test('Create an issue with every field: POST', (done) => { 
    chai.request(server)
      .post('/api/issues/test')
      .send({
        issue_title: 'title test',
        issue_text: 'text test',
        created_by: 'created test',
        assigned_to: 'assigned test',
        status_text: 'status test'
      })
      .end(function(err,res){ 
        const p = res.body;
        id_test  = p._id;
        assert.equal(res.status, 200);
        assert.equal(p.issue_title, 'title test');
        assert.equal(p.issue_text, 'text test');
        assert.equal(p.created_by, 'created test');
        assert.equal(p.assigned_to, 'assigned test');
        assert.equal(p.status_text, 'status test');
        done()
      })
   })
  test('Create an issue with only required fields: POST', (done) => { 
    chai.request(server)
      .post('/api/issues/test')
      .send({
        issue_title: 'title test required',
        issue_text: 'text test required',
        created_by: 'created test required',
      })
      .end(function(err,res){ 
        const p = res.body;
        assert.equal(res.status, 200);
        assert.equal(p.issue_title, 'title test required');
        assert.equal(p.issue_text, 'text test required');
        assert.equal(p.created_by, 'created test required')
        done()
      })
   })
  test('Create an issue with missing fields: POST', (done) => { 
    chai.request(server)
      .post('/api/issues/test')
      .send({
        created_by: 'created test',
      })
      .end(function(err,res){ 
        const p = res.body;
        assert.equal(res.status, 200);
        if(err) { 
          done(err);
        } else { 
          done()
        }
      })
  })
  test('View issues on a project: GET', (done) => { 
    chai.request(server)
    .get('/api/issues/test')
    .end(function(err,res) { 
      assert.equal(res.status, 200);
      assert.typeOf(res.body, 'array');
      done();
    })
  })
  test('View issues on a project with one filter: GET', (done) => { 
    chai.request(server)
    .get('/api/issues/test?open=true')
    .end(function(err,res) { 
      assert.equal(res.status, 200);
      assert.typeOf(res.body, 'array');
      done();
    })
  })
  test('View issues on a project with multiples filters: GET', (done) => { 
    chai.request(server)
    .get('/api/issues/test?open=false&issue_title=test')
    .end(function(err,res) { 
      assert.equal(res.status, 200);
      assert.typeOf(res.body, 'array');
      done();
    })
  })
  test('Update one field: PUT', (done) => { 
    chai.request(server)
    .put('/api/issues/test')
    .send({_id: id_test, issue_title: 'title updated'})
    .end(function(err,res) { 
      assert.equal(res.status, 200);
      assert.deepEqual(res.body, { 
      result: 'successfully updated',
      _id: id_test
      })
      done();
    })
  })
  test('Update  multiple fields: PUT', (done) => { 
    chai.request(server)
    .put('/api/issues/test')
    .send({_id: id_test, issue_title: 'title updated2', issue_text: "lalisa"})
    .end(function(err,res) { 
      assert.equal(res.status, 200);
      assert.deepEqual(res.body, { 
      result: 'successfully updated',
      _id: id_test
      })
      done();
    })
  })
  test('Update an issue with missing _id: PUT', (done) => { 
    chai.request(server)
    .put('/api/issues/test')
    .send({issue_title: 'title updated'})
    .end(function(err,res) { 
      assert.equal(res.status, 200);
      assert.deepEqual(res.body, { 
      error: 'missing _id'
      })
      done();
    })
  })
  test('Update an issue with no fields: PUT', (done) => { 
    chai.request(server)
    .put('/api/issues/test')
    .send({
      _id: id_test,
    })
    .end(function(err,res) { 
      assert.equal(res.status, 200);
      assert.deepEqual(res.body, { 
      error: 'no update field(s) sent',
      _id: id_test
      })
      done();
    })
  })
  test('Update an issue with an invalid _id: PUT', (done) => { 
    chai.request(server)
    .put('/api/issues/test')
    .send({_id: 'invalid_id1234567890', issue_title: 'invalid test'})
    .end(function(err,res) { 
      assert.equal(res.status, 200);
      assert.deepEqual(res.body, {error: 'missing _id'});
      done();
    })
  })
  test('Delete an issue: DELETE', (done) => { 
    chai.request(server)
    .delete('/api/issues/test')
    .send({_id: id_test})
    .end(function(err,res) { 
      assert.equal(res.status, 200);
      assert.deepEqual(res.body, {result: 'successfully deleted', _id: id_test});
      done();
    })
  })
  test('Delete an issue with invalid _id: DELETE', (done) => { 
    chai.request(server)
    .delete('/api/issues/test')
    .send({_id: '012345678901234567891234'})
    .end(function(err,res) { 
      assert.equal(res.status, 200);
      assert.deepEqual(res.body, {error: 'could not delete', _id: '012345678901234567891234'});
      done();
    })
  })
  test('Delete an issue with missing _id: DELETE', (done) => { 
    chai.request(server)
    .delete('/api/issues/test')
    .send({_id: 'missing_id'})
    .end(function(err,res) { 
      assert.equal(res.status, 200);
      assert.deepEqual(res.body, {error: 'missing _id'});
      done();
    })
  })

})




