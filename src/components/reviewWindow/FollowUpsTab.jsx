import { useEffect, useState } from "react";

import { useCurrentUser } from "../../hooks/useCurrentUser";

import {
  getFollowUpsDueToday,
  markFollowup1Sent,
  markFollowup2Sent,
  markFinalFollowupSent,
} from "../../services/leads";

import { createActivity } from "../../services/activities";

import {
  getTemplate,
  saveTemplate,
} from "../../services/templates";

function FollowUpsTab() {
  const user = useCurrentUser();

  const [
    followup1Leads,
    setFollowup1Leads,
  ] = useState([]);

  const [
    followup2Leads,
    setFollowup2Leads,
  ] = useState([]);

  const [
    finalLeads,
    setFinalLeads,
  ] = useState([]);

  const [
    followup1Template,
    setFollowup1Template,
  ] = useState("");

  const [
    followup2Template,
    setFollowup2Template,
  ] = useState("");

  const [
    finalTemplate,
    setFinalTemplate,
  ] = useState("");

  useEffect(() => {
    if (!user) return;

    async function loadLeads() {
      try {
        const leads =
          await getFollowUpsDueToday(
            user.id
          );

        setFollowup1Leads(
          leads.filter(
            (lead) =>
              lead.status ===
              "initial_message_sent"
          )
        );

        setFollowup2Leads(
          leads.filter(
            (lead) =>
              lead.status ===
              "followup1_sent"
          )
        );

        setFinalLeads(
          leads.filter(
            (lead) =>
              lead.status ===
              "followup2_sent"
          )
        );
      } catch (error) {
        console.error(error);
      }
    }

    loadLeads();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    async function loadTemplates() {
      try {
        const followup1 =
          await getTemplate(
            user.id,
            "followup1"
          );

        const followup2 =
          await getTemplate(
            user.id,
            "followup2"
          );

        const finalFollowup =
          await getTemplate(
            user.id,
            "final_followup"
          );

        setFollowup1Template(
          followup1?.content ||
            `Hi {{firstName}},

Just following up on my previous message.`
        );

        setFollowup2Template(
          followup2?.content ||
            `Hi {{firstName}},

Wanted to check back one more time.`
        );

        setFinalTemplate(
          finalFollowup?.content ||
            `Hi {{firstName}},

This will be my last follow up.`
        );
      } catch (error) {
        console.error(error);
      }
    }

    loadTemplates();
  }, [user]);

  const handleSaveFollowup1 =
    async () => {
      try {
        await saveTemplate(
          user.id,
          "followup1",
          followup1Template
        );
      } catch (error) {
        console.error(error);
      }
    };

  const handleSaveFollowup2 =
    async () => {
      try {
        await saveTemplate(
          user.id,
          "followup2",
          followup2Template
        );
      } catch (error) {
        console.error(error);
      }
    };

  const handleSaveFinal =
    async () => {
      try {
        await saveTemplate(
          user.id,
          "final_followup",
          finalTemplate
        );
      } catch (error) {
        console.error(error);
      }
    };

  const copyTemplateMessage =
    async (
      template,
      lead
    ) => {
      try {
        const firstName =
          lead.name.split(
            " "
          )[0];

        const message =
          template.replace(
            "{{firstName}}",
            firstName
          );

        await navigator.clipboard.writeText(
          message
        );
      } catch (error) {
        console.error(error);
      }
    };

  const handleFollowup1Done =
    async (lead) => {
      try {
        await markFollowup1Sent(
          lead.id
        );

        await createActivity(
          user.id,
          lead.id,
          "followup1_sent"
        );

        setFollowup1Leads(
          (prev) =>
            prev.filter(
              (item) =>
                item.id !== lead.id
            )
        );
      } catch (error) {
        console.error(error);
      }
    };

  const handleFollowup2Done =
    async (lead) => {
      try {
        await markFollowup2Sent(
          lead.id
        );

        await createActivity(
          user.id,
          lead.id,
          "followup2_sent"
        );

        setFollowup2Leads(
          (prev) =>
            prev.filter(
              (item) =>
                item.id !== lead.id
            )
        );
      } catch (error) {
        console.error(error);
      }
    };

  const handleFinalDone =
    async (lead) => {
      try {
        await markFinalFollowupSent(
          lead.id
        );

        await createActivity(
          user.id,
          lead.id,
          "final_followup_sent"
        );

        setFinalLeads(
          (prev) =>
            prev.filter(
              (item) =>
                item.id !== lead.id
            )
        );
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div>
      <h2>
        Today's Follow Ups
      </h2>

      <hr />

      <section>
        <h3>
          Follow Up 1 (
          {
            followup1Leads.length
          }{" "}
          Due Today)
        </h3>

        <textarea
          rows={5}
          value={
            followup1Template
          }
          onChange={(e) =>
            setFollowup1Template(
              e.target.value
            )
          }
        />

        <button
          onClick={
            handleSaveFollowup1
          }
        >
          Save Template
        </button>

        {followup1Leads.length ===
          0 && (
          <p>
            No Follow Up 1s due
            today.
          </p>
        )}

        {followup1Leads.map(
          (lead) => (
            <div
              key={lead.id}
            >
              <h4>
                {lead.name}
              </h4>

              <button
                onClick={() =>
                  copyTemplateMessage(
                    followup1Template,
                    lead
                  )
                }
              >
                Copy Message
              </button>

              <a
                href={
                  lead.profile_url
                }
                target="_blank"
                rel="noreferrer"
              >
                Open LinkedIn
              </a>

              <button
                onClick={() =>
                  handleFollowup1Done(
                    lead
                  )
                }
              >
                Done
              </button>

              <hr />
            </div>
          )
        )}
      </section>

      <section>
        <h3>
          Follow Up 2 (
          {
            followup2Leads.length
          }{" "}
          Due Today)
        </h3>

        <textarea
          rows={5}
          value={
            followup2Template
          }
          onChange={(e) =>
            setFollowup2Template(
              e.target.value
            )
          }
        />

        <button
          onClick={
            handleSaveFollowup2
          }
        >
          Save Template
        </button>

        {followup2Leads.length ===
          0 && (
          <p>
            No Follow Up 2s due
            today.
          </p>
        )}

        {followup2Leads.map(
          (lead) => (
            <div
              key={lead.id}
            >
              <h4>
                {lead.name}
              </h4>

              <button
                onClick={() =>
                  copyTemplateMessage(
                    followup2Template,
                    lead
                  )
                }
              >
                Copy Message
              </button>

              <a
                href={
                  lead.profile_url
                }
                target="_blank"
                rel="noreferrer"
              >
                Open LinkedIn
              </a>

              <button
                onClick={() =>
                  handleFollowup2Done(
                    lead
                  )
                }
              >
                Done
              </button>

              <hr />
            </div>
          )
        )}
      </section>

      <section>
        <h3>
          Final Follow Up (
          {
            finalLeads.length
          }{" "}
          Due Today)
        </h3>

        <textarea
          rows={5}
          value={finalTemplate}
          onChange={(e) =>
            setFinalTemplate(
              e.target.value
            )
          }
        />

        <button
          onClick={
            handleSaveFinal
          }
        >
          Save Template
        </button>

        {finalLeads.length ===
          0 && (
          <p>
            No Final Follow Ups
            due today.
          </p>
        )}

        {finalLeads.map(
          (lead) => (
            <div
              key={lead.id}
            >
              <h4>
                {lead.name}
              </h4>

              <button
                onClick={() =>
                  copyTemplateMessage(
                    finalTemplate,
                    lead
                  )
                }
              >
                Copy Message
              </button>

              <a
                href={
                  lead.profile_url
                }
                target="_blank"
                rel="noreferrer"
              >
                Open LinkedIn
              </a>

              <button
                onClick={() =>
                  handleFinalDone(
                    lead
                  )
                }
              >
                Done
              </button>

              <hr />
            </div>
          )
        )}
      </section>
    </div>
  );
}

export default FollowUpsTab;