import React, { Component } from 'react'
import NBBL from '../abis/NBBL.json'
import Web3 from 'web3'
class Main extends Component {

    render() {
        return (
            <div id="content" className="mt-3">

                <table className="table table-borderless text-muted text-center">
                    <thead>
                    <tr>
                        <th scope="col">NBBL Balance</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        {/*<td>{window.web3.utils.fromWei(this.props.nbblTokenBalance, "Ether")} NBBL</td>*/}
                    </tr>
                    </tbody>
                </table>

                <div className="card mb-4" >

                    <div className="card-body">

                        <form className="mb-3" onSubmit={(event) => {
                            event.preventDefault()
                            let amount
                            amount = this.input.value.toString()
                            amount = window.web3.utils.toWei(amount, 'E')
                            this.props.insertBottle(amount)
                        }}>
                            <div>
                                <label className="float-left"><b>Insert Bottles</b></label>
                                <span className="float-right text-muted">
                </span>
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
                    </div>
                </div>
                <h1>bottles={this.props.showRestBottles}</h1>
            </div>
        );
    }
}

export default Main;
