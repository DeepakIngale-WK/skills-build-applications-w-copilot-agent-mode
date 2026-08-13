import mongoose, { Document, Types } from 'mongoose';
export interface ITeam extends Document {
    name: string;
    goal: string;
    members: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}
declare const Team: mongoose.Model<ITeam, {}, {}, {}, Document<unknown, {}, ITeam, {}, mongoose.DefaultSchemaOptions> & ITeam & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ITeam>;
export default Team;
//# sourceMappingURL=Team.d.ts.map