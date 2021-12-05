import React, { Component } from 'react'

class Main extends Component {

    render() {
        return (
            <div id="content" className="mt-3">
                    <div className="card-body">
                        <form className="mb-3" onSubmit={(event) => {
                            event.preventDefault()
                            let amount = this.input.value.toString()
                            // amount = window.web3.utils.toWei(amount, 'Ether')
                            amount = parseInt(amount, 10)
                            this.props.insertBottle(amount)
                        }}>
                            <div>
                                <label className="float-left"><b>Insert Bottles</b></label>
                            </div>
                            <div className="input-group mb-4">
                                <input
                                    type="text"
                                    ref={(input) => { this.input = input }}
                                    className="form-control form-control-lg"
                                    placeholder="0"
                                    required />
                            </div>
                            <button type="submit" className="btn btn-primary btn-block btn-lg">Insert!</button>
                        </form>

                        <form className="mb-3" onSubmit={(event) => {
                            event.preventDefault()
                            let num = this.input2.value.toString()
                            num = parseInt(num, 10)
                            this.props.rankingUp(num)
                        }}>
                            <div>
                                <label className="float-left"><b>Rank Up</b></label>
                            </div>
                            <div className="input-group mb-4">
                                <input
                                    type="text"
                                    ref={(input) => { this.input2 = input }}
                                    className="form-control form-control-lg"
                                    placeholder="0"
                                    required />
                            </div>
                            <button type="submit" className="btn btn-primary btn-block btn-lg">Rank Up !</button>

                            <br/>
                            <br/>

                            <button
                                type="submit"
                                className="btn btn-link btn-block btn-sm"
                                onClick={(event) => {
                                    event.preventDefault()
                                    this.props.activateVoting()
                                }}>
                                Activate Voting!
                            </button>

                            <button
                                type="submit"
                                className="btn btn-link btn-block btn-sm"
                                onClick={(event) => {
                                    event.preventDefault()
                                    this.props.deactivateVoting()
                                }}>
                                Deactivate Voting!
                            </button>
                        </form>
                    </div>
            </div>
        );
    }
}

export default Main;
