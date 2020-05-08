let map = new Map(); //url-> {span, min, max, count, total}

exports.record = function (url, span) {

    url = url.split("?")[0];
    let item = map.get(url);
    if (!item) {
        item = {
            min: span,
            max: span,
            count: 1,
            total: span,
        };
        map.set(url, item);
    } else {
        item.total += span;
        item.count += 1;
        if (item.min > span) {
            item.min = span;
        } else if (item.max < span) {
            item.max = span;
        }
    }
};

exports.get = function () {

    let data = {};

    map.forEach(function (value, key) {
        data[key] = value;
    });

    return data;
};
