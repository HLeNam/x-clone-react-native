import { Document, Model, model, models, ObjectId, Schema } from 'mongoose';

interface UserType extends Document {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  profilePicture?: string;
  bannerImage?: string;
  bio?: string;
  location?: string;
  followers?: ObjectId[];
  following?: ObjectId[];
}

const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'users';

const userSchema = new Schema<UserType>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    firstName: {
      type: String,
      required: true
    },

    lastName: {
      type: String,
      required: true
    },

    username: {
      type: String,
      required: true,
      unique: true
    },

    profilePicture: {
      type: String,
      default: ''
    },

    bannerImage: {
      type: String,
      default: ''
    },

    bio: {
      type: String,
      default: '',
      maxLength: 160
    },

    location: {
      type: String,
      default: ''
    },

    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: DOCUMENT_NAME,
        default: []
      }
    ],

    following: [
      {
        type: Schema.Types.ObjectId,
        ref: DOCUMENT_NAME,
        default: []
      }
    ]
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
);

const User: Model<UserType> = models[DOCUMENT_NAME] || model<UserType>(DOCUMENT_NAME, userSchema);

export default User;
export type { UserType };
