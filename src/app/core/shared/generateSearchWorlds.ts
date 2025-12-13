export function generateSearchWords(title: string): string[] {
    let mainWord:string = title.toLowerCase();
    const result: string[] = [];
    result.push(mainWord);

    let split: string[];

    split = mainWord.match(/[а-яА-Я]+|[a-zA-Z]+|[0-9]+/g);
    if (split.length > 1) {
      split.forEach(
        value => {
          if(value.length > 0) result.push(value);
        }
      );
    }

    split = mainWord.split(/-| |\(|\)|_|\\|\//);
    if (split.length > 1) {
      split.forEach(
        value => {
          if(value.length > 0 && result.indexOf(value) == -1) result.push(value);
        }
      )
      mainWord = split.join('');
      result.push(mainWord);
    }

    let i: number;
    const max: number = Math.min(mainWord.length, 11 - result.length);
    for (i = 1; i < max; i++) {
      let word: string = mainWord.substr(0, i);
      if (result.indexOf(word) == -1) {
        result.push(word);
      }
    }
    
    return result;
  }