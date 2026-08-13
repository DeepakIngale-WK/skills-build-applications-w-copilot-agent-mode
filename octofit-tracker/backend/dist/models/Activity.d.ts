import mongoose, { Document, Types } from 'mongoose';
export interface IActivity extends Document {
    userId: Types.ObjectId;
    type: string;
    duration: number;
    calories: number;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const Activity: mongoose.Model<IActivity, {}, {}, {}, Document<unknown, {}, IActivity, {}, mongoose.DefaultSchemaOptions> & IActivity & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IActivity>;
export default Activity;
//# sourceMappingURL=Activity.d.ts.map