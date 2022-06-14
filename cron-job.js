var CronJob = require("cron").CronJob;
const axios = require("axios");
var sql = require("mssql/msnodesqlv8");
const fs = require("fs");
const schedule = require("node-schedule");
const fastcsv = require("fast-csv");

let token = process.env.TOKEN;

let filename = process.env.FILENAME + ".csv";

const ROOT_PATH = process.env.ROOT_PATH;

const DIR = process.env.DIRECTORY_NAME;

var config = {
  user: process.env.CONFIG_USERNAME,
  password: process.env.CONFIG_PASSWORD,
  database: process.env.CONFIG_DB,
  server: process.env.CONFIG_SERVER,
  driver: "msnodesqlv8",
  options: {
    trustedConnection: true,
  },
};

let callAPIForGetDetails = async () => {
  await axios
    .get(process.env.GET_API, {
      headers: {
        token: token, //the token is a variable which holds the token
      },
    })
    .then((response) => {
      let status = response.data.Status.Code;
      var csvData = [];
      if (status == 200) {
        let result = response.data["Body"]["data"];
        sql.connect(config, async function (err) {
          if (err) {
            console.log("error", err);
          }
          var request = new sql.Request();

          if (result && result.length) {
            result.forEach((element) => {
              let appData = element["AppDate"];
              let appId = element["AppId"];
              let CustomerName = element["CustomerName"];
              let Day = element["Day"];
              let DoctorId = element["DoctorId"];
              let Hours = element["Hours"];
              let Minutes = element["Minutes"];
              let MobileNo = element["MobileNo"];
              let Month = element["Month"];
              let Second = element["Second"];
              let Year = element["Year"];
              let language = element["language"];

              let app_date = Month + "/" + Day + "/" + Year;
              var days = [
                "SUNDAY",
                "MONDAY",
                "TUESDAY",
                "WEDNESDAY",
                "THURSDAY",
                "FRIDAY",
                "SATURDAY",
              ];
              // let date_new = new Date(app_date);
              let day_new = days[new Date(app_date).getDay()];
              var suffixShift = Hours >= 12 ? "PM" : "AM";

              csvData.push({
                DestinationNumber: MobileNo,
                Dialer: "AppointmentConfirmation",
                Priority: "1",
                StartTime: "09:00:00",
                StartDate: "01/06/2022",
                StopTime: "23:59:59",
                StopDate: "01/06/2023",
                DoctorID: DoctorId,
                AppointmentDay: day_new,
                AppointmentDate: Day,
                AppointmentMonth: Month,
                AppointmentYear: Year,
                AppointHour: Hours,
                AppointmentMinutes: Minutes,
                AppointmentShift: suffixShift,
                AppointmentBranch: "CZECH",
                AppointID: appId,
              });

              request.query(
                "Insert into AppointmentDetails (AppDate, AppId ,CustomerName ,Day ,DoctorId ,Hours ,Minutes ,MobileNo ,Month ,Second ,Year ,Language) values ('" +
                  appData +
                  "','" +
                  appId +
                  "','" +
                  CustomerName +
                  "','" +
                  Day +
                  "','" +
                  DoctorId +
                  "','" +
                  Hours +
                  "','" +
                  Minutes +
                  "','" +
                  MobileNo +
                  "','" +
                  Month +
                  "','" +
                  Second +
                  "','" +
                  Year +
                  "','" +
                  language +
                  "')",
                (err, res) => {
                  if (err) {
                    console.log(err);
                  }
                  // console.log(res);
                }
              );
            });
          }
          // make upload folder if not exist
          fs.mkdir(ROOT_PATH + "/" + DIR, (error) => {
            if (error) {
              console.log("Folder exists already.");
            } else {
              console.log("New folder has been created.");
            }
          });

          // delete file named 'autoimport.csv' if already exits
          try {
            console.log("File exists. Deleting now ...");
            fs.unlinkSync(ROOT_PATH + "/" + DIR + "/" + filename);
          } catch (e) {
            console.log("File not found, so not deleting.");
          }

          // csv append and export
          let ws = fs.createWriteStream(ROOT_PATH + "/" + DIR + "/" + filename);
          ws.on("finish", function () {
            console.log("File CSV genarated successfully..! 😁😎");
          });
          fastcsv.write(csvData, { headers: false }).pipe(ws);
        });
      }
    })
    .catch((error) => console.log(error));
};

let postStatus = async () => {
  const data = {
    AppId: 17769035,
    status: 1,
  };

  sql.connect(config, async function (err) {
    if (err) {
      console.log("error", err);
    }
    var request = new sql.Request();

    request.query(
      "select AppId, Status as status  from AppointmentDetails where Status = 1 and IsUsed = 0",
      (err, res) => {
        if (err) {
          console.log(err);
        }
        let selectResult = res.recordset;
        if (selectResult && selectResult.length) {
          selectResult.forEach((data) => {
            // console.log(data);
            let updateData = data;
            // call update status api....
            updateStatusCallApi(updateData);
          });
        }
      }
    );
  });
};

let updateStatusCallApi = (data) => {
  axios
    .post(process.env.POST_API, data, {
      headers: {
        token: token, //the token is a variable which holds the token
      },
    })
    .then((res) => {
      if (res.status == 200) {
        console.log("Status updated successfully");
        var request = new sql.Request();

        request.query(
          `update AppointmentDetails set IsUsed = 1 where AppId=${data.AppId}`,
          (err, res) => {
            if (err) {
              console.log(err);
            }
          }
        );
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

// -------------------------- CRON JOB ------------------------------
// job for every day 5pm
const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(0, 6)];
rule.hour = process.env.SET_APP_DETAILS_TIME_HOUR;
rule.minute = process.env.SET_APP_DETAILS_TIME_MINUTE;

const getAppointmentDetails = schedule.scheduleJob(rule, function () {
  console.log(
    "Get details, Job runs every day at " +
      process.env.SET_APP_DETAILS_TIME_HOUR +
      ":" +
      process.env.SET_APP_DETAILS_TIME_MINUTE
  );
  callAPIForGetDetails();
});

// job for every 2min
var updateStatusJob = new CronJob(
  "*/" + process.env.UPDATE_STATUS_TIME_MINUTE + " * * * *",
  async function () {
    console.log(
      "Update status, Job running every " +
        process.env.UPDATE_STATUS_TIME_MINUTE +
        " min"
    );
    postStatus();
  }
);
updateStatusJob.start();
