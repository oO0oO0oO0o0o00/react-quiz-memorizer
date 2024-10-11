export default class QuizNavigationHolder {
    constructor({ hasNext, hasPrev, goNext, goPrev }) {
        this.hasNext = hasNext;
        this.hasPrev = hasPrev;
        this.goNext = goNext;
        this.goPrev = goPrev;
    }
}
