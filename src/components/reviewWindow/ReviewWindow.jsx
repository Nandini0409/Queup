import { useState } from "react"

import AcceptedConnectionsTab from "../reviewWindow/AcceptedConnectionsTab"
import RepliedLeadsTab from "../reviewWindow/RepliedLeadsTab"
import FollowUpsTab from "../reviewWindow/FollowUpsTab"

const ReviewWindow = ()=>{
  const [activeTab, setActiveTab] = useState("accepted")

  return (
    <>
      <div>
        <h1>Daily Review</h1>

        <button
          onClick={() =>
            setActiveTab("accepted")
          }
        >
          Accepted Connections
        </button>
        <button
          onClick={() =>
            setActiveTab("replied")
          }
        >
          Replied Leads
        </button>
        <button
          onClick={() =>
            setActiveTab("followups")
          }
        >
          Today's Follow Ups
        </button>
        <button
          onClick={() =>
            setActiveTab("")
          }
        >
          Close Window
        </button>

        {activeTab === "" && (<></>)}
        {activeTab === "accepted" && (<AcceptedConnectionsTab />)}
        {activeTab === "replied" && (<RepliedLeadsTab />)}
        {activeTab === "followups" && (<FollowUpsTab />)}
      </div>
    </>
  )
}


export default ReviewWindow