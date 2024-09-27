import { Component, createRef, RefObject } from "react";
import { IGame } from "../types";
import { COLORS_NUM, DIRECTION } from "../constants";
import { addNewTile, checkGameOver, checkWin, initGrid, move } from "../utils";
import Scoreboard from "./ScoreBoard";
import '../styles.css';

class Game extends Component<{}, IGame> {
    private canvasRef: RefObject<HTMLCanvasElement>; // ссылка на элемент <canvas>

    constructor(props: {}) {
        super(props);
        this.state = {
            grid: initGrid(), // инициализация сетки с двумя случайными плитками
            score: 0, // начальный счет равен 0
            isGameOver: false, // игра не завершена
            hasWon: false // победа не достигнута
        }
        this.canvasRef = createRef(); // создаем ссылку на элемент canvas
    }

    // Когда компонент монтируется, добавляем обработчики событий и рисуем начальную сетку
    componentDidMount() {
        this.setupEventListeners(); // добавляем обработчики для управления с клавиатуры
        this.drawCanvas() // рисуем сетку с плитками
    }

    // Каждый раз при обновлении состояния или пропсов перерисовываем сетку
    componentDidUpdate() {
        this.drawCanvas();
    }

    // Установка обработчиков событий для клавиш направления
    setupEventListeners() {
        window.addEventListener('keydown', this.handleKeyPress);
    }

    // Обработчик событий клавиатуры (движение плиток)
    handleKeyPress = (event: KeyboardEvent) => {
        // Если игра завершена или игрок победил, больше не обрабатываем события
        if (this.state.isGameOver || this.state.hasWon) return;

        let direction: DIRECTION | undefined; // направление движения
        switch (event.key) {
            case 'ArrowLeft':
                direction = DIRECTION.LEFT;
                break;
            case 'ArrowRight':
                direction = DIRECTION.RIGHT;
                break;
            case 'ArrowUp':
                direction = DIRECTION.UP;
                break;
            case 'ArrowDown':
                direction = DIRECTION.DOWN;
                break;
        }

        if (direction) {
            // Логика движения плиток и слияния
            const { grid, moved, score } = move(this.state.grid, direction); // move возвращает новую сетку, флаг движения и очки
            if (moved) { // если плитки сдвинулись
                const newTileGrid = [...grid]; // копируем новую сетку
                const newScore = this.state.score + score; // обновляем счет
                addNewTile(newTileGrid);
                this.setState({ grid: newTileGrid, score: newScore });

                // Проверяем, выиграл ли игрок
                if (checkWin(newTileGrid)) {
                    this.setState({ hasWon: true });
                    alert('Вы выиграли!');  // можно слепить модалку
                } else if (checkGameOver(newTileGrid)) { // Проверяем, если больше не осталось ходов
                    alert('Больше ходов нет, вы проиграли! Попробуйте снова');
                    this.setState({ isGameOver: true });
                } else { // Если игра продолжается, обновляем состояние
                    this.setState({ grid: newTileGrid, score: newScore });
                }
            }
        }
    }

    // Метод для отрисовки сетки и плиток на Canvas
    drawCanvas = () => {
        const canvas = this.canvasRef.current; // получаем текущий элемент canvas
        if (!canvas) return; // если canvas не существует, выходим
        const ctx = canvas.getContext('2d'); // получаем контекст для рисования
        if (!ctx) return; // если контекст недоступен, выходим

        ctx.clearRect(0, 0, canvas.width, canvas.height); // очищаем canvas перед перерисовкой

        // Перебираем каждую плитку в сетке и рисуем её
        this.state.grid.forEach((row, rowIndex) => {
            row.forEach((tileVal, colIndex) => {
                this.drawTile(ctx, rowIndex, colIndex, tileVal); // рисуем плитку
            });
        });
    }

    // Отрисовка отдельной плитки
    drawTile = (ctx: CanvasRenderingContext2D, row: number, col: number, value: number) => {
        const size = 100; // размер плитки
        const x = col * size; // позиция по X
        const y = row * size; // позиция по Y

        // Задаем цвет фона плитки
        ctx.fillStyle = value === 0 ? '#ccc0b3' : this.getTileColor(value);
        ctx.fillRect(x, y, size, size); // рисуем плитку

        // Рисуем обводку
        ctx.strokeStyle = '#fff'; // цвет обводки (белый)
        ctx.lineWidth = 5; // ширина обводки
        ctx.strokeRect(x, y, size, size); // рисуем обводку вокруг плитки

        // Если плитка имеет значение, отрисовываем его в центре плитки
        if (value !== 0) {
            ctx.fillStyle = '#776e65'; // цвет текста
            ctx.font = '30px Arial'; // шрифт для текста
            ctx.fillText(value.toString(), x + size / 2 - 10, y + size / 2 + 10); // рисуем значение плитки
        }
    }

    // Возвращаем цвет плитки в зависимости от её значения
    getTileColor = (value: number) => {
        return COLORS_NUM[value] || '#ccc0b3'; // берем цвет из объекта COLORS_NUM, если цвет не найден - серый
    }

    // Перезапуск игры (обнуление состояния)
    restartGame = () => {
        this.setState({
            grid: initGrid(), // новая сетка
            score: 0, // сбрасываем счет
            isGameOver: false, // игра продолжается
            hasWon: false, // победы нет
        });
    }

    // Отображение игры и элементов управления
    render() {
        return (
            <div className="game-layout">
                <h1>2048</h1>
                <Scoreboard score={this.state.score} />
                <canvas ref={this.canvasRef} width={400} height={400} />
                <button onClick={() => this.restartGame()}>New Game</button>
            </div>
        );
    }
}

export default Game;
