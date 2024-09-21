const ethers = require("ethers");

const contracts = {
  MarketGatewayProxy: "0x3b3adf1422f84254b7fbb0e7ca62bd0865133fe3",
  MarketGateway: "0x53a11a02195d284c78b79801056ea893a2e6ea09",
  MarketGatewayMultiSendProxy: "0x21a0a1c081dc2f3e48dc391786f53035f85ce0bc",
};
const tokens = {
  usdc: "0x0b7007c13325c48911f73a2dad5fa5dcbf808adc",
  slp: "0xa8754b9fa15fc18bb59458815510e40a12cd2014",
  wron: "0xe514d9deb7966c8be0ca922de8a064264ea6bcd4",
  axs: "0x97a9107c1793bc407d6f527b77e7fff4d812bece",
  weth: "0xc99a6a985ed2cac1ef41640596c5a5f9f4e19ef5",
};
const treasuryWallets = {
  WildForest: "0x3171cdc3d1c79eaac32c3258daff3d5bb81df6b6",
  Kaidro: "0xd71b90e86161ff525b2bf600713a5a03497ada07",
  Ragmon: "0xcdf878caacf4aac896aa67db8a5e8e1e7621ef8f",
  Lumitera: "0xb090bbe05954a2f3e283afc5a77c0d8bc2c7610c",
  Puff: "0xf0689d5ea922d9e2d77aa661fdacc19ca7200c82",
  Runiverse: "0x604034d192e67ee62bf32c29790b78a24ad43121",
  FightLeague: "0x0d34bf4d875549f3bd079dbcec89dbe654bd9bd4",
  TMA: "0x6a5eb85f3ddc1c493c764fc8b888fdf72423948a",
  Tribesters: "0xbee3626dbce7f6a0becf96ae3a276b08c34b59ee",
};

const helpers = {
  decToHex: (dec) => {
    return "0x" + dec.toString(16);
  },

  hexToDec: (hex) => {
    return Number(ethers.formatEther(hex));
  },

  isContractOrToken: (address) => {
    return (
      Object.values(this.constants.contracts).includes(address) ||
      Object.values(this.constants.tokens).includes(address)
    );
  },

  isContract: (address) => {
    if (!address) {
      return false;
    }
    return Object.values(contracts).includes(address.toLowerCase());
  },

  isMoreThanZero: (value) => {
    const dec = parseInt(value, 16);
    return dec > 0;
  },

  constants: {
    contracts,
    tokens,
    treasuryWallets,
  },
};

module.exports = {
  ...helpers,
};
