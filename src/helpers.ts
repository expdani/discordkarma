/**
 * Get the amount of seconds between two dates
 */
export function getAmountOfSecondsBetweenDates(date1: Date, date2: Date) {
    const diff = (date1.getTime() - date2.getTime()) / 1000;
    return Math.abs(diff);
}

/**
 * Function that shuffles the items in an array
 */
export function shuffleArray(array: Array<any>) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
