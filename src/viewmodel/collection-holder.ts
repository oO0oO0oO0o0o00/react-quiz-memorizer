import { useImmer } from "use-immer";
import U from "../utils";
import { QuizState, QuizStatus } from "./quiz-holders";
import ArticleHolder from "./article";
import _ from "underscore";
import useSWR from "swr";
import { fetchPages, NullablePartialCollection, PartialCollection } from "../client/fetch-pages";
import { Article } from "../model/collection";

interface CollectionState {
  totalPage: number;
  progressPage: number;
  page: number;
  quizIndexes: number[];
  collection: (Article | undefined)[];
  pageStates: (QuizState<any>[] | undefined)[];
  pinyinMap: Record<string, string[]>;
}

type NullableCollectionState = CollectionState | null

function progress(
  state: CollectionState,
  currentPage: number,
  progressPage: number,
): number {
  if (state.totalPage == 0) { return 0; }
  const pageWeight = 1 / state.totalPage;
  const currentPageState = state.pageStates[currentPage];
  const pageProgress = (
    progressPage == currentPage &&
    currentPageState && (
      currentPageState.length > 0)
    ) ? (currentPageState.reduce(
        (s: number, e) => s + +(e.status == QuizStatus.final), 0)
          / currentPageState.length) : 0;
  return pageWeight * (currentPage + pageProgress);
}

export function useCollectionHolder(
  id: string,
  initialCollection: NullablePartialCollection
): CollectionHolder {
  return new CollectionHolder(id, initialCollection);
}

class CollectionHolder {
  id: string
  state: NullableCollectionState
  private setState: (updater: (draft: NullableCollectionState) => void) => void
  // loading: boolean
  // private setLoading: (loading: boolean) => void

  constructor(id: string, initialCollection: NullablePartialCollection) {
    this.id = id;
    [this.state, this.setState] = useImmer<NullableCollectionState>(
      () => initialState(initialCollection));
    // [this.loading, this.setLoading] = useState(false);
    useSWR([id, this.state?.page], ([id, page]) => {
      const currentPage = page ?? 0;
      if (this.state && currentPage >= this.state.totalPage) { return; }
      let fromPage;
      if (!this.state || !this.state?.collection[currentPage]) {
        fromPage = currentPage;
      } else if (
        this.state.collection[currentPage + 1] ||
          currentPage + 1 >= this.state.totalPage) {
        return;
      } else {
        fromPage = currentPage + 1;
      }
      fetchPages({ id, from: fromPage, to: fromPage + 1 }).then((data) => {
        this.setState((state) => {
          let newState = state ?? createState(data);
          patchState(newState, data);
          if (!state) { return newState; }
        });
      });
    });
  }

  setCurrentPageState(pageState: any) {
   this.setState((state) => U.apply_void(
    state, (state) => state.pageStates[state.page] = pageState));
  }

  switchPage(newPage: number) {
    this.setState((state) => U.apply(
     state, (state) => {
        state.page = newPage;
        state.progressPage = Math.max(
          state.progressPage, newPage);
        if (!state.pageStates[newPage] && state.collection[newPage]) {
          state.pageStates[newPage] = state.collection[newPage].quizzes.map(QuizState.create);
        }
      }));
  }

  setCurrentQuizIndex(index: number) {
    this.setState((state) => U.apply_void(
     state, (state) => state.quizIndexes[state.page] = index));
    U.apply(this.state, (state) => {
      const currentPageState = state.pageStates[state.page];
      if (currentPageState && index >= currentPageState.length) {
        this.switchPage(state.page + 1);
      }
    });
  }

  get articleHolder(): ArticleHolder | null {
    return U.apply(
      this.state, (state) => {
        const article = state.collection[state.page];
        const quizStates = state.pageStates[state.page];
        if (article == null || quizStates == null) {
          return null;
        }
        return new ArticleHolder({
          article: article,
          currentIndex: state.quizIndexes[state.page],
          setCurrentIndex: (i: number) => this.setCurrentQuizIndex(i),
          quizStates: quizStates,
          setQuizStates: (s: QuizState<any>[]) => this.setCurrentPageState(s),
          pinyinMap: state.pinyinMap,
          progress: progress(state, state.progressPage, state.progressPage),
          browsingProgress: progress(state, state.page, state.progressPage),
          loading: false, // this.loading,
      })
    });
  }

  get score(): number {
    return this.state?.pageStates.reduce(
      (s, e) => s + (e?.reduce(
        (s: any, e: any) => s + (e?.score == true ? 1 : 0), 0) ?? 0), 0) ?? 0;
  }

  get totalScore(): number {
    return this.state?.pageStates.reduce(
      (s, e) => s + (e?.length ?? 0), 0) ?? 0;
  }
}

function createState(partial: PartialCollection): CollectionState {
  return {
    totalPage: partial.totalPage,
    progressPage: 0,
    page: 0,
    quizIndexes: Array(partial.totalPage).fill(0),
    collection: Array(partial.totalPage),
    pageStates: Array(partial.totalPage),
    pinyinMap: partial?.pinyinMap ?? {},
  };
}

function patchState(state: CollectionState, partial: PartialCollection) {
  for (let [page, article] of _.zip(
    partial.pages, partial.data
  )) {
    state.collection[page] = article;
    state.pageStates[page] = article.quizzes.map(QuizState.create);
    state.pinyinMap = Object.assign({}, state.pinyinMap, partial.pinyinMap);
  }
}

function initialState(initialCollection: NullablePartialCollection): NullableCollectionState {
  if (!initialCollection) { return null; }
  let state = createState(initialCollection);
  patchState(state, initialCollection);
  return state;
}
