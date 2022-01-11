require('@nomiclabs/hardhat-waffle')

module.exports = {
	solidity: '0.8.0',
	networks: {
		ropsten: {
			url: 'https://eth-ropsten.alchemyapi.io/v2/0KCNSRX99W25B5MbOAuiXhcq_cM9N9u7',
			accounts: ['private key'],
		},
	},
}
