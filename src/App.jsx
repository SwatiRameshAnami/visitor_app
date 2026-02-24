import { useState, useCallback } from "react";
import AdvertisementPage from "./pages/AdvertisementPage";
import VisitorHomePage from "./pages/VisitorHomePage";
import VisitorFormPage from "./pages/VisitorFormPage";
import WaitingListPage from "./pages/WaitingListPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("advertisement");
  const [visitors, setVisitors] = useState([]);

  const navigate = useCallback((page) => setCurrentPage(page), []);

  const addVisitor = useCallback((visitor) => {
    const newVisitor = {
      ...visitor,
      id: Date.now(),
      checkInTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      checkInDate: new Date().toLocaleDateString("en-IN"),
      status: "waiting",
    };
    setVisitors((prev) => [...prev, newVisitor]);
  }, []);

  const removeVisitor = useCallback((id) => {
    setVisitors((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, status: "exited", exitTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }
          : v
      ).filter((v) => v.status !== "exited")
    );
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-navy-900">
      {currentPage === "advertisement" && (
        <AdvertisementPage onTouch={() => navigate("home")} />
      )}
      {currentPage === "home" && (
        <VisitorHomePage
          onCheckIn={() => navigate("form")}
          onWaitingList={() => navigate("waiting")}
          waitingCount={visitors.length}
          onIdle={() => navigate("advertisement")}
        />
      )}
      {currentPage === "form" && (
        <VisitorFormPage
          onSubmit={(data) => {
            addVisitor(data);
            navigate("home");
          }}
          onBack={() => navigate("home")}
        />
      )}
      {currentPage === "waiting" && (
        <WaitingListPage
          visitors={visitors}
          onExit={removeVisitor}
          onBack={() => navigate("home")}
        />
      )}
    </div>
  );
}
