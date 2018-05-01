import React, { Component } from 'react';
import logo from './logo.svg';
import web3 from "./utils/web3"
import contract from 'truffle-contract';

import CounterContract from '../build/contracts/Counter.json';

import './App.css';

class App extends Component {
  state = {
    myWallet: undefined,
    web3: undefined,
    instance: undefined,
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

      accounts.map((item, index) => {
        console.warn(`${index} => ${item}`)
        return undefined
      })
    })
  }

  getCounterValue() {
    const { instance } = this.state;
    instance.getCoutner.call().then(counter => {
      this.setState({
        counter: counter.c[0]
      })
    })
  }

  increment = () => {
    const { instance } = this.state;
    instance.increment({ from: this.state.myWallet }).then((result) => {
      console.log(result);
      return result
    }).then((counterTx) => {
      console.log(counterTx)
      return instance.getCoutner.call()
    }).then((counterResult) => {
      const counter = counterResult.c[0]
      this.setState({
        counter: counter
      })
    })
  }

  decrement = () => {
    const { instance } = this.state;
    instance.decrement({ from: this.state.myWallet }).then((result) => {
      console.log(result);
      return result
    }).then((counterTx) => {
      console.log(counterTx)
      return instance.getCoutner.call()
    }).then((counterResult) => {
      const counter = counterResult.c[0]
      this.setState({
        counter: counter
      })
    })
  }

  render() {
    const { counter } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

        <h1>{counter}</h1>
        <button type="button" onClick={this.increment}>+</button>
        <button type="button" onClick={this.decrement}>-</button>
      </div>
    );
  }
}

export default App;
