// src/lib/stores/detailMovieStore.js
import { writable } from 'svelte/store';

const initialState = null;

export const detailMovieStore = writable(initialState);

export function setMovie(movie) {
    detailMovieStore.set(movie);
}

export function clearMovie() {
    detailMovieStore.set(initialState);
}
