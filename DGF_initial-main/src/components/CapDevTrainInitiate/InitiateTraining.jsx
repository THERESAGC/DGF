import { useState } from "react";
import "./InitiateTraining.css";
import AssignCourseModal from "./AssignCourseModal";

const InitiateTraining = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="initiate-training-container">
              <AssignCourseModal open={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
};

export default InitiateTraining;