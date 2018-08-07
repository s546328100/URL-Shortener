const options = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function cumulative(current) {
    let arr = current.split('');
    let len = arr.length - 1;
    return add(arr, len).join('');
}

function add(arr, len) {
    let one = options.charAt(0);

    if (len < 0) return arr.push(one);

    let last = arr[len];

    let index = options.indexOf(last);

    if (index === options.length - 1) {
        arr[len] = one;

        add(arr, len - 1);
    } else {
        arr[len] = options.charAt(++index);
    }

    return arr;
}

module.exports = cumulative;