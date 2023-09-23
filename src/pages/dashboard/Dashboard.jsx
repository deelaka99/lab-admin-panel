import React, { useEffect, useState } from "react";
import Card from "../../components/dashboardCard/Card";
import Card1 from "../../components/dashboardCard/Card1";
import Charts from "../../components/charts/Charts";
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { db } from "../../firebase";
import { ref, onValue } from "firebase/database";

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [registeredUserCount, setRegisteredUserCount] = useState(0);
  const [blockedUserCount, setBlockedUserCount] = useState(0);
  const [activeUserCount, setActiveUserCount] = useState(0);

  useEffect(() => {
    // Fetch registered users count
    const userRef = ref(db, "users/");
    onValue(userRef, (snapshot) => {
      try {
        setLoading(true);
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const userCount = Object.keys(usersData).length;
          setRegisteredUserCount(userCount);

          // Calculate the count of blocked users
          const blockedUserCount = Object.values(usersData).filter(
            (user) => user.blocked
          ).length;
          setBlockedUserCount(blockedUserCount);

          // Calculate the count of active users
          const activeUserCount = Object.values(usersData).filter(
            (user) => !user.blocked
          ).length;
          setActiveUserCount(activeUserCount);
        }
      } catch (error) {
        console.log("Error in User fetching: ", error);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  return (
    <>
      <div className="p-5 h-full w-full">
        <div className="p-2 w-full h-1/2">
          <div className="h-full w-full rounded-md shadow-md border-2 border-white dark:border-dark-ternary dark:shadow-dark-primary">
            <div className="flex justify-center items-center w-full h-1/6 p-2 border-b-2 border-white dark:border-dark-ternary">
              <h1 className="font-inter font-semibold text-primary-blue">
                Report details
              </h1>
            </div>
            <div className="flex justify-center items-center w-full h-5/6 p-5">
              <Card color={"blue"} title={"Report Types"} count={"18"} />
              <p>&nbsp;&nbsp;&nbsp;</p>
              <Card color={"blue"} title={"Pending Reports"} count={"22"} />
              <p>&nbsp;&nbsp;&nbsp;</p>
              <Card color={"blue"} title={"Total Report Sent"} count={"100"} />
              <p>&nbsp;&nbsp;&nbsp;</p>
              <Card color={"blue"} title={"User Feedbacks"} count={"1800"} />
            </div>
          </div>
        </div>
        <div className="flex p-2 w-full h-1/2">
          <div className="h-full w-3/4 rounded-md shadow-md border-2 border-white dark:border-dark-ternary dark:shadow-dark-primary">
            <div className="flex justify-center items-center w-full h-1/6 p-2 border-b-2 border-white dark:border-dark-ternary">
              <h1 className="font-inter font-semibold text-primary-blue">
                Income of the Week
              </h1>
            </div>
            <div className="flex items-center justify-center w-full h-5/6">
              <Charts />
            </div>
          </div>
          <p>&nbsp;&nbsp;&nbsp;</p>
          <div className="h-full w-1/4 rounded-md shadow-md border-2 border-white dark:border-dark-ternary dark:shadow-dark-primary">
            <div className="flex justify-center items-center w-full h-1/6 p-2 border-b-2 border-white dark:border-dark-ternary">
              <h1 className="font-inter font-semibold text-primary-blue">
                User Management
              </h1>
            </div>
            <div className="flex justify-center items-center w-full h-5/6 p-3">
              <Swiper
                // install Swiper modules
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                spaceBetween={6}
                slidesPerView={2}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                className="flex items-center justify-center h-full"
              >
                <SwiperSlide>
                  <Card1
                    color={"blue"}
                    title={"Registered Users"}
                    count={registeredUserCount}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <Card1
                    color={"blue"}
                    title={"Blocked Users"}
                    count={blockedUserCount}
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <Card1
                    color={"blue"}
                    title={"Active Users"}
                    count={activeUserCount}
                  />
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none text-primary-blue dark:text-white">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-primary-blue dark:border-white"></div>
          </div>
          <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}

export default Dashboard;
