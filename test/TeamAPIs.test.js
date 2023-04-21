/**
 * @author team bootcamp-41 2022
 */

const Team = require('../models/team_model');

let chai = require("chai");
let chaiHttp= require("chai-http");
let server =require("../server");
chai.use(require('chai-json'));
chai.should();
var expect = chai.expect;
chai.use(chaiHttp);


describe('TeamAPITests', function() {

var temp;
/*Get all teams*/
it('Get all teams', (done) => {
var agent = chai.request.agent('http://localhost:4000');
   agent.post('/auth/login')
                .send({  "email": "testadmin@vmware.com",
                          "password": "one"
                                  })
                .then(function(res){
                        return agent.get('/api/teams')
                             .then(function(res){
                                 temp=res.body.teamList[0]._id;

                             res.should.have.status(200);
                              res.should.to.be.json;
                             res.body.should.have.property("message").eql("Get request to all teams");

                })
                .then(done, done)
           });



});

/*Get team by id*/

it('Get team by id ', (done) => {

var agent = chai.request.agent('http://localhost:4000');
   agent.post('/auth/login')
                .send({  "email": "testadmin@vmware.com",
                          "password": "one"
                                  })
                .then(function(res){
                        return agent.get('/api/teams/'+temp)
                             .then(function(res){
                             res.should.have.status(200);
                              res.should.to.be.json;
                             res.body.should.have.property("message").eql("Get request to your team successfull");


                })
                .then(done, done)
           });


});


/*Delete team by id, set team_id in users to null*/


it('Delete team by id ', (done) => {

var agent = chai.request.agent('http://localhost:4000');
   agent.post('/auth/login')
                .send({  "email": "testadmin@vmware.com",
                          "password": "one"
                                  })
                .then(function(res){
                        return agent.delete('/api/teams/'+temp)
                             .then(function(res){
                             res.should.have.status(200);

                             return agent.get('/api/users')
                             .then(function(res)
                             {
                             console.log(res.body.userList.length);
                             for(let i=0;i<res.body.userList.length;i++)
                             {
                             expect(res.body.userList[i].team_id).to.be.null;
                             }

                             })


                })
                .then(done, done)
           });


});




});




















