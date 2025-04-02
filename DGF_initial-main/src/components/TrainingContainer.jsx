
import { useContext, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import RequestTable from "./Training/RequestTable"
import TrainingHeaderBtn from "./Training/TrainingHeaderBtn"
import Reminders from "./Training/Reminders"
import AuthContext from "./Auth/AuthContext"

const TrainingContainer = () => {
  const { user } = useContext(AuthContext)
  const [roleId, setRoleId] = useState(null)
  const location = useLocation()
  const [activeTab, setActiveTab] = useState("My Learning Requests")

  useEffect(() => {
    if (user) {
      setRoleId(user.role_id)
    } else {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setRoleId(parsedUser.role_id)
      }
    }
  }, [user])

  useEffect(() => {
    // Set active tab based on current path
    if (location.pathname === "/reminders") {
      setActiveTab("Reminders")
    } else if (location.pathname === "/training-container") {
          setActiveTab("My Learning Requests")
        }
  }, [location.pathname])

  const styles = {
    mainContent: {
      flex: "auto",
      boxSizing: "border-box",
      padding: "3px 48px 0 10px",
      marginright: "0",
      maxWidth: "100%",
      marginBottom: "50px",
    },
  }

  return (
    <div style={styles.mainContent}>
      <TrainingHeaderBtn />
      {roleId && activeTab === "My Learning Requests" && <RequestTable roleId={roleId} />}
      {roleId && activeTab === "Reminders" && <Reminders roleId={roleId}   />}
       
    </div>
  )
}

export default TrainingContainer

