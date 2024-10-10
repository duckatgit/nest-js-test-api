export interface Todo {
    id?: string;
    title: string;
    description: string;
    completed: boolean;
    creatorId: string;
    assigneeId?: string; // Store multiple assignees
}
