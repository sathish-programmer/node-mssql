const fastcsv = require("fast-csv");
const fs = require("fs");
const ws = fs.createWriteStream("out.csv");

const data = [
  {
    AppDate: "2022-06-13 11:45:00",
    AppId: 17773187,
    CustomerName: "Nada Mohammed Al-Dowayan",
    Day: 13,
    DoctorId: 1269,
    Hours: 11,
    Minutes: 45,
    MobileNo: "0505256147",
    Month: 6,
    Second: 0,
    Year: 2022,
    language: 0,
  },
  {
    AppDate: "2022-06-13 11:45:00",
    AppId: 17778532,
    CustomerName: "Abdulaziz Abdulkarim AL Mansour",
    Day: 13,
    DoctorId: 947,
    Hours: 11,
    Minutes: 45,
    MobileNo: "0506407356",
    Month: 6,
    Second: 0,
    Year: 2022,
    language: 0,
  },
  {
    AppDate: "2022-06-13 01:25:00",
    AppId: 17772281,
    CustomerName: "Hamad Nasser AL Madi",
    Day: 13,
    DoctorId: 849,
    Hours: 13,
    Minutes: 25,
    MobileNo: "0540232284",
    Month: 6,
    Second: 0,
    Year: 2022,
    language: 0,
  },
];

fastcsv
  .write(data, { headers: false })
  .then(() => console.log("The CSV file was written successfully.. 😁😎"))
  .pipe(ws);
