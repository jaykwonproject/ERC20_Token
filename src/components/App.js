import React, { Component } from 'react'
import Web3 from 'web3'
import NBBL from '../abis/NBBL.json'
import {Button} from "react-bootstrap";
import Main from "./Main";

class App extends Component {

    async componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
    }

    async loadBlockchainData() {
        const web3 = window.web3

        const accounts = await web3.eth.getAccounts()
        this.setState({ account: accounts[0] })

        const networkId = await web3.eth.net.getId()
        console.log(networkId)

        // Load NBBLToken
        const nbblTokenData = NBBL.networks[networkId]
        if(nbblTokenData) {
            const nbblToken = new web3.eth.Contract(NBBL.abi, nbblTokenData.address)
            this.setState({ nbblToken : nbblToken })
            let nbblTokenBalance = await nbblToken.methods.balanceOf(this.state.account).call()
            this.setState({ nbblTokenBalance: nbblTokenBalance.toString() })
        } else {
            window.alert('nbblToken contract not deployed to detected network.')
        }
        this.setState({ loading: false })
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            account: '0x0',
            bottles: 0,
            nbblToken: {},
            nbblTokenBalance: '0',
            loading: true
        }
    }
    insertBottle = (amount) => {
        this.setState({loading: true})
        this.state.nbblToken.methods.insertBottle(amount).call()
        this.setState({loading: false})
    }

    showRestBottles = () => {
        let retVal = this.state.nbblToken.methods.showRestBottles().call()
        this.setState({bottles : retVal})
    }
    render() {
        return (
            <div>
                <h1> account={this.state.account} </h1>
                <h1> nbblTokenBalance={this.state.nbblTokenBalance}</h1>
                <div className="container-fluid mt-5">
                    <div className="row">
                        <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
                            <div className="content mr-auto ml-auto">
                                <form className="mb-3" onSubmit={(event) => {
                                    event.preventDefault()
                                    let amount
                                    amount = this.input.value
                                    let realAmount = parseInt(amount, 10) + 1;
                                    console.log(typeof realAmount)
                                    this.insertBottle(realAmount)
                                    this.showRestBottles()
                                }}>
                                    <div>
                                        <label className="float-left"><b>Insert Bottles</b></label>
                                        <span className="float-right text-muted">

                                        </span>
                                    </div>
                                    <div className="input-group mb-4">
                                        <input
                                            type="text"
                                            ref={(input) => {this.input = input}}
                                            className="form-control form-control-lg"
                                            placeholder="0"
                                            required/>
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-block btn-lg">Insert!</button>
                                </form>
                            </div>
                            <Button classNam="btns" onClick={()=>this.showRestBottles()}>Show Bottles</Button>
                            <b>bottles = {this.state.bottles}</b>
                        </main>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;