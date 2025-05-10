import './App.css'
import { useState, useEffect } from 'react'

// Список слов для игры wordle
const WORDS = ['РУЧКА', 'ЛАМПА', 'КНИГА', 'РАДИО', 'ОКНО', 'КОШКА', 'МЫШКА', 'ДИВАН', 'ТОПОР', 'ЗЕМЛЯ'];
const MAX_ATTEMPTS = 6; // Максимальное количество попыток ввода букв слова



function App() { // точка входа

  const [secretWord, setSecretWord] = useState(''); // Загаданное слово
  const [guesses, setGuesses] = useState([]);       // Массив попыток ['ямены', 'цйуке', 'ирпен', 'сакен', 'пенку', 'ипнрг'] - всех введенных значений
  const [currentGuess, setCurrentGuess] = useState('');  // Текущий ввод(буквы) пользователя
  const [gameOver, setGameOver] = useState(false);      // Флаг окончания игры
  const [message, setMessage] = useState('');           // Сообщение для пользователя

  
 


  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * WORDS.length);
    setSecretWord(WORDS[randomIndex]); 
    console.log('задуманное слово ', WORDS[randomIndex])
  }, []);                   // [] значит что при первой загрузке страницы переданный коллбэк вызовется и компонент отрисуется. Компонент пеерисовывеся при смене переменнных состояния(котрые хрантяс в этой массиве)



  useEffect(() => {
    
    const handleKeyDown = (evt) => {
      console.log('evt.key', evt.key)
     
      if (gameOver) return; // выход из колллбэк функции

      
      if (/^[а-яА-ЯёË]$/.test(evt.key)) {               // Если введена буква русского алфавита
        if (currentGuess.length < 5) {
          setCurrentGuess(prev => prev + evt.key.toUpperCase()); // prev - предыдущее значение currentGuess
        }
      } 
      else if (evt.key === 'Backspace') {   // Если нажата клавиша Backspace (удаляет символ)
        setCurrentGuess(prev => prev.slice(0, -1));     // в массиве (введенных букв) удаляем псделний символ(букву)
      } 
      else if (evt.key === 'Enter') {        //  Если нажата клавиша Enter               
        console.log('currentGuess ', currentGuess) // итговая введенная строка
        if (currentGuess.length === 5) {
          checkGuess();       // проверяем полученное слово из введенных букв
        } 
        else {
          setMessage('Слово должно быть из 5 букв!')
          setTimeout(() => {
            setMessage(''); // очищаем  message=''
          }, 3000);
        }
      }
    };
    

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown); // при отключении комопнента удалим обработчик
    
  }, [ currentGuess, gameOver ]); // при смене currentGuess, gameOver будет вызываться коллбэк и перерисуется компонент

  


  const checkGuess = () => {
    //console.log('guesses', guesses); // [...guesses] копия массива
    const newGuess = [...guesses, currentGuess];  // Добавляем текущее введенное слово currentGuess в массив попыток

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
  const getCellColor = (letter, index) => { // letter- вводимая буква
    if (!letter) return '';

    if (secretWord[index] === letter) {   // Если буква на своем месте
      return 'correct';
    }
    
    if (secretWord.includes(letter)) {  // Если буква letter есть в слове, но не на своем месте
      return 'present';
    }
    
    return 'absent';  // Если буквы нет в слове
  };
  

  // Функция для начала новой игры
  const startNewGame = () => {
    const randomIndex = Math.floor(Math.random() * WORDS.length);
    setSecretWord(WORDS[randomIndex]); 
    setGuesses([]);
    setCurrentGuess('');
    setGameOver('');
    setMessage('');
  };
 


  return (
    <div className='app'>
      <header> 
        <h1>Крутая игра !</h1>
      </header>

      <div className='game-board'>
      {/* Отображаем предыдущие попытки:  */}
      { // guesses = ['ямены', 'цйуке', 'ирпен', 'сакен', 'пенку', 'ипнрг']
        guesses.map((_, guessIndex) => (  // вернет [ <div></div>, <div></div>, ]
          <div key={guessIndex} className='word-row'>
            { Array.from({ length:5 }).map((_, letterIndex) => (  // вернет [ <div></div>, <div></div>, ] 
                <div key={letterIndex} className={`letter-box ${getCellColor(guesses[letterIndex], letterIndex)}`}> {guesses[letterIndex] || ''} </div>
              ))                                                            // letter, index
            }
          </div>
        ))
      }


      {/* строка в котрую вводим буквы: */}
      { !gameOver && guesses.length < MAX_ATTEMPTS &&  ( // если условие выполнется то отобразим блок <div>
        <div className='word-row current'>  
          { Array.from({ length: 5 }).map((_, letterIndex) => (         // вернет [ <div></div>, <div></div>, ]
              <div key={letterIndex} className='letter-box'> {currentGuess[letterIndex] || ''} </div>
            ))
          } 
        </div>
       )
      }


      {/* заполняем оставшиеся пустые строки: */}
      { !gameOver && Array.from({ length: MAX_ATTEMPTS - guesses.length -1 }).map((_, rowIndex) => ( // если !gameOver true, то отобразит 
          <div key={rowIndex} className='word-row'> 
            { Array.from({ length: 5}).map((_, letterIndex) => (
                <div key={letterIndex} className='letter-box'></div>
            ))}
          </div>
        ))
      }
      </div>

      {/* добавляем блок сообщения для пользователя: если message =true то отобразит блок */}
      { message && <div className='message'> {message} </div> } 



      {/* кнопка дял начал новой игры: */}
      { gameOver && <button className='new-game-btn' onClick={startNewGame}> Новая игра </button> }

      {/* Добавляем подскажку по использования клавиатуры: */}
      { !gameOver && <div> Enter проверить, Backspace удалить </div> }
    </div>
  )
}



export default App
