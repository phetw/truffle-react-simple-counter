module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      gas: 6712390,
      network_id: "5777"
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};