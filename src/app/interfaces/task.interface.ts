import { TaskDifficult, TaskLevel, TaskStatus } from "../constants/constants.enum";

export interface ITask {
    name: string;
    description: string;
    startDate: any;
    dueDate: any;
    status: TaskStatus;
    level: TaskLevel;
    image?: string;
    userId: string;
    difficulty: TaskDifficult
    resources?: object | [],
    id: number;
}