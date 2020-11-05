
const coinotronDenom = (hp, hpDenom, coinsPerDay) => {

    let prof = 0;

    if (hpDenom == "GH") {
        prof = (coinsPerDay / hp) / 1000;
        return prof;
    } else if (hpDenom == "KH") {
        return prof = (coinsPerDay / hp) * 1000;
    } else if (hpDenom == "TH") {
        return prof = (coinsPerDay / hp) / 1000000;
    } else {
        return prof = (coinsPerDay / hp);
    }
}

const coinotronDenomHs = (hp, hpDenom, coinsPerDay) =>{

    let prof = 0;

    if (hpDenom == "KH") {
        prof = (coinsPerDay / hp) / 1000;
        return prof;
    } else if (hpDenom == "MH") {
        return prof = (coinsPerDay / hp) / 1000000;
    } else if (hpDenom == "GH") {
        return prof = (coinsPerDay / hp) / 1000000000;
    } else if (hpDanom = "TH") {
        return prof = (coinsPerDay / hp)/1000000000000;
    }else {
        return prof = (coinsPerDay / hp);
    }
}

const testMethod = () => {
    console.log("test destruction");
}


module.exports = {
    coinotronDenom,
    testMethod,
    coinotronDenomHs
}

