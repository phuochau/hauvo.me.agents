import { Severity } from "./severity";

export interface ProjectEvaluationIssue {
    category: string;
    severity: Severity;
    description: string;
    recommendation: string;
}

export interface ProjectEvaluation {
    isValid: boolean;
    feedback: string;
    issues: ProjectEvaluationIssue[];
    summary: string;
}