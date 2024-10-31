import { z } from "zod"

export enum QuizKind {
    filling = "filling",
    ordering = "ordering",
    selection = "selection",
}

export const QuizKindType = z.enum([
    QuizKind.filling,
    QuizKind.ordering,
    QuizKind.selection,
]);

export const QuizType = z.object({
    kind: QuizKindType,
    entries: z.array(z.string()),
    answers: z.array(z.array(z.union([
        z.number(), z.string()])))
});

export class Quiz {
    kind = QuizKind.filling
    entries: string[] = []
    answers: (number | string)[][] = []
}

export const ArticleType = z.object({
    title: z.string(),
    text: z.string(),
    icon: z.optional(z.string()),
    quizzes: z.array(QuizType),
});

export type ArticleType = z.infer<typeof ArticleType>;

export class Article {
    title = ''
    text = ''
    icon: string | null = null
    quizzes: Quiz[] = []
}
