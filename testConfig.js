miningPools = [
    {
        'Coin': 'ETH', 
        'Pools': [
            { 
                'Name': 'What to mine_ETH',
                'Profitabilit': 0.000085, 
                'time': '26:56'
            }, 
            {
                'Name': 'Coinotron_ETH',
                'Profitabilit': 0.000084, 
                'time': '26:56'   
            }, 
            {
                'Name': 'ETHPool',
                'Profitabilit': 0.000083, 
                'time': '26:56'
            }
        ]
    },

    {
        'Coin': 'ETC',
        'Pools':[
            {
                'Name': 'What to mine_ETC',
                'Profitabilit': 0.000085, 
                'time': '26:56'
            },
            {
                'Name': 'Coinotron_ETC',
                'Profitabilit': 0.000085, 
                'time': '26:56'
            },
            {
                'Name': 'What to mine_ETC',
                'Profitabilit': 0.000085, 
                'time': '26:56'
            }
        ]
    }
]



/* miningPools[0]['Pools'].map(element => {
    console.log(element['Profitabilit']);
}); */




let btc = {
    'Coin': 'BTC',
    'Pools':[
        {
            'Name': 'What to mine_BTC',
            'Profitabilit': 0.0000084, 
            'time': '26:56'
        },
        {
            'Name': 'Coinotron_BTC',
            'Profitabilit': 0.0000083, 
            'time': '26:56'
        },
        {
            'Name': 'What to mine_BTC',
            'Profitabilit': 0.0000085, 
            'time': '26:56'
        }
    ]
}

miningPools.push(btc);


console.log(miningPools.map(element => {

    if(element['Coin'] == 'ETC') {
        console.log('ETC mining')
        console.log(element)
    }
    if(element['Coin'] == 'ETH') {
        console.log('ETH mining')
        console.log(element)
    }
    if(element['Coin'] == 'BTC') {
        console.log('BTC mining')
        console.log(element)
    }
}))