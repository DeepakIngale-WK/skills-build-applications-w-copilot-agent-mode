import mongoose, { Document, Types } from 'mongoose';
export interface ILeaderboard extends Document {
    userId: Types.ObjectId;
    username: string;
    points: number;
    rank: number;
    updatedAt: Date;
}
declare const Leaderboard: mongoose.Model<ILeaderboard, {}, {}, {}, Document<unknown, {}, ILeaderboard, {}, mongoose.DefaultSchemaOptions> & ILeaderboard & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ILeaderboard>;
export default Leaderboard;
//# sourceMappingURL=Leaderboard.d.ts.map