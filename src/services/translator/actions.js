export function increment(state) {
    state.count += 1;
}

export function decrement(state) {
    state.count -= 1;
}

export function incrementByAmount(state, action) {
    state.count += action.payload;
}