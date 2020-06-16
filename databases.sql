CREATE DATABASE quickmetdb;



CREATE TABLE Users (   -- Actually called User in XAMPP
    UserID int IDENTITY(1,1) NOT NULL PRIMARY KEY,
    FirstName varchar(255) NOT NULL,
    Surname varchar(255) NOT NULL,
    Password char(60) NOT NULL,
    EmailAddress varchar(255) NOT NULL,
    ProfilePicture longblob
);

CREATE TABLE Friendship (
    FriendshipID int IDENTITY(1,1) NOT NULL,
    FirstUserID int NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    SecondUserID int NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    isFriend boolean DEFAULT false,
    isBanned boolean DEFAULT false
);

CREATE TABLE Slot (
    SlotID int IDENTITY(1,1) NOT NULL,
    StartDate timestamp NOT NULL,
    Duration time NOT NULL,
    MeetingTypeID int FOREIGN KEY REFERENCES Categories(CategoryID),
    Destination text,
    isBooked boolean DEFAULT false,
    FirstUserID int NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    SecondUserID int NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    Notes text
);

CREATE TABLE Categories (
    CategoryID int IDENTITY(1,1) PRIMARY KEY,
    CategoryName text
);



