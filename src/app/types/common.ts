export interface User {
    id: string;
    email?: string;
    emailVerified: boolean;
    name?: string;
    interests?: string[];
}

export interface ExerciseSearchQuery {
    name: string;
    type: string;
    muscle: string;
}

export interface ExerciseSearchResponse {
    name: string;
    type: string;
    muscle: string;
    equipment: string;
    difficulty: string;
    instructions: string;
    disabled?: boolean
}

export interface Exercise {
    name: string;
    type: string;
    sets: number;
    useRepsSpan: boolean;
    reps: number;
    repsMax: number;
    comment?: string;
    restPeriod: number;
}

export interface ExerciseResult {
    name: string;
    sets: ExerciseResultSet[];
    comments?: string;
}

export interface ExerciseResultSet {
    warmup: boolean;
    weight: number;
    reps: number;
}

export interface TrainingDay {
    name: string;
    index: number;
    exercises: Exercise[];
}

export interface Program {
    id?: string;
    created?: Date;
    title: string;
    description: string;
    image?: string;
    days: string[];
    numberOfDays: number;
    level: string;
    type: string;
    length: number;
    trainingDays: TrainingDay[];
}

export interface FilterQuery {
    attribute: string;
    operator: string;
    value: any;
}

export interface FilterQueryWithUser {
    userId: string;
    sort?: string;
    sortDirection?: string;
    limit?: number;
    queries: FilterQuery[];
}

export interface UserProgram {
    id: string;
    title: string;
    following: any;
    started?: any;
    finished: boolean;
    finishedDate?: any;
    nextTrainingWeek?: number;
    nextTrainingDay?: number;
}

export interface UserWorkout {
    id?: string;
    programId: string;
    programTitle: string;
    programWeek: number;
    programDay: number;
    finished?: any;
    duration: string;
    results: ExerciseResult[];
}

export interface UserResultNextSession {
    programId: string;
    programTitle: string;
    trainingWeek: number;
    trainingDay: number;
}

export interface UserResults {
    nextSession?: UserResultNextSession;
    finishedPrograms: number;
    finishedWorkouts: number;
    totalWeight: number;
    totalReps: number;
    totalSets: number;
}

export interface UserResultBody {
    userId: string;
    programId: string;
    programTitle: string;
    finished: boolean;
    nextTrainingWeek: number;
    nextTrainingDay: number;
    totalWeight: number;
    totalReps: number;
    totalSets: number;
}

export interface BodyWithIdentifier<T> {
    id: string;
    body: T;
}