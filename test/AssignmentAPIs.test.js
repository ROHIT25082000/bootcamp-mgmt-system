/**
 * @author team bootcamp-41 2022
 */

const Assignment = require('../models/assignment_model');

let chai = require("chai");
let chaiHttp= require("chai-http");
let server =require("../server");
chai.use(require('chai-json'));
chai.should();
var expect = chai.expect;
chai.use(chaiHttp);


describe('AssignmentAPITests', function() {

var temp;
/*Get all assignments*/
it('Get all assignments', (done) => {
var agent = chai.request.agent('http://localhost:4000');
   agent.post('/auth/login')
                .send({  "email": "testadmin@vmware.com",
                          "password": "one"
                                  })
                .then(function(res){
                        return agent.get('/api/assignments')
                        .query({type:'all'})
                             .then(function(res){
                                 temp=res.body.assignmentList[0]._id;
                             res.should.have.status(200);
                              res.should.to.be.json;
                             res.body.should.have.property("message").eql("Get request to all Assignment all Team, Individual, project");

                })
                .then(done, done)
           });



});


/*Get all projects*/
it('Get all assignments', (done) => {
var agent = chai.request.agent('http://localhost:4000');
   agent.post('/auth/login')
                .send({  "email": "testadmin@vmware.com",
                          "password": "one"
                                  })
                .then(function(res){
                        return agent.get('/api/assignments')
                        .query({type:'project'})
                             .then(function(res){
                                 project=res.body.assignmentList[0].assignmentName;
                                 project.should.equal("BootcampManagementSystem");
                             res.should.have.status(200);
                              res.should.to.be.json;
                             res.body.should.have.property("message").eql("Get request to all projects");

                })
                .then(done, done)
           });



});


/*Get all team assignments*/

it('Get all assignments', (done) => {
var agent = chai.request.agent('http://localhost:4000');
   agent.post('/auth/login')
                .send({  "email": "testadmin@vmware.com",
                          "password": "one"
                                  })
                .then(function(res){
                        return agent.get('/api/assignments')
                        .query({type:'team'})
                             .then(function(res){
                                 team=res.body.assignmentList[0].assignmentName;
                                  team.should.equal("dB Assignment");
                             res.should.have.status(200);
                              res.should.to.be.json;
                             res.body.should.have.property("message").eql("Get request to all Team assignment ");

                })
                .then(done, done)
           });



});


/*Get all individual assignments*/
it('Get all assignments', (done) => {
var agent = chai.request.agent('http://localhost:4000');
   agent.post('/auth/login')
                .send({  "email": "testadmin@vmware.com",
                          "password": "one"
                                  })
                .then(function(res){
                        return agent.get('/api/assignments')
                        .query({type:'individual'})
                             .then(function(res){
                                individual=res.body.assignmentList[0].assignmentName;
                              individual.should.equal("UI Assignment");
                             res.should.have.status(200);
                              res.should.to.be.json;
                             res.body.should.have.property("message").eql("Get request to all Individual");

                })
                .then(done, done)
           });



});




/*Patch assignment by id*/
it('Patch assignment by id ', (done) => {
var agent = chai.request.agent('http://localhost:4000');
   agent.post('/auth/login')
                .send({  "email": "testadmin@vmware.com",
                          "password": "one"
                                  })
                .then(function(res){
                        return agent.patch('/api/assignments/'+temp)
                        .send({"assignmentDescriptions": "changed description"})
                             .then(function(res){
                              res.body.updatedAssignmentObject.assignmentDescriptions.should.equal("changed description");
                             res.should.have.status(200);

                })
                .then(done, done)
           });


});


/*Delete assignment by id*/

var ext='abcd'
it('Delete assignment by id ', (done) => {

var agent = chai.request.agent('http://localhost:4000');
   agent.post('/auth/login')
                .send({  "email": "testadmin@vmware.com",
                          "password": "one"
                                  })
                .then(function(res){
                        return agent.delete('/api/assignments/'+temp+ext)
                             .then(function(res){
                             res.body.should.have.property("message").eql("There is no such assignment");
                             res.should.have.status(404);



                })
                .then(done, done)
           });


});


});
























