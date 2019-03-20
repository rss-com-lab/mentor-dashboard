
# rss-mentor-dashboard-bootstrap

## data
данные из этой [папки](https://drive.google.com/drive/folders/1ULj8KjnNNCgUdGunQ1TY00dNbCsqAsHW)

## task
  * реализовать дашборд ментора школы The Rolling Scopes в виде странички на github pages
  * Дашборд должен содержать следующую информацию :
    * список студентов, которых курирует ментор
    * список тасков студентов, которые должны делать студенты

## notice
  * не выводил студентов у которых нет выполненных тасков
  * студенты привязаны к менторам из списка в [файле](https://docs.google.com/spreadsheets/d/1-HYzpnEYpIsv5qSSuSZCgKf5-mYnG0T3Xt864Hhdnew/edit#gid=546989257) независимого от того кто проверял таск
  * красным обозначены таски студентов у которых статус 'Checked', но оценки нет, остальные цвета по статусам таски
  * ручками поправлены написания тасок "Code Jam "Scoreboard"" и "RS Activist"
  * в score добавлена таска "Presentation"
  * в файл Tasks добавлено время на выполнение тасок
  * в файл Tasks добавлена таска mantor-dashboard

  
## result
Запустить скрипт

> npm run process

Github pages - https://petriken.github.io/rss-mentor-dashboard/