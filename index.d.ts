
export type ErrorType = Error | string;

export type Continuation<E = ErrorType> = (err?: E | null) => void;

export type AsyncCompletionCallback<E = ErrorType> = (err?: E) => void;

export type ContinuationWithResult<R, E = ErrorType> = (err?: E | null, result?: R) => void;

export type AsyncResultArrayCallback<R, E = ErrorType> = (err?: E | null, result?: Array<R | undefined>) => void;

export type AsyncIterator<T, R, E = ErrorType> = (item: T, next: ContinuationWithResult<R, E>) => void;

export type AsyncFunction<E = ErrorType> = (callback: Continuation<E>) =>  void;

export function asyncSeries<E>(tasks: AsyncFunction<E>[], done: AsyncCompletionCallback<E>): void;
export function asyncParallelLimit<E>(
  tasks: AsyncFunction<E>[],
  limit: number,
  done: AsyncCompletionCallback<E>,
): void;
export function asyncParallel<E>(
  tasks: AsyncFunction<E>[],
  done: AsyncCompletionCallback<E>,
): void;

export function asyncEachLimit<T, R = void, E = ErrorType>(
  arr: Array<T>,
  limit: number,
  proc: AsyncIterator<T, R, E>,
  done: AsyncResultArrayCallback<R, E>,
): void;
export function asyncEach<T, R = void, E = ErrorType>(
  arr: Array<T>,
  proc: AsyncIterator<T, R, E>,
  done: AsyncResultArrayCallback<R, E>,
): void;
export function asyncEachSeries<T, R = void, E = ErrorType>(
  arr: Array<T>,
  proc: AsyncIterator<T, R, E>,
  done: AsyncResultArrayCallback<R, E>,
): void;


export type ContinuationVArg<V, E = ErrorType> = (err?: E | null, ...args: V) => void;
export type AsyncVArgFunction<V, E = ErrorType> = (done: ContinuationVArg<V, E>) =>  void;

export type LimitedRun<V, E=ErrorType> = (
  task: AsyncVArgFunction<V, E>,
  done?: ContinuationVArg<V, E>
) => void;

export function asyncLimiter(
  max_parallel: number
): LimitedRun;
