
app.filter('customCurrency', ['$filter', function ($filter) {
    var legacyFilter = $filter('currency');
    return function (cost, currency) {
        return legacyFilter(cost * currency.ratio, currency.formatting);
    }
}]);

app.filter('customSize', ['APP', function (APP) {
    return function (inches) {
        if (APP.unit === APP.units.IMPERIAL) {
            var feet = Math.floor(inches / 12);
            inches = inches % 12;
            inches = Math.round(inches * 10) / 10;
            return (feet ? feet + '\' ' : '') + (inches + '\'\'');
        } else {
            var meters = Math.floor(inches * APP.size.ratio);
            var cm = (inches * APP.size.ratio * 100) % 100;
            cm = Math.round(cm * 10) / 10;
            return (meters ? meters + 'm ' : '') + (cm + 'cm');
        }
    };
}]);

app.filter('customWeight', ['APP', function (APP) {
    return function (pounds) {
        if (APP.unit === APP.units.IMPERIAL) {
            if (pounds < 1) {
                var oz = pounds * 16;
                oz = Math.round(oz * 10) / 10;
                return (oz ? oz + 'oz ' : '');
            } else {
                pounds = Math.round(pounds * 100) / 100;
                return (pounds ? pounds + 'lb ' : '');
            }
        } else {
            var kg = Math.floor(pounds * APP.weight.ratio / 1000);
            var grams = (pounds * APP.weight.ratio) % 1000;
            grams = Math.round(grams * 10) / 10;
            return (kg ? kg + 'kg ' : '') + (grams + 'g');
        }
    };
}]);

app.filter('customNumber', ['$filter', function ($filter) {
    var filter = $filter('number');
    return function (value, precision, unit) {
        unit = unit || '';
        return (value ? filter(value, precision) + unit : '-');
    }
}]);

app.filter('customDate', ['$filter', function ($filter) {
    var filter = $filter('date');
    return function (value, format, timezone) {
        return value ? filter(value, format, timezone) : '-';
    }
}]);

app.filter('customTime', ['$filter', function ($filter) {
    return function (value, placeholder) {
        if (value) {
            return Utils.parseTime(value);
        } else {
            return (placeholder ? placeholder : '-');
        }
    }
}]);

app.filter('customDigital', ['$filter', function ($filter) {
    return function (value, placeholder) {
        if (value) {
            return Utils.parseHour(value);
        } else {
            return (placeholder ? placeholder : '-');
        }
    }
}]);

app.filter('customString', ['$filter', function ($filter) {
    return function (value, placeholder) {
        return value ? value : (placeholder ? placeholder : '-');
    }
}]);

app.filter('customEnum', function () {
    return function (val) {
        val = val + 1;
        return val < 10 ? '0' + val : val;
    };
});
