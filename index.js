let inputSlider = document.querySelector("[data-lengthslider]");
const lengthDisplay = document.querySelector("[data-lengthnumber]");

const passwordDisplay = document.querySelector("[data-passworddisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copymsg]");

const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");

const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
let password = "";
let passwordLength = 10;

// let one condition be checked by default, so the count will be 1
uppercaseCheck.checked = true;

let checkCount = 1;
// set strength circle color to grey


// handleSlider();
// set password
function handleSlider() {
    inputSlider = passwordLength;
    lengthDisplay.innerText = passwordLength;
}


function setIndicator(color) {
    indicator.style.backgroundColor = color;
    // shadow
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;      // max - min + 1
}

function generateRandomNumber() {
    return getRndInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerHTML = "copied";
    } catch (e) {
        copyMsg.innerHTML = "Failed";
    }

    // to make the { Copied } text in the HTML visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}


// event listeners

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) copyContent();
})

// Function to increment the counter for the checkboxes, if checked
allCheckBox.forEach((checkBox) => {
    checkBox.addEventListener('change', handleCheckBoxChange());
})

function handleCheckBoxChange() {
    checkCount = 0;

    allCheckBox.forEach((checkBox) => {
        if (checkBox.checked) checkCount++;
    })

    //special condition 
    // checking if the specified passoword length is according to the given condition for obtainig the passoword

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

// main Function - Generating the Password

generateBtn.addEventListener('click', () => {
    // if none of the checkbox is selected
    if (checkCount <= 0) {
        alert('Atleast check one checkbox');
        return;
    }

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // removing the previous/old password
    console.log("Starting the Password Generation : ");
    password = "";

    // adding the codition added through the checked checkboxes


    // if(uppercaseCheck.checked) password += generateUpperCase();
    // if(lowercaseCheck.checked) password += generateLowerCase();
    // if(numbersCheck.checked) password += generateRandomNumber();
    // if(symbolsCheck.checked) password += generateSymbol();

    // doing the upper mentioned (commented) code in better way

    let funcArr = [];

    if (uppercaseCheck.checked) funcArr.push(generateUpperCase());
    if (lowercaseCheck.checked) funcArr.push(generateLowerCase());
    if (numbersCheck.checked) funcArr.push(generateRandomNumber());
    if (symbolsCheck.checked) funcArr.push(generateSymbol());

    // now adding all the characters/elements we have added in the { funcArr } through the above step
    // compulsory addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i];                                // password += funcArr[i]();
    }

    console.log("Compulsory Addition Done : ");

    // remaining elements/characters addition
    // like -> if we have specified the passsword Length to be 10 and have checked all the 4 boxes, then there is still 6 values left to be added in the password
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);

        console.log("randIndex" + randIndex);

        password += funcArr[randIndex];                        // password += funcArr[randIndex]();
    }

    console.log("Remaining Addition Done : ");

    // Now Suffling the Password
    password = shufflePassword(Array.from(password));                  // Array.from(password)    -> sending the password obtained in the form of an array to the function -> shufflePassword()

    console.log("Shuffling Done : ");

    // updation in UI
    passwordDisplay.value = password;

    console.log("UI Addition Done : ");

    // calculate the Strength
    calcStrength();
})


// Function to Shuffle the Passoword - > { shufflePassword }

function shufflePassword(shufflePassword) {
    // Fisher Yates Method

    for (let i = shufflePassword.length - 1; i > 0; i--) {
        // random j, find out using the Ranodm Funtion
        const j = Math.floor(Math.random() * (i + 1));

        // swapping the values at index i and j
        const temp = shufflePassword[i];
        shufflePassword[i] = shufflePassword[j];
        shufflePassword[j] = temp;
    }

    let str = "";
    shufflePassword.forEach((el) => (str += el));
    return str;
}