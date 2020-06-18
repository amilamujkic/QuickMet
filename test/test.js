const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const fs = require('mz/fs');
const app = require('../app');
const http = require('chai-http');
chai.use(http);


describe('App basic tests', () => {
  it('Should exists', () => {
    expect(app).to.be.a('function');
  })
});


describe('User registration', () => {
  it('/register should return 201 and confirmation for valid input', (done) => {
    let user_input = {
      "FirstName": "Amila",
      "Surname": "Mujkic",
      "EmailAddress": "amilamjk@gmail.com",
      "Password": "secret"
    }
    chai.request(app).post('/sign-up').send(user_input).then(res => {
      expect(res).to.have.status(201);
      expect(res.body.msg).to.be.equal('User registered')
      done();
    }).catch(err => {
      console.log(err);
    });
  })

  it('/register should return 400 for short password input', (done) => {
    let user_invalid_input = {
      "FirstName":"Amila",
      "Surname": "Mujkic",
      "EmailAddress": "amilamjk@gmail.com",
      "Password": ""
    }
    chai.request(app).post('/sign-up').send(user_invalid_input).then(res => {
      expect(res).to.have.status(400);
      done();
    }).catch(err => {
      console.log(err);
    });
  })
})

describe('User login', () => {
  it('should return 200 and token for valid credentials', (done) => {
    const valid_input = {
      "email": "amilamjk@gmail.com",
      "password": "secret"
    }
    chai.request(app).post('/login')
      .send(valid_input)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body.token).to.exist;
          expect(res.body.msg).to.be.equal("Logged in!");
          done();
        }).catch(err => {
          console.log(err.msg);
        })
  });
});

let testFilePath = null;

describe('POST /user/profilepicture - upload a new image file', () => {
  const filePath = `${__dirname}/testFiles/test.img`;

  it('should upload the test file to CDN', () => {
    fs.exists(filePath)
      .then((exists) => {
        if (!exists) throw new Error('No files were uploaded.'); 
        return request(app)
          .post('/user/profilepicture')
          .attach('file', filePath)
          .then((res) => {
            const { success, message, filePath } = res.body;
            expect(success).toBeTruthy();
            expect(message).toBe('Uploaded successfully');
            expect(typeof filePath).toBeTruthy();
            testFilePath = filePath;
          })
          .catch(err => console.log(err));
      })
  });
});





