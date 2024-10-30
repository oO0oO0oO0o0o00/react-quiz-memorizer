export enum QuizKind {
    filling = "filling",
    ordering = "ordering",
    selection = "selection",
}

export class Quiz {
    kind = QuizKind.filling
    entries: string[] = []
    answers: (number | string)[][] = []
}

export class Article {
    title = ''
    text = ''
    icon: string | null = null
    quizzes: Quiz[] = []
}
