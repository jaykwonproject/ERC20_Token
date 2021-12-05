import React, { Component } from 'react'
import Web3 from 'web3'
import NBBL from '../abis/NBBL.json'
import Main from './Main'

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

        // Load NBBLToken
        const nbblTokenData = NBBL.networks[networkId]
        if(nbblTokenData) {
            const nbblToken = new web3.eth.Contract(NBBL.abi, nbblTokenData.address)
            this.setState({ nbblToken })

            let nbblTokenBalance = await nbblToken.methods.balanceOf(this.state.account).call()
            let bottlesNums = await nbblToken.methods.bottleNums(this.state.account).call()
            let rank = await nbblToken.methods.ranking(this.state.account).call()


            this.setState({ nbblTokenBalance: nbblTokenBalance.toString() })
            this.setState({ bottles : bottlesNums.toString()})
            this.setState({rank : rank.toString()})

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
    insertBottle = (amount) => {
        this.state.nbblToken.methods.insertBottle(amount).send({from: this.state.account}).on('transaction', (hash) => {})
    }
    rankingUp = (num) => {
        this.state.nbblToken.methods.rankingUp(num).send({from: this.state.account}).on('trasnsaction', (hash) => {})
    }
    activateVoting = () => {
        this.state.nbblToken.methods.activateVoting().send({from: this.state.account}).on('transaction', (hash) => {})
        this.setState({votingState : "Activate"})
    }
    deactivateVoting = () => {

        this.state.nbblToken.methods.deactivateVoting().send({from: this.state.account}).on('transaction', (hash) => {})
        this.setState({votingState : "Deactivate"})
    }

    constructor(props) {
        super(props)
        this.state = {
            account: '0x0',
            bottles: 0,
            nbblToken: {},
            nbblTokenBalance: '0',
            rank: 0,
            loading: true,
            votingState : "Deactivated"
        }
    }
    render() {
        let content
        if(this.state.loading){
            content = <p id="loader" className="text-center">Loading...</p>
        }
        else{
            content = <Main
                nbblTokkenBalance = {this.state.nbblTokenBalance}
                bottels = {this.state.bottles}
                account ={this.state.account}
                rank = {this.state.rank}
                votingState = {this.state.votingState}

                insertBottle = {this.insertBottle}
                rankingUp = {this.rankingUp}
                activateVoting = {this.activateVoting}
                deactivateVoting = {this.deactivateVoting}
            />
        }
        return (
            <div>
                <h1> Account={this.state.account} </h1>
                <h1> nbblTokenBalance={this.state.nbblTokenBalance}</h1>
                <h1> Bottels = {this.state.bottles}</h1>
                <h1> Rank = {this.state.rank}</h1>
                <h1> Voting State = {this.state.votingState}</h1>

                <div className="container-fluid mt-5">
                    <div className="row">
                        <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
                            <div className="content mr-auto ml-auto">
                                {content}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;