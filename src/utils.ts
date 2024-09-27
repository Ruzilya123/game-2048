import { Direction, Grid } from "./types";
import { DIRECTION } from "./constants";

// Инициализация начальной сетки 4x4
export const initGrid = (): Grid => {
    const grid = Array(4).fill(null)
        .map(() => Array(4).fill(0)); // Создаем пустую сетку (все ячейки равны 0)
    addNewTile(grid); // Добавляем первую плитку
    addNewTile(grid); // Добавляем вторую плитку
    return grid;
}

// Функция для добавления новой плитки (2 или 4) на случайное пустое место
export const addNewTile = (grid: Grid) => {
    const emptyTiles: [number, number][] = []; // Массив для хранения координат пустых ячеек

    // Поиск пустых клеток (значения 0)
    for (let r = 0; r < grid.length; r++) { // r - row, проходим по строкам
        for (let c = 0; c < grid[r].length; c++) { // c - column, проходим по столбцам
            if (grid[r][c] === 0) emptyTiles.push([r, c]); // Добавляем координаты пустых ячеек
        }
    }

    // Проверяем, есть ли пустые клетки для добавления новой плитки
    if (emptyTiles.length > 0) {
        // Выбираем случайное пустое место
        const [r, c] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

        // С вероятностью 90% добавляем плитку со значением 2, с 10% вероятностью — 4
        grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
}

// Функция для выполнения движения плиток и их слияния
export const move = (grid: Grid, direction: Direction) => {
    let moved = false; // Флаг, показывающий, были ли сдвинуты плитки
    let score = 0; // Переменная для хранения полученных очков

    // Обрабатываем одну линию (строку или столбец), удаляя нули и объединяя плитки
    const processLine = (line: number[]) => {
        let newRow = line.filter(value => value !== 0); // Убираем нули (пустые плитки)

        // Объединяем одинаковые плитки
        for (let j = 0; j < newRow.length - 1; j++) {
            if (newRow[j] === newRow[j + 1]) {
                newRow[j] *= 2; // Удваиваем значение при объединении плиток
                newRow[j + 1] = 0; // Освобождаем вторую плитку
                moved = true; // Отмечаем, что произошло движение
                score += newRow[j]; // Добавляем очки за объединенные плитки
            }
        }

        // Убираем вновь образовавшиеся нули после объединения
        newRow = newRow.filter(value => value !== 0);

        // Дополняем линию нулями до нужной длины (возвращаем удалённые нули)
        while (newRow.length < grid.length) newRow.push(0);

        return newRow;
    };

    // Функция для обработки всех строк или столбцов в зависимости от направления движения
    const moveGrid = (getLine: (i: number) => number[], setLine: (i: number, newLine: number[]) => void) => {
        for (let i = 0; i < grid.length; i++) {
            const line = getLine(i); // Получаем строку или столбец
            const newLine = processLine(line); // Обрабатываем (двигаем и объединяем плитки)
            if (line.join() !== newLine.join()) moved = true; // Проверяем, изменилось ли состояние линии
            setLine(i, newLine); // Устанавливаем обработанную линию обратно в сетку
        }
    }

    // Выполняем движение в зависимости от направления
    switch (direction) {
        case DIRECTION.LEFT:
            moveGrid(
                i => grid[i], // Получаем строку
                (i, newLine) => grid[i] = newLine// Устанавливаем строку обратно
            );
            break;
        case DIRECTION.RIGHT:
            moveGrid(
                i => grid[i].slice().reverse(), // Получаем строку в обратном порядке
                (i, newLine) => grid[i] = newLine.reverse() // Устанавливаем строку в обратном порядке
            );
            break;
        case DIRECTION.UP:
            moveGrid(
                i => grid.map(row => row[i]), // Получаем столбец
                (i, newLine) => newLine.forEach((val, j) => grid[j][i] = val)  // Устанавливаем столбец
            );
            break;
        case DIRECTION.DOWN:
            moveGrid(
                i => grid.map(row => row[i]).reverse(), // Получаем столбец в обратном порядке
                (i, newLine) => newLine.reverse()
                    .forEach((val, j) => grid[j][i] = val) // Устанавливаем столбец в обратном порядке
            );
            break;
    }

    // Возвращаем измененные значения: флаг движения, новую сетку и очки
    return { moved, grid, score };
}

// Функция проверки, есть ли доступные ходы
export const checkGameOver = (grid: Grid) => {
    // Проверяем, есть ли хотя бы одна пустая клетка
    if (grid.some(row => row.includes(0))) return false;

    // Проверяем, можно ли объединить соседние плитки (вправо или вниз)
    return !grid.some((row, i) =>
        row.some((val, j) =>
            (i < grid.length - 1 && val === grid[i + 1][j]) || // Соединение плиток вниз
            (j < grid[i].length - 1 && val === grid[i][j + 1]) // Соединение плиток вправо
        )
    );
};


// Функция проверки победы (появление плитки со значением 2048)
export const checkWin = (grid: Grid): boolean => {
    return grid.flat().includes(2048); // Проверяем, есть ли плитка со значением 2048
};
