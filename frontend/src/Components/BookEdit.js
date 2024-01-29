import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import "./BookEdit.css";
import axios from "axios";
import { PieChart } from "@mui/x-charts/PieChart";

export default function Dashboard() {
  const [students, setStudents] = useState(0);
  const [staff, setStaff] = useState(0);
  const [books, setBooks] = useState(0);
  const [lending, setLending] = useState(0);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      // Fetch counts for students and staff
      const studentsResponse = await axios.get("https://demo-lms.vercel.app/student/getRole/student");
      const staffResponse = await axios.get("https://demo-lms.vercel.app/student/getRole/staff");

      const studentsCount = studentsResponse.data.length;
      const staffCount = staffResponse.data.length;

      setStudents(studentsCount);
      setStaff(staffCount);

      // Fetch counts for books, lending, and remaining
      getBooks();
      getAllot();
      getRemain();
    } catch (error) {
      console.log("API error ---> ", error);
    }
  };

  const getBooks = async () => {
    try {
      const response = await axios.get("https://demo-lms.vercel.app/book/getBook");
      const newData = response.data;
      setBooks(newData?.length);
    } catch (error) {
      console.log("get Books api error ---> ", error);
    }
  };

  const getAllot = async () => {
    try {
      const response = await axios.get("https://demo-lms.vercel.app/allot/getAllot");
      const newData = response.data;
      setLending(newData?.length);
    } catch (error) {
      console.log("allot books api error ---> ", error);
    }
  };

  const getRemain = async () => {
    try {
      const response = await axios.get("https://demo-lms.vercel.app/allot/getAllotNotReturned");
      const newData = response.data;
      setRemaining(newData?.length);
    } catch (error) {
      console.log("allot books api error ---> ", error);
    }
  };

  return (
    <div className="db">
      <div className="numbers">
        <div className="card">
          <div className="title">
            <p>Number of Students</p>
          </div>
          <div className="number">
            <CountUp end={students} duration={2}></CountUp>
          </div>
        </div>
        <div className="card">
          <div className="title">
            <p>Number of Staff</p>
          </div>
          <div className="number">
            <CountUp end={staff} duration={2}></CountUp>
          </div>
        </div>
        <div className="card">
          <div className="title">
            <p>Number of Books</p>
          </div>
          <div className="number">
            <CountUp end={books} duration={2}></CountUp>
          </div>
        </div>
        <div className="card">
          <div className="title">
            <p>Number of Books Lent</p>
          </div>
          <div className="number">
            <CountUp end={lending} duration={2}></CountUp>
          </div>
        </div>
        <div className="card">
          <div className="title">
            <p>Number of Books Pending</p>
          </div>
          <div className="number">
            <CountUp end={remaining} duration={2}></CountUp>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <div className="charts">
          <div className="flex flex-row gap-3 justify-around">
            <div className="chart">
              <PieChart
                series={[
                  {
                    data: [
                      {
                        id: 0,
                        value: remaining,
                        color: "#9656A1",
                      },
                      {
                        id: 1,
                        value: lending - remaining,
                        color: "#efc2f9",
                      },
                      {
                        id: 2,
                        value: lending ,
                        color: "#800080",
                      },
                    ],
                  },
                ]}
                width={400}
                height={400}
                slotProps={{ legend: { hidden: false } }}
                tooltip={{ hidden: true }}
              ></PieChart>
            </div>
          </div>
          <div className="label">
            <div className="flex">
              <div
                className="color"
                style={{ backgroundColor: "#9656A1" }}
              ></div>
              <p>Available Books - ({remaining})</p>
            </div>
            <div className="flex">
              <div
                className="color"
                style={{ backgroundColor: "#efc2f9" }}
              ></div>
              <p>Returned Books - ({lending - remaining})</p>
            </div>
            <div className="flex">
              <div
                className="color"
                style={{ backgroundColor: "#800080" }}
              ></div>
              <p>Lended Books - ({lending})</p>
            </div>
          </div>
        </div>
        <div className="charts">
          <div className="flex flex-row gap-3 justify-around">
            <div className="chart">
              <PieChart
                series={[
                  {
                    data: [
                      {
                        id: 0,
                        value: students,
                        color: "#9656A1",
                      },
                      {
                        id: 1,
                        value: staff,
                        color: "#efc2f9",
                      },
                    ],
                  },
                ]}
                width={400}
                height={400}
                slotProps={{ legend: { hidden: false } }}
                tooltip={{ hidden: true }}
              ></PieChart>
            </div>
          </div>
          <div className="label">
            <div className="flex">
              <div
                className="color"
                style={{ backgroundColor: "#9656A1" }}
              ></div>
              <p>Total Students - ({students})</p>
            </div>
            <div className="flex">
              <div
                className="color"
                style={{ backgroundColor: "#efc2f9" }}
              ></div>
              <p>Total Staff - ({staff})</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
