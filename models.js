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
    destination: {
        type: String
    },
    booked:{
        type: Boolean,
        required: true,
        default: 0
    },
    user1: {
        type: String,
        required: true
    },
    user2: {
        type: String
    },
    notes:{
        type:String
    }
});

const FriendsSchema = new Schema({
    id: {
        type: Number,
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
        required: true,
        default: 0
    },
    isBanned: {
        type: Boolean,
        required: true,
        default: 0
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


