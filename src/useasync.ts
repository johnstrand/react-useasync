import { useReducer, useCallback, useRef, useEffect } from "react";

export enum AsyncState {
  Idle,
  Pending,
  Done,
  Error,
}

type State<T> = { value: T; state: AsyncState };
type AsyncFunction<T extends any[], R> = (...args: T) => Promise<R>;
type ReturnType<T extends any[], R> = [R, AsyncState, (...args: T) => void];

export default function useAsync<T extends any[], R>(
  method: AsyncFunction<T, R>
): ReturnType<T, R | undefined>;
export default function useAsync<T extends any[], R>(
  method: AsyncFunction<T, R>,
  initialValue: R
): ReturnType<T, R>;
export default function useAsync<T extends any[], R>(
  method: AsyncFunction<T, R>,
  initialValue?: R
): ReturnType<T, R> {
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => void (isMounted.current = false);
  }, []);

  const [{ value, state }, dispatch] = useReducer(
    (state: State<R>, action: Partial<State<R>>) => ({
      ...state,
      ...action,
    }),
    { value: initialValue as R, state: AsyncState.Idle }
  );

  const invoke = useCallback(
    (...args: T) => {
      if (!isMounted.current) {
        return;
      }
      dispatch({ state: AsyncState.Pending });
      method(...args)
        .then((value) => {
          if (isMounted.current) {
            dispatch({ value, state: AsyncState.Done });
          }
        })
        .catch((err) => {
          if (isMounted.current) {
            dispatch({ value: err, state: AsyncState.Error });
          }
        });
    },
    [method]
  );

  return [value, state, invoke];
}
