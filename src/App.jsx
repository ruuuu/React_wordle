import { requestFormReset } from 'react-dom';
import './App.css'
import { useState, useEffect } from 'react'


// Список слов для игры wordle
const WORDS = ['РУЧКА', 'ЛАМПА', 'КНИГА', 'РАДИО', 'ОКНО', 'КОШКА', 'МЫШКА', 'ДИВАН', 'ТОПОР', 'ЗЕМЛЯ'];
const MAX_ATTEMPTS = 6; // Максимальное количество попыток


function App() { // точка входа

  const [secretWord, setSecretWord] = useState(''); // Загаданное слово
  const [guesses, setGuesses] = useState([]);       // Массив попыток
  const [currentGuess, setCurrentGuess] = useState('');  // Текущий ввод(буквы) пользователя
  const [gameOver, setGameOver] = useState(false);      // Флаг окончания игры
  const [message, setMessage] = useState('');           // Сообщение для пользователя


 


  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * WORDS.length);
    setSecretWord(WORDS[randomIndex]); 
  }, []); // [] значит что при первой загрузке страницы переданный коллбэк вызовется и компонент отрисуется. Компонент пеерисовывеся при смене переменнных состояния(котрые хрантяс в этой массиве)


  useEffect(() => {
    
    const handleKeyDown = (evt) => {
      if (gameOver) return; // выход из функции

      //Если нажата буква русского алфавита
      if (/^[а-яА-ЯёË]$/.test(evt.key)) {
        if (currentGuess.length < 5) {
          setCurrentGuess(prev => prev + evt.key.toUpperCase());
        }
      } 
      else{
        if (evt.key === 'Backspace') {      // Если нажата клавиша Backspace (удаляет символ)
          setCurrentGuess(prev => prev.slice(0, -1)); // вернет строку без послдней буквы
        } 
        else if (evt.key === 'Enter') {     //  Если нажата клавиша Enter
          if (currentGuess.length === 5) {
            checkGuess();
          } 
          else{
            setMessage('Слово должно быть из 5 букв!')
            setTimeout(() => {
              setMessage('');
            }, 3000);
          }
        }
      }
    };

    window.addEventListener('keyDown', handleKeyDown);

    return () => window.removeEventListener('keyDown', handleKeyDown); // при отключении комопнента отлючаем обработчик

  }, [ currentGuess, gameOver ]); // при смене currentGuess, gameOver будет вызываться коллбэк


  //
 


  return (
    <>
     <h1>Heabyf</h1>
    </>
  )
}

export default App
