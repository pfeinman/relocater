import React, { Component } from 'react';
import LineGraph from './LineGraph';
import InfoContainer from './InfoContainer';
import './GraphContainer.css';

class GraphContainer extends Component {
    state = {
        socrataData: [],
        user: {},
        userCountyData: {}
    }

    componentDidMount = () => {
        this.getSocrataData();
        this.getUserCountyData();
        this.setState({
            user: this.props.user
        })
    }

    getSocrataData = async () => {
        try {
            const response = await fetch(`/api/socrata/${this.props.match.params.id}`);
            if(!response.ok){
                throw Error(response.statusText)
            }
            const parsedResponse = await response.json();
            const sortedData = parsedResponse.sort((a, b) => a.taxable_year - b.taxable_year);
            this.setState({
                socrataData: sortedData,
                lastEntry: sortedData[sortedData.length - 1]
            })
            this.calculate()
        } catch(err) {
            console.log(err);
            return err
        }
    }
    getUserCountyData = async () => {
        try {
            const res = await fetch(`/api/socrata/${this.props.user.userCounty}`);
            if(!res.ok){
                throw Error(res.statusText)
            }
            const parsedRes = await res.json();
            const lastEntry = parsedRes[parsedRes.length - 1];
            this.setState({
                userCountyData: lastEntry
            })
            this.calculate();
        } catch(err) {
            console.log(err);
            return err;
        }
    }

    calculate = () => {
        const x = this.state.lastEntry && this.props.user.userIncome && this.state.userCountyData ?
            this.state.lastEntry.median_income * (this.props.user.userIncome / this.state.userCountyData.median_income) : 0;
        this.setState({
            magicNumber: x.toFixed(2)
        })
    }

    render = () => {
        return (
            <div className="data">
                <h1>{this.props.match.params.id} Median Income</h1>
                <div className="data__graph">
                    <div className="data__graph--main">
                        {
                            this.state.socrataData.length > 0 && <LineGraph socrataData={this.state.socrataData} />
                        }
                    </div>
                    <div className="data__info">
                        < InfoContainer countyName={this.props.match.params.id} />
                    </div>
                    <div className="data__compare">
                        { this.state.magicNumber > 0?
                            <div>
                                <p id="calculation-blurb">This is how much you would need to make to maintain your same lifestyle in {this.props.match.params.id} county: <span id="magicNumber">${this.state.magicNumber}</span></p>
                            </div>
                        :
                            <div></div>
                        }
                    <br></br>
                    </div>
                </div>
            </div>
        )
    }
}

export default GraphContainer;