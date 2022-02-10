import React from "react";
import ReactDOM from "react-dom";
import ReactApexChart from "react-apexcharts";
import { parse } from "papaparse";
import spy_history from "./HistoricalData_1644452737372.csv";

class Contents extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          id: "chart-1",
        },
        title: {
          text: "OwO",
          align: "center",
          style: {
            fontSize: "30px",
            fontWeight: "bold",
          },
        },
      },
      xaxis: {
        categories: [],
      },
      series: [
        {
          name: "1x",
          data: [],
        },
      ],
    };
  }

  async componentDidMount() {
    var spy = await (await fetch(spy_history)).text();
    this.updateChart(spy);
  }

  async updateChart(csvString) {
    var csv = parse(csvString, {
      header: true,
      skipEmptyLines: true,
    }).data;

    var dates = [];
    var x1 = [];
    var x2 = [];
    var x3 = [];

    var prev;
    for (var i = csv.length - 1; i >= 0; i--) {
      let data = csv[i];
      dates.push(data["Date"]);
      let close = parseFloat(data["Close/Last"]);
      if (x1.length === 0) {
        x1.push(10000.0);
        x2.push(10000.0);
        x3.push(10000.0);
      } else {
        let rate = (close - prev) / close;
        x1.push(x1[x1.length - 1] * (1 + rate));
        x2.push(x2[x2.length - 1] * (1 + 2 * rate));
        x3.push(x3[x3.length - 1] * (1 + 3 * rate));
      }
      prev = close;
    }

    // console.log(dates);
    // console.log(x1);
    // console.log(x2);
    // console.log(x3);

    this.setState({
      options: {
        xaxis: {
          categories: dates,
        },
      },
      series: [
        {
          name: "1x",
          data: x1,
        },
        {
          name: "2x",
          data: x2,
        },
        {
          name: "3x",
          data: x3,
        },
      ],
    });
  }

  async handleFile(e) {
    console.log(e);
    e.preventDefault();
    var reader = new FileReader();
    reader.onload = () => this.updateChart(reader.result);
    reader.readAsText(e.target.files[0]);
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="line"
          height={500}
        />
        <input
          type="file"
          accept=".csv"
          onChange={(e) => this.handleFile(e)}
        ></input>
        <p>This application take in csv file from Nasdaq site</p>
        <h6>How to use:</h6>
        <a href="https://github.com/kwang44/Leveraged-Simulator">Source Code</a>
      </div>
    );
  }
}

export default Contents;
