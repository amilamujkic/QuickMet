CREATE DATABASE quickmetdb;



CREATE TABLE Users (   -- Actually called User in XAMPP
    UserID int IDENTITY(1,1) NOT NULL PRIMARY KEY,
    FirstName varchar(255) NOT NULL,
    Surname varchar(255) NOT NULL,
    Password char(60) NOT NULL,
    EmailAddress varchar(255) NOT NULL,
    ProfilePicture longblob
);

CREATE TABLE ResetTokens (
  id int(11) IDENTITY(1,1) NOT NULL PRIMARY KEY,
  email varchar(255) DEFAULT NULL,
  token varchar(255) DEFAULT NULL,
  expiration datetime DEFAULT NULL,
  createdAt datetime NOT NULL,
  updatedAt datetime NOT NULL,
  used int(11) NOT NULL DEFAULT '0',
) 

CREATE TABLE Friendship (
    FriendshipID int IDENTITY(1,1) NOT NULL,
    FirstUserID int NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    SecondUserID int NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    isFriend boolean DEFAULT false,
    isBanned boolean DEFAULT false,
    isRequested boolean DEFAULT false
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



