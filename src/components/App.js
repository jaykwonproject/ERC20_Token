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
            let totalVoting = await nbblToken.methods.totalVotes().call()

            this.setState({ nbblTokenBalance: nbblTokenBalance.toString() })
            this.setState({ bottles : bottlesNums.toString()})
            this.setState({rank : rank.toString()})
            this.setState({votingState : votingStates.toString()})
            this.setState({winner : winner.toString()})
            this.setState({totalVote: totalVoting.toString()})


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

    }
    deactivateVoting = () => {
        this.state.nbblToken.methods.deactivateVoting().send({from: this.state.account}).on('transaction', (hash) => {})

    }
    getTokens = (amount) => {
        this.state.nbblToken.methods.transfer(amount).send({from: this.state.account}).on('transaction', (hash) => {})
    }

    vote = (organizationNumber, tokens) => {
        this.state.nbblToken.methods.vote(organizationNumber,tokens).send({from: this.state.account}).on('trasnsaction', (hash) => {})
    }

    reqWinner = () => {
        this.state.nbblToken.methods.reqWinner().send({from: this.state.account}).on('trasnsaction', (hash) => {})
    }
    sendToNop = () => {
        this.state.nbblToken.methods.sendToNOP().send({from: this.state.account}).on('trasnsaction', (hash) => {})
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
            winner: "",
            totalVote: 0,
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
                totalVoting={this.totalVoting}

                //NBBL Functions
                insertBottle = {this.insertBottle}
                rankingUp = {this.rankingUp}
                activateVoting = {this.activateVoting}
                deactivateVoting = {this.deactivateVoting}
                getTokens = {this.getTokens}
                vote = {this.vote}
                reqWinner={this.reqWinner}
                sendToNop={this.sendToNop}
            />
        }
        let votingState = ""
        if(this.state.votingState == 1){
            votingState = "Deactivated"
        }
        else{
            votingState = "Activated"
        }
        return (
            <div>
                <h4> Account={this.state.account} </h4>
                <h4> nbblTokenBalance={this.state.nbblTokenBalance}</h4>
                <h4> Bottles = {this.state.bottles}</h4>
                <h4> Rank = {this.state.rank}</h4>
                <h4> Voting State = {votingState}</h4>
                <h4> TotalVotes = {this.state.totalVote}</h4>
                <h4> Winner = {this.state.winner}</h4>
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