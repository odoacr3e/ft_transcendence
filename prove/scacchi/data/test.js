// @ts-check

//FIXME - fare funzione che muove cursore (in fase di testing)

/**
 * 
 * @param {string} letter 
 */
function next (letter, dX = 0, dY = 0, isPoweredHorse = false)
{
    let codeX = letter.charCodeAt(0);
    let codeY = letter.charCodeAt(1);
    console.log(codeX, codeY);
    if (isPoweredHorse == false)
    {
        if (codeX < 97 || codeX > 122)// 'a' 'z'
            return (1);
        else if (codeX < 48 || codeX > 57)// '0' '9
            return (2);
    }
    letter = String.fromCharCode(code + n) + letter.at(1);
    return (0);
}

// /**
//  * 
//  * @param {string} letter 
//  */
// function prev (letter, n = 1)
// {
//     let code = letter.charCodeAt(0);
//     return (code - n);
// }

let str = "a1";
console.log(str);
if (next(str) != 0)
    console.log("error");
console.log(str);
