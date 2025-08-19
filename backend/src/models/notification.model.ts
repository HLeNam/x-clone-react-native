import { Schema, model, models, InferSchemaType, Model } from 'mongoose';
import { ENotification } from '~/constants/enum';

const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'notifications';

const notificationSchema = new Schema(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    to: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    type: {
      type: String,
      required: true,
      enum: [ENotification.FOLLOW, ENotification.LIKE, ENotification.COMMENT]
    },

    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      default: null
    },

    comment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
);

type NotificationType = InferSchemaType<typeof notificationSchema>;

const Notification: Model<NotificationType> =
  models[DOCUMENT_NAME] || model<NotificationType>(DOCUMENT_NAME, notificationSchema);

export default Notification;
export type { NotificationType };
