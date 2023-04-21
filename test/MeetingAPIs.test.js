/**
 * @author team bootcamp-41 2022
 */

const Meeting = require('../models/meeting_model');

let chai = require("chai");
let chaiHttp= require("chai-http");
let server =require("../server");
chai.use(require('chai-json'));
chai.should();
var expect = chai.expect;
chai.use(chaiHttp);


describe('MeetingAPITests', function() {


var temp;
/*Get all meetings*/
it('Get all meetings', (done) => {
var agent = chai.request.agent('http://localhost:4000');
   agent.post('/auth/login')
                .send({  "email": "testadmin@vmware.com",
                          "password": "one"
                                  })
                .then(function(res){
                        return agent.get('/api/meetings')
                        .query({type:'live'})
                             .then(function(res){
                                 temp=res.body.meetingList[0]._id;
                             res.should.have.status(200);
                              res.should.to.be.json;
                             res.body.should.have.property("message").eql("Get request to the only live meeting");

                })
                .then(done, done)
           });

           });



           /*Patch meeting by id*/
           it('Patch meeting by id ', (done) => {
           var agent = chai.request.agent('http://localhost:4000');
              agent.post('/auth/login')
                           .send({  "email": "testadmin@vmware.com",
                                     "password": "one"
                                             })
                           .then(function(res){
                                   return agent.patch('/api/meetings/'+temp)
                                   .send({"meetDescription": "changed description"})
                                        .then(function(res){
                                         res.body.updatedMeetingObject.meetDescription.should.equal("changed description");
                                        res.should.have.status(200);

                           })
                           .then(done, done)
                      });


           });



           });