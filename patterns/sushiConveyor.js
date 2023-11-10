module.exports = async (string) => {

  const splitEmojis = (sushi) => [...new Intl.Segmenter().segment(sushi)].map(x => x.segment);
  const sushi = splitEmojis("🍤🍣🍣🍣🍣🍣🍣🍣🍣🍣🍣🍣🍣🍣🍣🍣🍣🍣🍣🍣🍣🍣🍣🍵☕🍕🍚🍉🍞🍺🐀🥩🥗🐟🐡🐟🐡🐟🐡🐟🐡🍠🥟🥠🥡🦪🍛🍚🍙🍘🍔🍟🌭🍿🥓🥨🥯🥚🍛🥘🍲🍝🥣🍨🥧🥮🍯🧃🍹🍌🍑🍒🍓🌽🍆🍄🌶🥕🌰")
  const randomIndex = Math.floor(Math.random() * sushi.length);

  let newString = await string.concat(sushi[randomIndex]);

  newString = newString.substring(1);

  console.log (string);
  console.log (newString);
  //console.log (sushiArray);

  return newString;

};