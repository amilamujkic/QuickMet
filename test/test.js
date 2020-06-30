const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const fs = require('mz/fs');
const app = require('../app');
const http = require('chai-http');
chai.use(http);

let should = chai.should();

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
    var valid_input = {
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
  var filePath = `${__dirname}/testFiles/test.img`;

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

describe('/user/friends', ()=>{
  it('should return all friends of the user', (done) =>{
      chai.request(app)
      .get('/user/friends')
      .end(function(err, res){
          expect(res).to.have.status(200);
          done();
      });	
  });

});

describe('Adding slots', () => {
  it('/should return 200 for successfully added slot', (done) => {
    let user_input = {
      "StartDate":"2012-04-23T18:25:43.511Z",
      "Duration":"2:30:00",
      "Destination":"Ahar",
      "Notes":"Meet in front of the office",
      "CategoryName":"Lunch"
      }
    chai.request(app).post('/slots/add').send(user_input).then(res => {
      expect(res).to.have.status(200);
      done();
    }).catch(err => {
      console.log(err);
    });
  })

  it('/should return 500 for missing information', (done) => {
    let user_invalid_input = {
      "Duration":"2:30:00",
      "Destination":"Ahar",
      "Notes":"Meet in front of the office",
      "CategoryName":"Lunch"
    }
    chai.request(app).post('/slots/add').send(user_invalid_input).then(res => {
      expect(res).to.have.status(500);
      expect(res.body).to.be.equal('Something is missing. Check it out.');
      done();
    }).catch(err => {
      console.log(err);
    });
  });
});

describe('getting slots of the user', ()=>{
  it('should return all friends of the user', (done) =>{
      chai.request(app)
      .get('/slots')
      .end(function(err, res){
          expect(res).to.have.status(200);
          done();
      });	
  });
});	

describe('Deleting slots', () => {
  it('/should return 200 for successfully deleted slot', (done) => {
    let user_input = {
      "SlotID": "3"
      }
    chai.request(app).post('/slots/delete').send(user_input).then(res => {
      expect(res).to.have.status(200);
      done();
    }).catch(err => {
      console.log(err);
    });
  })

  it('/should return 500 for error', (done) => {
    chai.request(app).post('/slots/delete').then(res => {
      expect(res).to.have.status(500);
      expect(res.body).to.be.equal('Could not delete it. Error!');
      done();
    }).catch(err => {
      console.log(err);
    });
  });
});

describe('Searching for users', () => {
  it('/should return 200 for successful search', (done) => {
    let user_input = {
      "friendname": "Amila",
      "friendsurname": "Mujkic"
    }
    chai.request(app).post('/search').send(user_input).then(res => {
      expect(res).to.have.status(200);
      done();
    }).catch(err => {
      console.log(err);
    });
  })

  it('/should return 400 for error', (done) => {
    let user_invalid_input = {
      "friendname": "",
    }
    chai.request(app).post('/search').send(user_invalid_input).then(res => {
      expect(res).to.have.status(400);
      done();
    }).catch(err => {
      console.log(err);
    });
  })
})


describe('Deleting friend', () => {
  it('/should return 200 for successful deletion', (done) => {
    let user_input = {
      "FUFirstName": "Amila",
      "FUSurname": "Mujkic",
      "SUFirstName": "Dino",
      "SUSurname": "Osmankovic"
    }
    chai.request(app).post('/user/delete').send(user_input).then(res => {
      expect(res).to.have.status(200);
      expect(res.body.msg).to.be.equal("User deleted from friends!");
      done();
    }).catch(err => {
      console.log(err);
    });
  })

  it('/should return 400 for error', (done) => {
    let user_invalid_input = {
      "friendname": "",
    }
    chai.request(app).post('/user/delete').send(user_invalid_input).then(res => {
      expect(res).to.have.status(400);
      done();
    }).catch(err => {
      console.log(err);
    });
  })
})


describe('Friend request', () => {
  it('/should return 200 for successfully sent friend request', (done) => {
    let user_input = {
      "FirstName":"Dino",
      "Surname":"Osmankovic"
    }
    chai.request(app).post('/user/add').send(user_input).then(res => {
      expect(res).to.have.status(200);
      expect(res.body.msg).to.be.equal("User added");
      done();
    }).catch(err => {
      console.log(err);
    });
  })

  it('/should return 400 for error', (done) => {
    let user_invalid_input = {
      "friendname": ""
    }
    chai.request(app).post('/user/add').send(user_invalid_input).then(res => {
      expect(res).to.have.status(400);
      done();
    }).catch(err => {
      console.log(err);
    });
  })
})


describe('Accepting/declining friend requests', () => {
  it('/should return 200 for successful action', (done) => {
    let user_input = {
      "FUFirstName": "Amila",
      "FUSurname": "Mujkic",
      "SUFirstName": "Dino",
      "SUSurname": "Osmankovic",
      "action": "accept"
    }
    chai.request(app).post('/user/request').send(user_input).then(res => {
      expect(res).to.have.status(200);
      expect(res.body.msg).to.be.equal("Action done!");
      done();
    }).catch(err => {
      console.log(err);
    });
  })

  it('/should return 200 for successful action', (done) => {
    let user_input = {
      "FUFirstName": "Amila",
      "FUSurname": "Mujkic",
      "SUFirstName": "Dino",
      "SUSurname": "Osmankovic",
      "action": "decline"
    }
    chai.request(app).post('/user/request').send(user_input).then(res => {
      expect(res).to.have.status(200);
      expect(res.body.msg).to.be.equal("Action done!");
      done();
    }).catch(err => {
      console.log(err);
    });
  })

  it('/should return 400 for error', (done) => {
    let user_invalid_input = {
      "friendname": ""
    }
    chai.request(app).post('/user/request').send(user_invalid_input).then(res => {
      expect(res).to.have.status(400);
      done();
    }).catch(err => {
      console.log(err);
    });
  })
})


describe('Mutual meetings', () => {
  it('/should return 200 for successfully fetching mutual meetings', (done) => {
    let user_input = {
      "FUFirstName": "Amila",
      "FUSurname": "Mujkic",
      "SUFirstName": "Dino",
      "SUSurname": "Osmankovic"
    }
    chai.request(app).post('/friends/slots').send(user_input).then(res => {
      expect(res).to.have.status(200);
      done();
    }).catch(err => {
      console.log(err);
    });
  })

  it('/should return 400 for error', (done) => {
    let user_invalid_input = {
      "friendname": ""
    }
    chai.request(app).post('/friends/slots').send(user_invalid_input).then(res => {
      expect(res).to.have.status(400);
      done();
    }).catch(err => {
      console.log(err);
    });
  })
})

describe('getting friend requests of the user', ()=>{
  it('should return all friend requests of the user', (done) =>{
      chai.request(app)
      .get('/user/request')
      .end(function(err, res){
          expect(res).to.have.status(200);
          done();
      });	
  });
});	

describe('getting meeting summaries', ()=>{
  var slotid = 3;
  it('should return all meeting summaries of the user', (done) =>{
      chai.request(app)
      .get('/friend/summaries')
      .send(slotid)
      .end(function(err, res){
          expect(res).to.have.status(200);
          done();
      });	
  });
});	

describe('Adding meeting note', () => {
  it('/should return 200 for successfully added note', (done) => {
    let user_input = {
      "Notes": "Let's meet in front of the office",
      "SlotID": "3" }

    chai.request(app).post('/friends/summaries/add').send(user_input).then(res => {
      expect(res).to.have.status(200);
      done();
    }).catch(err => {
      console.log(err);
    });
  })

  it('/should return 400 for error', (done) => {
    let user_invalid_input = {
      "friendname": ""
    }
    chai.request(app).post('/friends/summaries/add').send(user_invalid_input).then(res => {
      expect(res).to.have.status(400);
      done();
    }).catch(err => {
      console.log(err);
    });
  })
})


describe('main tab query', ()=>{
  it('should return all free slots of friends', (done) =>{
      chai.request(app)
      .get('/mainpage')
      .end(function(err, res){
          expect(res).to.have.status(200);
          done();
      });	
  });
});


describe('booking slot', ()=>{
  var slotid = 2;
  it('should return successful booked slot', (done) =>{
      chai.request(app)
      .post('/mainpage/book')
      .send(slotid)
      .end(function(err, res){
          expect(res).to.have.status(200);
          done();
      });	
  });
});	

describe('urgently delete', ()=>{
  var slotid = 2;
  it('should return successful deleted slot', (done) =>{
      chai.request(app)
      .post('/urgent/delete')
      .send(slotid)
      .end(function(err, res){
          expect(res).to.have.status(200);
          done();
      });	
  });
});	


describe('Adding meeting urgently', () => {
  it('/should return 200 for successfully adding meeting', (done) => {
    let user_input = {
      "StartDate": "07/06/2020 03:04PM",
      "Duration": "3:00",
      "Destination": "Coffee shop",
      "Notes":"I need to talk about the issue that we had",
      "CategoryName":"Coffe",
      "FirstUserID":"1",
      "SecondUserID":"2" }

    chai.request(app).post('/urgent/add').send(user_input).then(res => {
      expect(res).to.have.status(200);
      done();
    }).catch(err => {
      console.log(err);
    });
  })

  it('/should return 500 for error', (done) => {
    let user_invalid_input = {
      "friendname": ""
    }
    chai.request(app).post('/urgent/add').send(user_invalid_input).then(res => {
      expect(res).to.have.status(500);
      done();
    }).catch(err => {
      console.log(err);
    });
  })
})