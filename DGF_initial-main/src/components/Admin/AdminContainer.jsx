import { useContext, useEffect, useState } from "react"
import AdminSetting from "./AdminSetting"
import RequestFormEditor from "./RequestFormEditor"
import AuthContext from "../Auth/AuthContext"
import AdminHeaderBtn from "./AdminHeaderBtn"
import DownloadReport from "./Download-report"

const AdminContainer = () => {
  const { user } = useContext(AuthContext)
  const [roleId, setRoleId] = useState(null)
  const [selectedComponent, setSelectedComponent] = useState("Users")

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

  const handleSelectComponent = (componentName) => {
    setSelectedComponent(componentName)
  }

  const styles = {
    mainContent: {
      flex: "auto",
      boxSizing: "border-box",
      padding: "2px 30px 0 30px",
      marginright: "0",
      marginBottom: "50px",
      maxWidth: "100%",
    },
  }

  const renderComponent = () => {
    switch (selectedComponent) {
      case "Users":
        return roleId && <AdminSetting roleId={roleId} />
      case "Data Field Management":
        return <RequestFormEditor />
      case "Reports":
        return <DownloadReport />
      default:
        return roleId && <AdminSetting roleId={roleId} />
    }
  }

  return (
    <div style={styles.mainContent}>
      <AdminHeaderBtn onSelectComponent={handleSelectComponent} />
      {renderComponent()}
    </div>
  )
}

export default AdminContainer

