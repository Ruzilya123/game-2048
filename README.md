# Игра 2048

_сделано в рамках тестового задания_

## Описание проекта
Это веб-версия классической игры 2048, разработанная с использованием React (классовые компоненты) и Canvas API для визуализации игрового поля и плиток. Основной игровой процесс включает в себя перемещение плиток по сетке и их объединение при совпадении значений. Игра продолжается до тех пор, пока игрок не достигнет плитки 2048 или не исчерпаются возможные ходы.

## Основные функции:
- Реализация движения плиток в 4 направлениях (вверх, вниз, влево, вправо).
- Слияние плиток с одинаковыми числами.
- Генерация новых плиток после каждого движения.
- Подсчет очков.
- Проверка условий победы и проигрыша.
- Отображение игры с использованием элемента Canvas.
- Кнопка для перезапуска игры.

GitHub Pages - https://ruzilya123.github.io/game-2048/

## Установка:
Установить зависимости - ```npm install```
Запустить проект ```npm start```

## Структура проекта:
- components/ - содержит основные компоненты игры
- utils — вспомогательные функции для обработки игровой логики (движение плиток, проверка победы/проигрыша, генерация новой плитки)
- constants — содержит константы для цветов плиток и направлений движения
- types — описывает типы данных, используемые в игре

## Логика игры:
1. Игра начинается с двумя случайно сгенерироваными плитками.
2. Игрок может двигать плитки в четырех направлениях с помощью клавиш на клавиатуре.
3. При каждом перемещении:
    - Все плитки сдвигаются в выбранном направлении.
    - Плитки с одинаковыми значениями сливаются в одну, при этом их значения складываютсяю
    - На поле появляется новая плитка в случайной пустой клетке.
4. Игра заканчивается, когда игрок не может сделать ход.

## Технологии
- React - библиотека для построения пользовательких интерфейсов.
- Canvas API - используется для отрисовки плиток и игрового поля.
- TypeScript - для типизации кода и улучшения надежности приложения.



