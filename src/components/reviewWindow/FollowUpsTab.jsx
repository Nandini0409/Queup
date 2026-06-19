import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import { useCurrentUser } from "../../hooks/useCurrentUser";

import LeadDrawer from "../drawer/LeadDrawer";
import FollowUpSection from "./FollowupSection";
import { LEAD_STATUS } from "../../constants/leadStatus";

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




function FollowUpSectionSkeleton() {
  return (
    <div
      className="
        rounded-2xl bg-white
        border border-[var(--color-border)]
        overflow-hidden
      "
    >
      <div className="px-4 sm:px-5 py-4">
        <div className="h-5 w-40 rounded bg-slate-200 animate-pulse" />
      </div>

      <div className="h-px bg-[var(--color-border)]" />

      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="
            flex flex-col gap-4
            sm:flex-row sm:items-center sm:justify-between

            px-4 sm:px-5 py-4
            border-b border-[var(--color-border)]
          "
        >
          <div>
            <div className="h-4 w-32 rounded bg-slate-200 animate-pulse" />
            <div className="mt-2 h-3 w-40 rounded bg-slate-100 animate-pulse" />
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="h-8 w-16 rounded-lg bg-slate-200 animate-pulse" />
            <div className="h-8 w-16 rounded-lg bg-slate-200 animate-pulse" />
            <div className="h-8 w-24 rounded-lg bg-slate-200 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}







function FollowUpsTab() {
  const user = useCurrentUser();
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followup1Leads, setFollowup1Leads] = useState([]);
  const [followup2Leads, setFollowup2Leads] = useState([]);
  const [finalLeads, setFinalLeads] = useState([]);
  const [followup1Template, setFollowup1Template] = useState("");
  const [followup2Template, setFollowup2Template] = useState("");
  const [finalTemplate, setFinalTemplate] = useState("");
  const [savingTemplateId, setSavingTemplateId] = useState(null);
  const [loadingLeadId, setLoadingLeadId] = useState(null);

  const followupSections = [
    {
      id: "followup1",
      title: "Follow Up 1",
      leads: followup1Leads,
      setLeads: setFollowup1Leads,
      status: "initial_message_sent",
      doneType: "follow_up_1_sent",
      api: markFollowup1Sent,
      template: followup1Template,
      setTemplate: setFollowup1Template,
      templateKey: "followup1",
    },
    {
      id: "followup2",
      title: "Follow Up 2",
      leads: followup2Leads,
      setLeads: setFollowup2Leads,
      status: "follow_up_1_sent",
      doneType: "follow_up_2_sent",
      api: markFollowup2Sent,
      template: followup2Template,
      setTemplate: setFollowup2Template,
      templateKey: "followup2",
    },
    {
      id: "final",
      title: "Final Follow Up",
      leads: finalLeads,
      setLeads: setFinalLeads,
      status: "follow_up_2_sent",
      doneType: "final_follow_up_sent",
      api: markFinalFollowupSent,
      template: finalTemplate,
      setTemplate: setFinalTemplate,
      templateKey: "final_followup",
    },
  ];

  const defaultTemplates = {
    followup1: `Hi {{firstName}},\n\nJust following up on my previous message.`,
    followup2: `Hi {{firstName}},\n\nWanted to check if you had a chance to see my last message.`,
    final_followup: `Hi {{firstName}},\n\nJust sending one final follow up.`,
  };

  useEffect(() => {
    if (!user) return;

    async function loadLeads() {
      try {
        setLoading(true);
        const leads = await getFollowUpsDueToday(user.id);
        setFollowup1Leads(leads.filter((lead) => lead.status === "initial_message_sent"));
        setFollowup2Leads(leads.filter((lead) => lead.status === "follow_up_1_sent"));
        setFinalLeads(leads.filter((lead) => lead.status === "follow_up_2_sent"));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadLeads();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    async function loadTemplates() {
      try {
        const [f1, f2, f3] = await Promise.all([
          getTemplate(user.id, "followup1"),
          getTemplate(user.id, "followup2"),
          getTemplate(user.id, "final_followup"),
        ]);

        setFollowup1Template(f1?.content || defaultTemplates.followup1);
        setFollowup2Template(f2?.content || defaultTemplates.followup2);
        setFinalTemplate(f3?.content || defaultTemplates.final_followup);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load templates");
      }
    }

    loadTemplates();
  }, [user]);


  function handleLeadStatusChanged(
    updatedLead
  ) {
    if (
      updatedLead.status !==
      LEAD_STATUS.INTERESTED
    ) {
      return;
    }

    setFollowup1Leads((prev) =>
      prev.filter(
        (lead) =>
          lead.id !== updatedLead.id
      )
    );

    setFollowup2Leads((prev) =>
      prev.filter(
        (lead) =>
          lead.id !== updatedLead.id
      )
    );

    setFinalLeads((prev) =>
      prev.filter(
        (lead) =>
          lead.id !== updatedLead.id
      )
    );
  }


  async function saveTemplateHandler(type, template) {
    try {
      setSavingTemplateId(type);

      if (!template.includes("{{firstName}}")) {
        toast("Template saved, but it doesn't include {{firstName}}", {
          icon: "⚠️",
        });
      }

      await saveTemplate(user.id, type, template);
      toast.success("Template saved");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save template");
    } finally {
      setSavingTemplateId(null);
    }
  }

  async function copyMessage(lead, template) {
    try {
      const firstName = lead.name.split(" ")[0];
      const message = template.replace("{{firstName}}", firstName);
      await navigator.clipboard.writeText(message);
      toast.success("Message copied");
    } catch (error) {
      console.error(error);
      toast.error("Failed to copy message");
    }
  }

  async function markDone(lead, section) {
    const config = followupSections.find((item) => item.id === section);
    if (!config) return;

    try {
      setLoadingLeadId(lead.id);

      await config.api(lead.id);

      config.setLeads((prev) =>
        prev.filter((item) => item.id !== lead.id)
      );

      await createActivity(
        user.id,
        lead.id,
        config.doneType
      );

      toast.success("Follow up completed");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update lead");
    } finally {
      setLoadingLeadId(null);
    }
  }

  const hasAnyFollowups =
    followup1Leads.length > 0 ||
    followup2Leads.length > 0 ||
    finalLeads.length > 0;

  if (loading) {
  return (
    <div className="space-y-5">
      <FollowUpSectionSkeleton />
      <FollowUpSectionSkeleton />
      <FollowUpSectionSkeleton />
    </div>
  );
}

  if (!hasAnyFollowups) {
    return (
      <div
  className="
    rounded-xl
    border border-[var(--color-border)]
    bg-white
    p-5 sm:p-8
    text-center
  "
>
        <h3 className="mt-3 font-semibold text-[var(--color-text)]">You're all caught up</h3>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          No follow ups need attention today.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-10">
      {followupSections.map((section) =>
        section.leads.length > 0 ? (
          <FollowUpSection
            key={section.id}

            sectionId={section.id}

            title={section.title}
            template={section.template}
            setTemplate={section.setTemplate}
            leads={section.leads}

            onSave={() =>
              saveTemplateHandler(section.templateKey, section.template)
            }

            onCopy={(lead) =>
              copyMessage(lead, section.template)
            }

            onDone={(lead) =>
              markDone(lead, section.id)
            }

            onView={setSelectedLead}

            saving={savingTemplateId === section.templateKey}
            loadingLeadId={loadingLeadId}
          />
        ) : null
      )}

      {selectedLead && <LeadDrawer
        lead={selectedLead}
        onClose={() =>
          setSelectedLead(null)
        }
        onLeadStatusChanged={
          handleLeadStatusChanged
        }
      />}
    </div>
  );
}

export default FollowUpsTab;