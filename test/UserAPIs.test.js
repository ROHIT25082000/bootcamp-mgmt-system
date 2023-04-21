/**
 * @author team bootcamp-41 2022
 */
const User = require('../models/user_model');

let chai = require("chai");
let chaiHttp= require("chai-http");
let server =require("../server");
chai.use(require('chai-json'));
chai.should();
var expect = chai.expect;
chai.use(chaiHttp);


describe('UsersAPITests', function() {

/*Signup*/
it('Signup', function(done) {
           chai.request('http://localhost:4000')
           .post("/auth/signup")
           .send({
                     "email":"testadmin@vmware.com",
                     "password":"one",
                     "name": "TestAdmin",
                     "role": "admin",
                     "BU": "TechnicalEducation",
                     "qualification": "b.tech"
                 })
           .end((err,response) => {
          response.should.have.status(400);//existing user
           })


done();
});

/*Login*/
it('Login', function(done) {


 chai.request('http://localhost:4000')
     .post("/auth/login")
     .send({
                 "email":"testadmin@vmware.com",
                 "password":"one"
             })
     .end((err,response) => {
    response.should.have.status(200);
     })

done();
});

/*Login*/
it('Login', function(done) {


 chai.request('http://localhost:4000')
     .post("/auth/login")
     .send({
                 "email":"testwrong@vmware.com",
                 "password":"one"
             })
     .end((err,response) => {
    response.should.have.status(400); //existing user
     })





done();
});


var temp;
/*Get all users*/
it('Get all users', (done) => {
var agent = chai.request.agent('http://localhost:4000');
   agent.post('/auth/login')
                .send({  "email": "testadmin@vmware.com",
                          "password": "one"
                                  })
                .then(function(res){
                        return agent.get('/api/users')
                             .then(function(res){
                                 temp=res.body.userList[0]._id;
                             res.should.have.status(200);
                              res.should.to.be.json;
                             res.body.should.have.property("message").eql("Get request to all users");

                })
                .then(done, done)
           });



});

/*Get user by id*/

it('Get user by id ', (done) => {

var agent = chai.request.agent('http://localhost:4000');
   agent.post('/auth/login')
                .send({  "email": "testadmin@vmware.com",
                          "password": "one"
                                  })
                .then(function(res){
                        return agent.get('/api/users/'+temp)
                             .then(function(res){
                             res.should.have.status(200);
                              res.should.to.be.json;
                             res.body.should.have.property("message").eql("user");


                })
                .then(done, done)
           });


});


/*Patch user by id*/
it('Patch user by id ', (done) => {

var agent = chai.request.agent('http://localhost:4000');
   agent.post('/auth/login')
                .send({  "email": "testadmin@vmware.com",
                          "password": "one"
                                  })
                .then(function(res){
                        return agent.patch('/api/users/'+temp)
                        .send({ "role":"admin"})
                             .then(function(res){
                             res.should.have.status(200);



                })
                .then(done, done)
           });


});


/*Delete user by id*/

var ext='abcd'
it('Delete user by id ', (done) => {

var agent = chai.request.agent('http://localhost:4000');
   agent.post('/auth/login')
                .send({  "email": "testadmin@vmware.com",
                          "password": "one"
                                  })
                .then(function(res){
                        return agent.delete('/api/users/'+temp+ext)
                             .then(function(res){
                             res.should.have.status(404);



                })
                .then(done, done)
           });


});




});




















