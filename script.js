// console.log("Hello");
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
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
let checkCount = 0;
handleSlider();
//set strength circle color to gray
setIndicator("#ccc");

//set password length as per slider value
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    let min = inputSlider.min;
    let max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min) ) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow

}

function getRndInteger(min, max)
{
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber()
{
    return getRndInteger(0,9);
}

function generateLowerCase()
{
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase()
{
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol()
{
    let num = getRndInteger(0, symbols.length);
    return symbols.charAt(num);
}

function calcStrength(){
    let upper = false;
    let lower = false;
    let symbol = false;
    let number = false;
    if(uppercaseCheck.checked) upper = true;
    if(lowercaseCheck.checked) lower = true;
    if(symbolsCheck.checked) symbol = true;
    if(numbersCheck.checked) number = true;

    if(upper && lower && (number || symbol) && passwordLength >= 8)
        setIndicator("#0f0");
    else if((lower || upper) && (number || symbol) && passwordLength >= 6)
        setIndicator("#ff0");
    else
        setIndicator("#FF0000");
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);//writeText uses clipboard API to copy to clipboard
        //this method returns a promise
        //But text is displayed only when promise is resolved therefore awit is used
        //It may also cause error therefore try, catch block used
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    //timer to remove copied text after 2s
    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);

}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkBox) => {
        if(checkBox.checked)
            checkCount++;
    });

    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }
}

// increase checkCount when check Box is checked. Therfore add eventListeners for all the checkBoxes
allCheckBox.forEach( (checkBox) => {
    checkBox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider(); 
});

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value) //check if passwordDisplay is non-empty so that text is copied only when password box in non-empty
    {
        copyContent();
    }
});

function shufflePassword(array)
{
    //Algo used for shuffling = Fischer Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

generateBtn.addEventListener('click', () => {
    //if none of the check boxes is checked do not generate password
    if(checkCount <= 0) 
        return;

    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }

    //finding new password

    //rempve old password
    let password = "";
    
    //add stuff of checked boxes
    // if(uppercaseCheck.checked)
    //     password += generateUpperCase();
    // if(lowercaseCheck.checked)
    //     password += generateLowerCase();
    // if(symbolsCheck.checked)
    //     password += generateSymbol();
    // if(numbersCheck.checked)
    //     password += generateRandomNumber();

    //add all the functions in an array as per checkBoxes clicked
    //generate Random integer between 0 and array.size()
    //call the random functions and add the characters
    let funcArr = [];
    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);
    if(lowercaseCheck.checked)
        funcArr.push(generateUpperCase);
    if(symbolsCheck.checked)
        funcArr.push(generateUpperCase);
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);
    
    //cumpulsory addition as per checked boxes
    for(let i = 0 ; i < funcArr.length ; i++)
    {
        password += funcArr[i]();
    }

    //remaining addition done randomly
    for(let i = 0 ; i < (passwordLength - funcArr.length) ; i++)
    {
        let rndIndex = getRndInteger(0, funcArr.length);
        //console.log(rndIndex);
        password += funcArr[rndIndex]();
    }

    //shuffle all the elements of password for added security
    password = shufflePassword(Array.from(password)); //convert password to array and send to shuffle so the mentioned algo can be applied.
    
    //display password
    passwordDisplay.value = password;

    //calculate Strength
    calcStrength();
});


