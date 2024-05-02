import React, {useContext,useEffect,useState} from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Dash = () => {
    const [details, setDetails] = useState([]);
  
    useEffect(() => {
      const fetchDetails = async () => {
        try {
          const { data } = await axios.get(
            "http://localhost:7000/api/v1/user/user/me",
            { withCredentials: true }
          );
          setDetails(data.user);
          console.log(data)
        } catch (error) {
            setDetails([]);
            console.log(error)
        }
      };
      fetchDetails();
    }, []);
  
    // const handleUpdateStatus = async (detailsId, status) => {
    //   try {
    //     const { data } = await axios.put(
    //       `http://localhost:8000/api/v1/appointment/update/${detailsId}`,
    //       { status },
    //       { withCredentials: true }
    //     );
    //     setDetails((prevDetails) =>
    //       prevDetails.map((details) =>
    //         details._id === detailsId
    //           ? { ...details, status }
    //           : details
    //       )
    //     );
    //     toast.success(data.message);
    //   } catch (error) {
    //     toast.error(error.response.data.message);
    //   }
    // };
  
    const { isAuthenticated, admin } = useContext(Context);
    if (!isAuthenticated) {
      return <Navigate to={"/login"} />;
    }
    console.log(admin[0])
    console.log(details,"user")
  
    return (
      <>
        <section className="dashboard page">
          <div className="banner">
            <div className="firstBox">
            
              <div className="content">
                <div>
                  <p>Hello ,</p>
                  <h5>
                    {admin &&
                      `${admin[0].firstName} `}{" "}
                  </h5>
                </div>
                <p>
                 Chatbot
                </p>
              </div>
            </div>
            <div className="secondBox">
              <p>Total Users</p>
              <h3>3</h3>
            </div>
            <div className="thirdBox">
              <p>Total Unsafe Queries</p>
              <h3>30</h3>
            </div>
          </div>
          <div className="banner">
            <h5>Users Information</h5>
            <table>
              <thead>
                <tr>
                  <th>FirstName</th>
                  <th>LastName</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {details &&  details.length > 0
                  ? details.map((details) => (
                      <tr key={details._id}>
                        <td>{`${details.firstName}`}</td>
                        <td>{`${details.lastName}`}</td>
                        <td>{details.email}</td>
                        <td>{details.role}</td>
                        
                        <td>
                         
                        </td>
                        
                      </tr>
                    ))
                  : "No Users Found!"}
              </tbody>
            </table>
            {}
          </div>
        </section>
      </>
    );
  };
  
  export default Dash;