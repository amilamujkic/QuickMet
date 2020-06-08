const UserSchema = new Schema({
    name:{
      type: String,
      required: true
    },
    surname:{
      type: String,
      required: true
    },
    birthDate: {
      type: Date,
      required: true
    },
    password: {
        type: String,
        required: true
    },
    emailAddress: {
        type: String,
        required: true
    },
    profilePicture: {
        type: File
    }
  });


const FreeSlotSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    length: {
        type: String,
        required: true
    },
    meetingType: {
        type: String
    },
    restrictedUsers:{
        type: Array
    }
});


const BookedMeetingSchema = new Schema({
    firstuser: {
        type: String,
        required: true
    },
    seconduser: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    length: {
        type: String,
        required: true
    },
    meetingType: {
        type: String
    },
    location: {
        type: String
    },
    summary: {
        type: String
    }
});

const FriendsSchema = new Schema({
    typeFriends: {
        type: String,
        required: true
    },
    firstuser: {
        type: String,
        required: true
    },
    seconduser: {
        type: String,
        required: true
    }
});


