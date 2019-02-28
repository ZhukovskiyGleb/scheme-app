// Allow read/write access on all documents to any user signed in to the application
service cloud.firestore {
  match /databases/{database}/documents {
  	match /system/{value} {
      allow read;
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.admin == true;
    }
    match /parts/{part} {
      allow read;
      allow write: if request.auth.uid != null;
    }
    match /users/{userId} {
      allow read;
      allow write: if request.auth.uid == userId;
    }
    match /storage/{storageId} {
      allow read, write: if request.auth.uid == storageId;
    }
  }
}