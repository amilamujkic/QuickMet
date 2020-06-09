const UserSchema = new Schema({
    id:{
        type: Number,
        required:true
    },
    name:{
      type: String,
      required: true
    },
    surname:{
      type: String,
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
        type: Blob
    }
  });


const SlotSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    length: {
        type: TimeRanges,
        required: true
    },
    meetingType: {
        type: String
    },
    restrictedUsers:{
        type: Array
    },
    destination: {
        type: String
    },
    booked:{
        type: Boolean,
        required: true,
        default: 0
    },
    user1: {
        type: string,
        required: true
    },
    user2: {
        type: string
    },
    notes:{
        type:string
    }
});

const FriendsSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
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
    },
    state: {
        type: Boolean,
        required: true
    }
});

const CategoriesSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    categoryName: {
        type: String,
        required: true
    }
});


