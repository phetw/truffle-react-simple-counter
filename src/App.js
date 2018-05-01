import React, { Component } from 'react';
import logo from './logo.svg';
import web3 from "./utils/web3"
import contract from 'truffle-contract';

import CounterContract from '../build/contracts/Counter.json';

import './App.css';

class App extends Component {
  state = {
    web3: undefined,
    instance: undefined,
    myWallet: undefined,
    counterSign: '',
    counter: 0
  }

  componentDidMount() {
    web3.then(results => {
      results.web3.eth.defaultAccount = results.web3.eth.accounts[0];
      this.setState({
        web3: results.web3
      })
      this.instantiateContract()
    }).catch(() => {
      console.log("Error finding web3.")
    })
  }

  instantiateContract() {
    const counterContractWrap = contract(CounterContract)
    counterContractWrap.setProvider(this.state.web3.currentProvider)

    // For truffle and web3@1 compatibility issues
    if (typeof counterContractWrap.currentProvider.sendAsync !== "function") {
      counterContractWrap.currentProvider.sendAsync = function () {
        return counterContractWrap.currentProvider.send.apply(
          counterContractWrap.currentProvider, arguments
        );
      };
    }


    this.state.web3.eth.getAccounts((error, accounts) => {
      this.setState({
        myWallet: accounts[0]
      })
      counterContractWrap.deployed().then(instance => {
        console.log(instance)
        this.setState({
          instance: instance
        }, () => {
          this.getCounterValue()
        })
      })

      console.log(`=========================ACCOUNTS=========================`)
      accounts.map((item, index) => {
        console.warn(`${index} => ${item}`)
        return undefined
      })
      console.log(`===========================================================`)

    })
  }

  getCounterValue() {
    const { instance } = this.state;
    instance.getCoutner.call().then(counter => {
      this.setState({
        counterSign: counter.s > 0 ? '' : '-',
        counter: counter.c[0]
      })
    })
  }

  increment = () => {
    const { instance } = this.state;
    instance.increment({ from: this.state.myWallet }).then((result) => {
      return result
    }).then((counterTx) => {
      return instance.getCoutner.call()
    }).then((counterResult) => {
      const counter = counterResult.c[0]
      const counterSign = counterResult.s > 0 ? '' : '-'
      this.setState({
        counterSign: counterSign,
        counter: counter
      })
    })
  }

  decrement = () => {
    const { instance } = this.state;
    instance.decrement({ from: this.state.myWallet }).then((result) => {
      return result
    }).then((counterTx) => {
      return instance.getCoutner.call()
    }).then((counterResult) => {
      const counter = counterResult.c[0]
      const counterSign = counterResult.s > 0 ? '' : '-'
      this.setState({
        counterSign: counterSign,
        counter: counter
      })
    })
  }

  render() {
    const { counter, counterSign } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

        <h1>{counter === 0 ? <div /> : counterSign}{counter}</h1>
        <button type="button" onClick={this.increment}>+</button>
        <button type="button" onClick={this.decrement}>-</button>
      </div>
    );
  }
}

export default App;
