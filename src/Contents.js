import React from "react";
import ReactDOM from "react-dom";
import ReactApexChart from "react-apexcharts";
import { parse } from "papaparse";
import spy_history from "./HistoricalData_1644452737372.csv";
import example_csv from "./example.csv";

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
        xaxis: {
          categories: [],
        },
        yaxis: {
          labels: {
            formatter: (val, index) => val.toFixed(2),
          },
        },
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
      transformHeader: (h) => h.trim(),
    }).data;

    var dates = [];
    var x1 = [];
    var x2 = [];
    var x3 = [];

    var prev;
    for (var i = csv.length - 1; i >= 0; i--) {
      let data = csv[i];
      dates.push(data["Date"].trim());
      let close = parseFloat(data["Close/Last"].replace(/[^0-9\.]/g, ""));
      if (x1.length === 0) {
        x1.push(10000.0);
        x2.push(10000.0);
        x3.push(10000.0);
      } else {
        let rate = (close - prev) / close;
        x1.push(x1[x1.length - 1] * (1 + rate));
        x2.push(x2[x2.length - 1] * (1 + 2 * rate));
        x3.push(x3[x3.length - 1] * (1 + 3 * rate).toFixed(50));
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
        <h2>How to use:</h2>
        <ol>
          <li>
            Find the ETF/Stock historical data on the Nasdaq website. Ex:{" "}
            <a
              href="https://www.nasdaq.com/market-activity/funds-and-etfs/dgro/historical"
              target="_blank"
            >
              DGRO
            </a>{" "}
            <a
              href="https://www.nasdaq.com/market-activity/funds-and-etfs/schd/historical"
              target="_blank"
            >
              SCHD
            </a>{" "}
            <a
              href="https://www.nasdaq.com/market-activity/funds-and-etfs/jepi/historical"
              target="_blank"
            >
              JEPI
            </a>
          </li>
          <li>
            Select the timespan you want: <b>1M 6M YTD 1Y 5Y MAX</b>
          </li>
          <li>
            Click <b>DOWNLOAD DATA</b>
          </li>
          <li>Upload the csv file using the button above</li>
        </ol>
        <p>Notes:</p>
        <ul>
          <li>Line start at 10000</li>
          <li>This doesn't account for dividends.</li>
          <li>This doesn't account for fees</li>
          <li>This may not be accurate</li>
          <li>
            You can make your own csv. As long as it has <b>Date</b> and{" "}
            <b>Close/Last</b> columns, this should work. Ex:{" "}
            <a href={example_csv} download="example.csv">
              csv
            </a>
          </li>
          <li>
            Because the order of Nasdaq's csv is ordered from latest to oldest,
            this application read the csv from bottom up.
          </li>
          <li>Large file can cause this to become slow.</li>
        </ul>
        <a href="https://github.com/kwang44/Leveraged-Simulator">Source Code</a>
      </div>
    );
  }
}

export default Contents;
