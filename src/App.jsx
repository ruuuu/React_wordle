import { requestFormReset } from 'react-dom';
import './App.css'
import { useState, useEffect } from 'react'


// Список слов для игры wordle
const WORDS = ['РУЧКА', 'ЛАМПА', 'КНИГА', 'РАДИО', 'ОКНО', 'КОШКА', 'МЫШКА', 'ДИВАН', 'ТОПОР', 'ЗЕМЛЯ'];
const MAX_ATTEMPTS = 6; // Максимальное количество попыток ввода букв слова


function App() { // точка входа

  const [secretWord, setSecretWord] = useState(''); // Загаданное слово
  const [guesses, setGuesses] = useState([]);       // Массив попыток ['a', 'р', 'в']
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
          setCurrentGuess(prev => prev + evt.key.toUpperCase()); // prev - предыдущее значение currentGuess
        }
      } 
      else{
        if (evt.key === 'Backspace') {      // Если нажата клавиша Backspace (удаляет символ)
          setCurrentGuess(prev => prev.slice(0, -1)); // вернет строку без послдней буквы
        } 
        else if (evt.key === 'Enter') {     //  Если нажата клавиша Enter
          if (currentGuess.length === 5) {
            checkGuess();       // проверяем слово
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

    return () => window.removeEventListener('keyDown', handleKeyDown); // при отключении комопнента удалим обработчик

  }, [ currentGuess, gameOver ]); // при смене currentGuess, gameOver будет вызываться коллбэк

  


  const checkGuess = () => {
    //console.log('guesses', guesses);
    const newGuess = [...guesses, currentGuess];  // Добавляем текущее слово currentGuess в массив попыток

    //console.log('newGuess ', newGuess);
    setGuesses(newGuess);
    setCurrentGuess(''); // очищаем текущее введенную букву

    
    if (currentGuess === secretWord) { // если слово угадано
      setGameOver(true);
      setMessage('Поздравляем, вы угадали слово!')
      return; // выход из функции
    }

    if (newGuess.length >= MAX_ATTEMPTS) {
      setGameOver(true);
      setMessage(`Вы проиграли! Загаданное слово было ${secretWord}`)
    }
  };


  // Функция определения цвета клетки
  const getCellColor = (letter, index, word) => { // letter- вводимая буква
    if (!letter) return '';

    if (secretWord[index] === letter) {   // Если буква на своем месте
      return 'correct';
    }
    
    if (secretWord.includes(letter)) {  // Если буква letter есть в слове, но не на своем месте
      return 'present';
    }
    
    return 'not found';  // Если буквы нет в слове
  }
  

  // Функция для начала новой игры
  const startNewGame = () => {
    const randomIndex = Math.floor(Math.random() * WORDS.length);
    setSecretWord(WORDS[randomIndex]); 
    setGuesses([]);
    setCurrentGuess('');
    setGameOver('');
    setMessage('');
  }
 


  return (
    <div className='app'>
      <header> 
        <h1>Крутая игра !</h1>
      </header>

     <div className='game-board'>
      {
        guesses.map((guess, guessIndex) => {  // [ <div></div>, <div></div>, ]
          <div key={guessIndex} className='word-row'>
            { Array.from({ length:5 }).map((_, letterIndex) => {
              <div key={letterIndex} className=''></div>
              })
            }
          </div>
        })
      }
     </div>
    </div>
  )
}

export default App
