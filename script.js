'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

// const accounts = [account1, account2, account3, account4];
const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');



//////////////////////////////////////////////////////////////////////////////// functions

const formatDateMovements = function(date, locale){
  const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24)); 

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0 ) return 'Today';
  if (daysPassed === 1 ) return 'Yesterday';
  if (daysPassed <= 7 ) return `${daysPassed} days ago`;
  else{
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date)
  };

  
}

const formatCur = function(value, locale, currency){
  return  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);

}

const displayMovements = function (acc, sort = false){
  containerMovements.innerHTML = '';

  //Sorting
  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements

  movs.forEach(function(mov, i){
    const type =  mov > 0? 'deposit' : 'withdrawal'

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatDateMovements(date, acc.locale);

    const formattedMov =  formatCur(mov, acc.locale, acc.currency);

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedMov} </div>
    </div>
  `

  containerMovements.insertAdjacentHTML('afterbegin', html )

  });
};


const calcDisplayBalance = function(acc){
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent =  formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function(acc){
  const incomes = acc.movements
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent =  formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
  .filter(mov => mov < 0)
  .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent =  formatCur(Math.abs(out), acc.locale, acc.currency);
  
  const interest = acc.movements.
  filter(mov => mov > 0)
  .map(deposit => deposit * acc.interestRate / 100)
  .filter(int => int >= 1)
  .reduce((acc, int) => acc + int, 0); 
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function(accs){              
  accs.forEach(function(acc){
    acc.username = acc.owner
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('');
  });
};
createUsernames(accounts);

const updateUI = function(acc){
  //Display Movements
  displayMovements(acc)

  //Display Balance
  calcDisplayBalance(acc);

  //Display Summary
  calcDisplaySummary(acc);
};

const startLogOuttimer = function(){
  const tick = function(){
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    //In each callback call, print the remaining time to the UI
    labelTimer.textContent = `${min}:${sec}`;

    //When the time is at 0, stop timer and logout user
    if (time === 0){
      clearInterval(timer)
      labelWelcome.textContent = 'Login to get started'
      containerApp.style.opacity = 0;
      
    }
    //decrease 1s
    time--
  };

  //set time to 5mins
  let time = 600;

  //call the timer every second 
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
}


//Event handlers
let currentAccount, timer;

btnLogin.addEventListener('click', function(e){
  //prevent form form submitting
  e.preventDefault();
  currentAccount =  accounts.find(acc => acc.username === inputLoginUsername.value);

  if(currentAccount?.pin === Number(inputLoginPin.value)){
    //Display UI and a welcome message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = '100'


    //setting the current date
    const now = new Date();
    const options =  {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    // weekday: 'long'
  }
  // const locale = navigator.language;
  labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);
    // const now  = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;


    //CLear inout fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();

    if (timer) clearInterval(timer)
    timer = startLogOuttimer();

    //Update UI
    updateUI(currentAccount);

  }
});

//Implementing transfers
btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value)
    inputTransferAmount.value = '';
    inputTransferTo.value = '';

    if( amount > 0 && 
      recieverAccount && 
      currentAccount.balance >= amount && 
      recieverAccount?.username !== currentAccount.username 
    ){
      //Doing the transfer
      currentAccount.movements.push(-amount);
      recieverAccount.movements.push(amount);

      //Add transfer date
      currentAccount.movementsDates.push(new Date().toISOString());
      recieverAccount.movementsDates.push(new Date().toISOString());

      //Update UI
      updateUI(currentAccount);

      //Reset timer
      clearInterval(timer);
      timer = startLogOuttimer();
    }
})

//Loan button
btnLoan.addEventListener('click', function(e){
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  //NOTE:customer can only collect a loan if they have any deposit greater than 10% of the requested loan amount
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1 )){
    
    setTimeout(function(){
      //Add movements
    currentAccount.movements.push(amount);

    //Add loan date
    currentAccount.movementsDates.push(new Date().toISOString());

    //Update UI
    updateUI(currentAccount);
    }, 2500)

    //Reset timer
    clearInterval(timer);
    timer = startLogOuttimer();
  }
  inputLoanAmount.value = ''
})




//Close account
btnClose.addEventListener('click', function(e){
  e.preventDefault();

  if( inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
    ){
      const index = accounts.findIndex(
        acc => acc.username === currentAccount.username
        );
        console.log(index);

        //Delete
      accounts.splice(index, 1);

      //Hide UI
      containerApp.style.opacity = 0;
    }
    inputCloseUsername.value = '';
    inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function(e){
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted)
  sorted = !sorted

})

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////
// const now = new Date()
// console.log(now);

// console.log(new Date("Aug 05 2020 12:45:12"));

// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future);;

// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.toISOString());
// console.log(future.getTime());

// console.log(new Date(2142253380000));

// console.log(Date.now());





