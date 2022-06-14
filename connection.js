var sql = require("mssql/msnodesqlv8");

var config = {
  user: "sa",
  password: "test",
  database: "czech",
  server: "DESKTOP-67SR9O1\\SQLEXPRESS",
  driver: "msnodesqlv8",
  options: {
    trustedConnection: true,
  },
};

sql.connect(config, async function (err) {
  if (err) {
    console.log("error", err);
  }
  var request = new sql.Request();
  request.query(
    "Insert into customer_details (AppDate, AppId ,CustomerName ,Day ,DoctorId ,Hours ,Minutes ,MobileNo ,Month ,Second ,Year ,language) values ('2022-06-09 08:30:00',17770317,'Nouf Ibrahim Al Kaabi',9,890,8,30,'0595663388',6,0,2022,0)",
    function (err, res) {
      if (err) {
        console.log(err);
      }
      console.log(res);
    }
  );
});
