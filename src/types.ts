export type Grid = number[][]; // Двумерный массив для хранения состояния игрового поля

export interface IGame {
    grid: Grid;
    score: number;
    isGameOver: boolean;
    hasWon: boolean;
}

export interface IGrid {
    grid: Grid;
}

export interface ITile {
    value: number;
}

export type Direction = 'left' | 'right' | 'up' | 'down';

export interface IScoreboard {
    score: number;
}