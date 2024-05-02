import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { IoTimer } from "react-icons/io5";
import { PieChart } from '@mui/x-charts/PieChart';

const Dash = () => {
  const [details, setDetails] = useState([]);
  const [unsafeQueriesCount, setUnsafeQueriesCount] = useState(0);
  const [queries, setQueries] = useState(0);
  const [timedOutUsersCount, setTimedOutUsersCount] = useState(0);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:7000/api/v1/user/user/me",
          { withCredentials: true }
        );
        setDetails(data.user);
        calculateUnsafeQueries(data.user); //Calculate unsafe queries
        calculateTotalQueries(data.user); //Calculate total queries
        countTimedOutUsers(data.user); //Count timed out users
      } catch (error) {
        setDetails([]);
        console.log(error);
      }
    };
    fetchDetails();
  }, []);

  const { isAuthenticated, admin } = useContext(Context);
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  //Calculate total Queries
  const calculateTotalQueries = (users) => {
    let count = 0;
    users.forEach((user) => {
      count += user.chats.length;
    });
    setQueries(count);
  };

  //Calculate unsafe Queries
  const calculateUnsafeQueries = (users) => {
    let count = 0;
    users.forEach((user) => {
      user.chats.forEach((chat) => {
        if (chat.unsafeQueries > 30) {
          count++;
        }
      });
    });
    setUnsafeQueriesCount(count);
  };
  
  //Apply Timeout
  // Apply Timeout
const handleTimeout = async (id) => {
  try {
    const res = await axios.post(
      "http://localhost:7000/api/v1/user/admin/apply-timeout",
      { id },
      { withCredentials: true }
    );
    console.log(res);
    toast.success(res.data.message);
    // Update the user details to reflect the timeout
    const updatedDetails = details.map((detail) =>
      detail._id === id
        ? { ...detail, timedOut: !detail.timedOut } // Toggle the timedOut property
        : detail
    );
    setDetails(updatedDetails);
    // Update the count of timed out users
    const count = updatedDetails.filter((user) => user.timedOut).length;
    setTimedOutUsersCount(count);
  } catch (error) {
    toast.error("Error applying timeout");
  }
};


  //Calculate users who have been timed out
  const countTimedOutUsers = (users) => {
    const count = users.filter((user) => user.timedOut).length;
    setTimedOutUsersCount(count);
  };

  const totalUsers = details.length;
  const adminCount = details.filter((user) => user.role === "Admin").length;
  const userCount = totalUsers - adminCount;

  return (
    <>
      <section className="dashboard page">
        <div className="banner">
          <div className="firstBox">
            <div className="content">
              <div>
                <p>Hello,</p>
                <h5>{admin && `${admin[0].firstName} `}</h5>
              </div>
              <p>Admin</p>
            </div>
          </div>
          <div className="secondBox">
            <p>Users</p>
            <h3>{details.filter((user) => 
              user.role !== "Admin").length}</h3>
          </div>
          <div className="secondBox wildBox">
            <p>Queries</p>
            <h3>{queries}</h3>
          </div>
          <div className="thirdBox">
            <p>Unsafe Queries</p>
            <h3>{unsafeQueriesCount}</h3>
          </div>
        </div>
        <div className="analytic">
          <div className="analytic-content">
            <div className="analyticBox">
              <div className="analyticBox_name">
                <h4> Users Activity</h4>
              </div>
              <div className="figure">
                <PieChart
                  series={[
                    {
                      data: [
                        { id: 0, value: `${timedOutUsersCount}`, label: 'Timed' },
                        { id: 1, value: `${userCount-timedOutUsersCount}` , label: 'Active' },
                      ],
                    },
                  ]}
                  width={400}
                  height={200}
                />
              </div>
            </div>

            {/* <div className="analyticBox">
              <h5>Queries</h5>
              <h3>{queries}</h3>
            </div> */}

          </div>
        </div>
        <div className="table">
          <h5>Users Information</h5>
          <table>
            <thead>
              <tr>
                <th>FirstName</th>
                {/* <th>LastName</th> */}
                <th>Role</th>
                <th>Email</th>
                <th>Unsafe Queries Count</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {details &&
                details.length > 0 &&
                details.map((detail) => (
                  // Filter user information if the role is not admin
                  detail.role !== "Admin" && (
                    <tr key={detail._id}>
                      <td>{detail.firstName}</td>
                      {/* <td>{detail.lastName}</td> */}
                      <td>{detail.role}</td>
                      <td>{detail.email}</td>
                      <td>
                        {detail.chats.filter(
                          (chat) => chat.unsafeQueries > 30
                        ).length}
                      </td>
                      <td>
                        <button
                            onClick={() => handleTimeout(detail._id)}
                            disabled={
                              detail.chats.filter(
                                (chat) => chat.unsafeQueries > 30
                              ).length < 5 // Disable the button if unsafe queries count is less than 10
                            }
                            style={{border: "none", background: "none", cursor: "pointer", fontSize: "1.5rem" , outline: "none" }}
                          >
                          <IoTimer />
                        </button>
                      </td>
                    </tr>
                  )
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default Dash;
