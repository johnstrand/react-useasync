import { useReducer } from "react";

export enum AsyncState {
    Pending,
    Done,
    Error
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
    const [{ value, state }, dispatch] = useReducer(
        (state: State<R>, action: Partial<State<R>>) => ({
            ...state,
            ...action
        }),
        { value: initialValue as R, state: AsyncState.Pending }
    );

    const invoke = (...args: T) => {
        dispatch({ state: AsyncState.Pending });
        method(...args)
            .then(value => {
                dispatch({ value, state: AsyncState.Done });
            })
            .catch(err => {
                dispatch({ value: err, state: AsyncState.Error });
            });
    };

    return [value, state, invoke];
}
