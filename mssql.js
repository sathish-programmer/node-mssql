var sql = require("mssql");

// var config = {
//   server: "DESKTOP-67SR9O1",
//   database: "czech",
//   user: "sa",
//   password: "test",
//   port: 1433,
// };
var config = {
  server: ".",
  database: "czech",
  user: "sa",
  password: "test",
};

// const config = {
//   port: 1433,
//   server: "localhost",
//   user: "sa",
//   password: "test",
//   database: process.env.DB_Database,
//   stream: false,
//   options: {
//     trustedConnection: true,
//     encrypt: true,
//     enableArithAbort: true,
//     trustServerCertificate: false,
//   },
// };

sql.connect(config).then((pool) => {
  if (pool.connecting) {
    console.log("Connecting to the database...");
  }
  if (pool.connected) {
    console.log("Connected to SQL Server");
  }
});

// var config = {
//   user: "sa",
//   password: "test",
//   server: "DESKTOP-67SR9O1",
//   database: "czech",
//   port: 1433, // make sure to change port
//   dialect: "mssql",
//   dialectOptions: {
//     instanceName: "SQLEXPRESS",
//   },
// };

// function insertRow() {
//   var dbConn = new sql.ConnectionPool(config);
//   dbConn
//     .connect()
//     .then(function () {
//       var transaction = new sql.Transaction(dbConn);
//       transaction
//         .begin()
//         .then(function () {
//           var request = new sql.Request(transaction);
//           request
//             .query(
//               "Insert into customer_details (AppDate, AppId ,CustomerName ,Day ,DoctorId ,Hours ,Minutes ,MobileNo ,Month ,Second ,Year ,language) values ('2022-06-09 08:30:00',17770317,'Nouf Ibrahim Al Kaabi',9,890,8,30,'0595663388',6,0,2022,0)"
//             )
//             .then(function () {
//               transaction
//                 .commit()
//                 .then(function (recordSet) {
//                   console.log(recordSet);
//                   dbConn.close();
//                 })
//                 .catch(function (err) {
//                   console.log("Error in Transaction Commit " + err);
//                   dbConn.close();
//                 });
//             })
//             .catch(function (err) {
//               console.log("Error in Transaction Begin " + err);
//               dbConn.close();
//             });
//         })
//         .catch(function (err) {
//           console.log(err);
//           dbConn.close();
//         });
//     })
//     .catch(function (err) {
//       console.log(err);
//     });
// }
// //13.
// insertRow();
