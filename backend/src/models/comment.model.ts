import { Schema, model, models, InferSchemaType, Model } from 'mongoose';

const DOCUMENT_NAME = 'Comment';
const COLLECTION_NAME = 'comments';

const commentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true
    },

    content: {
      type: String,
      required: true,
      maxLength: 280
    },

    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
);

type CommentType = InferSchemaType<typeof commentSchema>;

const Comment: Model<CommentType> = models[DOCUMENT_NAME] || model<CommentType>(DOCUMENT_NAME, commentSchema);

export default Comment;
export type { CommentType };
