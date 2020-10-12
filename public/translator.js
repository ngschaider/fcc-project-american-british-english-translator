import { americanOnly } from './american-only.js';
import { britishOnly } from './british-only.js';
import { americanToBritishSpelling } from './american-to-british-spelling.js';
import { americanToBritishTitles } from './american-to-british-titles.js';

const britishToAmericanTitles = {};
Object.keys(americanToBritishTitles).forEach(key => {
  const value = americanToBritishTitles[key];
  britishToAmericanTitles[value] = key;
});

const britishToAmericanSpelling = {};
Object.keys(americanToBritishSpelling).forEach(key => {
  const value = americanToBritishSpelling[key];
  britishToAmericanSpelling[value] = key;
});

const britishToAmericanDict = { ...britishToAmericanSpelling, ...britishOnly };
const americanToBritishDict = { ...americanToBritishSpelling, ...americanOnly };


const translateButton = document.getElementById("translate-btn");
const clearButton = document.getElementById("clear-btn");
const localeSelect = document.getElementById("locale-select");
const translatedSentence = document.getElementById("translated-sentence");
const errorMsg = document.getElementById("error-msg");
const textInput = document.getElementById("text-input");


const setErrorMsg = (msg) => {
  errorMsg.innerText = msg;
}
const setTranslatedSentence = (sentence) => {
  translatedSentence.innerText = sentence;
}

const ucfirst = (str) => {
  return str.substr(0, 1).toUpperCase() + str.substr(1);
}

const translateSentence = (sentence, targetLocale) => {
  sentence = translateTitles(sentence, targetLocale);
  sentence = translateTimes(sentence, targetLocale);
  sentence = translateTerms(sentence, targetLocale);
  return sentence;
}

const translateTerms = (sentence, targetLocale) => {
  const targetDict = targetLocale === "british" ? americanToBritishDict : britishToAmericanDict;
  Object.keys(targetDict).forEach(fromTerm => {
    const toTerm = targetDict[fromTerm];

    const matches = sentence.toLowerCase().match(new RegExp("(?<=[,. ]|^)(" + fromTerm.toLowerCase() + ")(?=[,. ]|$)", "g"));

    if(!matches) {
      return;
    }

    for(var i = 0; i < matches.length; i++) {
      const match = matches[i];
      const index = sentence.toLowerCase().indexOf(match);
      const isUppercase = sentence.substring(index, index + 1) != sentence.toLowerCase().substring(index, index + 1);
      if(isUppercase) {
        sentence = sentence.substring(0, index) + ucfirst(toTerm) + sentence.substring(index + match.length);
      } else {
        sentence = sentence.replace(match, toTerm);
      }
    }
  });

  return sentence;
};

const translateTitles = (sentence, targetLocale) => {
  const targetDict = targetLocale === "british" ? americanToBritishTitles : britishToAmericanTitles;

  const words = sentence.split(" ").map(word => {
    const isUppercase = word[0] !== word[0].toLowerCase();
    if(targetDict[word.toLowerCase()]) {
      if(isUppercase) {
        return ucfirst(targetDict[word.toLowerCase()]);
      } else {
        return targetDict[word.toLowerCase()];
      }
    } else {
      return word;
    }
  });

  return words.join(" ");
}

const translateTimes = (sentence, targetLocale) => {
  if(targetLocale === "british") {
    return sentence.replace(/(\d{1,2}):(\d{1,2})/g, "$1.$2");
  } else {
    return sentence.replace(/(\d{1,2}).(\d{1,2})/g, "$1:$2");
  }
};

translateButton.addEventListener("click", () => {
  const sentence = textInput.value;

  if(sentence === "") {
    setTranslatedSentence("Error: No text to translate.");
  } else {
    const targetLocale = localeSelect.value === "british-to-american" ? "american" : "british";
    const translated = translateSentence(sentence, targetLocale);
    if(translated === sentence) {
      setTranslatedSentence("Everything looks good to me!");
    } else {
      setTranslatedSentence(translated);
    }
  }
});

clearButton.addEventListener("click", () => {
  setErrorMsg("");
  setTranslatedSentence("");
  textInput.value = "";
});


/*
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {
    translateTitles,
    translateSentence,
    translateTimes
  };
} catch(e) {}

