import mongoose, { Document } from 'mongoose';
export interface IWorkout extends Document {
    title: string;
    description: string;
    difficulty: 'easy' | 'moderate' | 'hard';
    duration: number;
    caloriesBurned: number;
    exercises: string[];
    createdAt: Date;
    updatedAt: Date;
}
declare const Workout: mongoose.Model<IWorkout, {}, {}, {}, Document<unknown, {}, IWorkout, {}, mongoose.DefaultSchemaOptions> & IWorkout & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IWorkout>;
export default Workout;
//# sourceMappingURL=Workout.d.ts.map