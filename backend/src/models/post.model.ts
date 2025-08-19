import { Schema, model, models, InferSchemaType, Model } from 'mongoose';

const DOCUMENT_NAME = 'Post';
const COLLECTION_NAME = 'posts';

const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    content: {
      type: String,
      maxLength: 280
    },

    image: {
      type: String,
      default: ''
    },

    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],

    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ]
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
);

type PostType = InferSchemaType<typeof postSchema>;

const Post: Model<PostType> = models[DOCUMENT_NAME] || model<PostType>(DOCUMENT_NAME, postSchema);

export default Post;
export type { PostType };
