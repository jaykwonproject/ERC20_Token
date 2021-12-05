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
            let votingStates = await nbblToken.methods.votingStates().call()
            let winner = await nbblToken.methods.winningProposal().call()

            this.setState({ nbblTokenBalance: nbblTokenBalance.toString() })
            this.setState({ bottles : bottlesNums.toString()})
            this.setState({rank : rank.toString()})
            this.setState({votingState : votingStates.toString()})
            this.setState({winner : winner.toString()})

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
        //this.setState({votingState : "Activate"})
    }
    deactivateVoting = () => {
        this.state.nbblToken.methods.deactivateVoting().send({from: this.state.account}).on('transaction', (hash) => {})
        //this.setState({votingState : "Deactivate"})
    }
    getTokens = (amount) => {
        this.state.nbblToken.methods.transfer(amount).send({from: this.state.account}).on('transaction', (hash) => {})
    }

    vote = (organizationNumber, tokens) => {
        this.state.nbblToken.methods.vote(organizationNumber,tokens).send({from: this.state.account}).on('trasnsaction', (hash) => {})
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
            votingState : "",
            winner: ""
        }
    }
    render() {
        let content
        if(this.state.loading){
            content = <p id="loader" className="text-center">Loading...</p>
        }
        else{
            content = <Main
                //NBBL Variables
                nbblTokkenBalance = {this.state.nbblTokenBalance}
                bottels = {this.state.bottles}
                account ={this.state.account}
                rank = {this.state.rank}
                votingState = {this.state.votingState}

                //NBBL Functions
                insertBottle = {this.insertBottle}
                rankingUp = {this.rankingUp}
                activateVoting = {this.activateVoting}
                deactivateVoting = {this.deactivateVoting}
                getTokens = {this.getTokens}
                vote = {this.vote}
            />
        }
        return (
            <div>
                <h3> Account={this.state.account} </h3>
                <h3> nbblTokenBalance={this.state.nbblTokenBalance}</h3>
                <h3> Bottles = {this.state.bottles}</h3>
                <h3> Rank = {this.state.rank}</h3>
                <h3> Voting State = {this.state.votingState}</h3>

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