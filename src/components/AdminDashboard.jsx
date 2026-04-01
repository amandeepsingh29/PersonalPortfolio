import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "../ThemeContext";
import { useSiteContent } from "../SiteContentContext";
import { Save, Plus, Trash2 } from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-red-500 dark:border-gray-700 dark:bg-[#0b0b12] dark:text-gray-100";

const tableHeaderClass =
  "border-b border-gray-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:text-gray-400";

function cloneContent(value) {
  return JSON.parse(JSON.stringify(value));
}

function SectionCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#11111a]">
      <h3 className="text-base font-bold text-gray-900 dark:text-white">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function ActionButton({ onClick, children, variant = "default", disabled = false }) {
  const base = "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors";
  const variantClass =
    variant === "primary"
      ? "bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
      : "border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`${base} ${variantClass}`}>
      {children}
    </button>
  );
}

export default function AdminDashboard() {
  const { isDark } = useTheme();
  const { content, setContent } = useSiteContent();
  const [draftContent, setDraftContent] = useState(() => cloneContent(content));
  const [autoApply, setAutoApply] = useState(true);
  const [status, setStatus] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState(null);

  useEffect(() => {
    setDraftContent(cloneContent(content));
  }, [content]);

  const isDirty = useMemo(() => {
    return JSON.stringify(content) !== JSON.stringify(draftContent);
  }, [content, draftContent]);

  useEffect(() => {
    if (!autoApply || !isDirty) return;
    setContent(cloneContent(draftContent));
    setLastSavedAt(new Date());
  }, [autoApply, draftContent, isDirty, setContent]);

  const updateProjectsField = (key, value) => {
    setDraftContent((prev) => ({
      ...prev,
      projects: {
        ...(prev.projects || {}),
        [key]: value,
      },
    }));
  };

  const updateContactField = (key, value) => {
    setDraftContent((prev) => ({
      ...prev,
      contact: {
        ...(prev.contact || {}),
        [key]: value,
      },
    }));
  };

  const updateFooterField = (key, value) => {
    setDraftContent((prev) => ({
      ...prev,
      footer: {
        ...(prev.footer || {}),
        [key]: value,
      },
    }));
  };

  const updateListItem = (sectionKey, index, field, value) => {
    setDraftContent((prev) => ({
      ...prev,
      [sectionKey]: (prev[sectionKey] || []).map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addListItem = (sectionKey, item) => {
    setDraftContent((prev) => ({
      ...prev,
      [sectionKey]: [...(prev[sectionKey] || []), item],
    }));
  };

  const removeListItem = (sectionKey, index) => {
    setDraftContent((prev) => ({
      ...prev,
      [sectionKey]: (prev[sectionKey] || []).filter((_, idx) => idx !== index),
    }));
  };

  const updateNestedListItem = (parentKey, listKey, index, field, value) => {
    setDraftContent((prev) => {
      const parent = prev[parentKey] || {};
      const list = parent[listKey] || [];
      return {
        ...prev,
        [parentKey]: {
          ...parent,
          [listKey]: list.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)),
        },
      };
    });
  };

  const addNestedListItem = (parentKey, listKey, item) => {
    setDraftContent((prev) => {
      const parent = prev[parentKey] || {};
      const list = parent[listKey] || [];
      return {
        ...prev,
        [parentKey]: {
          ...parent,
          [listKey]: [...list, item],
        },
      };
    });
  };

  const removeNestedListItem = (parentKey, listKey, index) => {
    setDraftContent((prev) => {
      const parent = prev[parentKey] || {};
      const list = parent[listKey] || [];
      return {
        ...prev,
        [parentKey]: {
          ...parent,
          [listKey]: list.filter((_, idx) => idx !== index),
        },
      };
    });
  };

  const handleProjectImageFile = (index, file) => {
    if (!file) return;
    const safeName = file.name.replace(/\s+/g, "-");
    const targetPath = `/images/projects/${safeName}`;
    updateNestedListItem("projects", "items", index, "image", targetPath);
    setStatus(`Set image path to ${targetPath}. Place this file in public/images/projects before deploy.`);
  };

  const saveAll = () => {
    setContent(cloneContent(draftContent));
    setStatus("Saved successfully.");
    setLastSavedAt(new Date());
  };

  const projects = draftContent.projects || {};
  const projectItems = projects.items || [];
  const blogPosts = draftContent.blogPosts || [];
  const papers = draftContent.papers || [];
  const topics = draftContent.topics || [];
  const contact = draftContent.contact || {};
  const footer = draftContent.footer || {};
  const footerSocials = footer.socials || [];

  return (
    <section className={`mx-auto max-w-6xl px-6 py-16 ${isDark ? "text-white" : "text-gray-900"}`}>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono-space text-[11px] font-bold uppercase tracking-[0.2em] text-red-600">[ ADMIN ]</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Content Dashboard</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Edit content in table form. Changes are persisted to localStorage and reflected in the frontend.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <ActionButton onClick={saveAll} disabled={!isDirty} variant="primary">
            <Save size={15} /> Save
          </ActionButton>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
        <span
          className={`rounded-full px-3 py-1 font-mono-space ${
            isDirty ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
          }`}
        >
          {isDirty ? "Unsaved changes" : "All changes saved"}
        </span>
        <button
          type="button"
          onClick={() => setAutoApply((prev) => !prev)}
          className={`rounded-full px-3 py-1 font-mono-space ${
            autoApply
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          Auto-apply: {autoApply ? "ON" : "OFF"}
        </button>
        {lastSavedAt && (
          <span className="rounded-full bg-gray-100 px-3 py-1 font-mono-space text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            Saved at {lastSavedAt.toLocaleTimeString()}
          </span>
        )}
      </div>

      {status && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-900/10 dark:text-red-300">
          {status}
        </p>
      )}

      <div className="space-y-5">
        <SectionCard title="Project Settings">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input
              className={inputClass}
              placeholder="Projects section title"
              value={projects.title || ""}
              onChange={(e) => updateProjectsField("title", e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="All repos URL"
              value={projects.repoUrl || ""}
              onChange={(e) => updateProjectsField("repoUrl", e.target.value)}
            />
          </div>
        </SectionCard>

        <SectionCard title="Project Items">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className={tableHeaderClass}>Name</th>
                  <th className={tableHeaderClass}>Language</th>
                  <th className={tableHeaderClass}>Stars</th>
                  <th className={tableHeaderClass}>URL</th>
                  <th className={tableHeaderClass}>Image URL</th>
                  <th className={tableHeaderClass}>Upload File</th>
                  <th className={tableHeaderClass}>Description</th>
                  <th className={tableHeaderClass}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projectItems.map((item, index) => (
                  <tr key={`project-${index}`} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-2"><input className={inputClass} value={item.name || ""} onChange={(e) => updateNestedListItem("projects", "items", index, "name", e.target.value)} /></td>
                    <td className="p-2"><input className={inputClass} value={item.lang || ""} onChange={(e) => updateNestedListItem("projects", "items", index, "lang", e.target.value)} /></td>
                    <td className="p-2"><input type="number" className={inputClass} value={item.stars ?? 0} onChange={(e) => updateNestedListItem("projects", "items", index, "stars", Number(e.target.value || 0))} /></td>
                    <td className="p-2"><input className={inputClass} value={item.url || ""} onChange={(e) => updateNestedListItem("projects", "items", index, "url", e.target.value)} /></td>
                    <td className="p-2"><input className={inputClass} value={item.image || ""} onChange={(e) => updateNestedListItem("projects", "items", index, "image", e.target.value)} /></td>
                    <td className="p-2">
                      <input
                        type="file"
                        accept="image/*"
                        className="block w-full text-xs text-gray-600 file:mr-2 file:rounded file:border-0 file:bg-gray-200 file:px-2 file:py-1 file:text-xs file:font-semibold file:text-gray-700 hover:file:bg-gray-300 dark:text-gray-300 dark:file:bg-gray-700 dark:file:text-gray-100 dark:hover:file:bg-gray-600"
                        onChange={(e) => handleProjectImageFile(index, e.target.files?.[0])}
                      />
                    </td>
                    <td className="p-2"><textarea className={`${inputClass} min-h-[72px]`} value={item.description || ""} onChange={(e) => updateNestedListItem("projects", "items", index, "description", e.target.value)} /></td>
                    <td className="p-2 align-top">
                      <button type="button" onClick={() => removeNestedListItem("projects", "items", index)} className="rounded-lg border border-red-200 px-2 py-1 text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" onClick={() => addNestedListItem("projects", "items", { name: "", description: "", lang: "", url: "", image: "", stars: 0 })} className="mt-3 inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
            <Plus size={14} /> Add Project
          </button>
        </SectionCard>

        <SectionCard title="Blog Posts">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead><tr><th className={tableHeaderClass}>Date</th><th className={tableHeaderClass}>Title</th><th className={tableHeaderClass}>URL</th><th className={tableHeaderClass}>Actions</th></tr></thead>
              <tbody>
                {blogPosts.map((item, index) => (
                  <tr key={`blog-${index}`} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-2"><input className={inputClass} value={item.date || ""} onChange={(e) => updateListItem("blogPosts", index, "date", e.target.value)} /></td>
                    <td className="p-2"><input className={inputClass} value={item.title || ""} onChange={(e) => updateListItem("blogPosts", index, "title", e.target.value)} /></td>
                    <td className="p-2"><input className={inputClass} value={item.url || ""} onChange={(e) => updateListItem("blogPosts", index, "url", e.target.value)} /></td>
                    <td className="p-2"><button type="button" onClick={() => removeListItem("blogPosts", index)} className="rounded-lg border border-red-200 px-2 py-1 text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20"><Trash2 size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" onClick={() => addListItem("blogPosts", { date: "", title: "", url: "" })} className="mt-3 inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"><Plus size={14} /> Add Blog</button>
        </SectionCard>

        <SectionCard title="Papers">
          <div className="space-y-2">
            {papers.map((item, index) => (
              <div key={`paper-${index}`} className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_1fr_auto]">
                <input className={inputClass} placeholder="Title" value={item.title || ""} onChange={(e) => updateListItem("papers", index, "title", e.target.value)} />
                <input className={inputClass} placeholder="URL" value={item.url || ""} onChange={(e) => updateListItem("papers", index, "url", e.target.value)} />
                <button type="button" onClick={() => removeListItem("papers", index)} className="rounded-lg border border-red-200 px-2 py-1 text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => addListItem("papers", { title: "", url: "" })} className="mt-3 inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"><Plus size={14} /> Add Paper</button>
        </SectionCard>

        <SectionCard title="Topics">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead><tr><th className={tableHeaderClass}>Title</th><th className={tableHeaderClass}>URL</th><th className={tableHeaderClass}>Hide (todo)</th><th className={tableHeaderClass}>Actions</th></tr></thead>
              <tbody>
                {topics.map((item, index) => (
                  <tr key={`topic-${index}`} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-2"><input className={inputClass} value={item.title || ""} onChange={(e) => updateListItem("topics", index, "title", e.target.value)} /></td>
                    <td className="p-2"><input className={inputClass} value={item.url || ""} onChange={(e) => updateListItem("topics", index, "url", e.target.value)} /></td>
                    <td className="p-2"><input type="checkbox" checked={Boolean(item.todo)} onChange={(e) => updateListItem("topics", index, "todo", e.target.checked)} /></td>
                    <td className="p-2"><button type="button" onClick={() => removeListItem("topics", index)} className="rounded-lg border border-red-200 px-2 py-1 text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20"><Trash2 size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" onClick={() => addListItem("topics", { title: "", url: "#", todo: false })} className="mt-3 inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"><Plus size={14} /> Add Topic</button>
        </SectionCard>

        <SectionCard title="Contact">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input className={inputClass} placeholder="Title" value={contact.title || ""} onChange={(e) => updateContactField("title", e.target.value)} />
            <input className={inputClass} placeholder="LinkedIn URL" value={contact.linkedinUrl || ""} onChange={(e) => updateContactField("linkedinUrl", e.target.value)} />
            <input className={inputClass} placeholder="Button label" value={contact.buttonLabel || ""} onChange={(e) => updateContactField("buttonLabel", e.target.value)} />
            <input className={inputClass} placeholder="Description" value={contact.description || ""} onChange={(e) => updateContactField("description", e.target.value)} />
          </div>
        </SectionCard>

        <SectionCard title="Footer">
          <div className="space-y-3">
            <input className={inputClass} placeholder="Footer tagline" value={footer.tagline || ""} onChange={(e) => updateFooterField("tagline", e.target.value)} />
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead><tr><th className={tableHeaderClass}>Platform</th><th className={tableHeaderClass}>URL</th><th className={tableHeaderClass}>Actions</th></tr></thead>
                <tbody>
                  {footerSocials.map((item, index) => (
                    <tr key={`social-${index}`} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="p-2">
                        <select className={inputClass} value={item.platform || ""} onChange={(e) => updateNestedListItem("footer", "socials", index, "platform", e.target.value)}>
                          <option value="twitter">twitter</option>
                          <option value="linkedin">linkedin</option>
                          <option value="github">github</option>
                          <option value="instagram">instagram</option>
                        </select>
                      </td>
                      <td className="p-2"><input className={inputClass} value={item.href || ""} onChange={(e) => updateNestedListItem("footer", "socials", index, "href", e.target.value)} /></td>
                      <td className="p-2"><button type="button" onClick={() => removeNestedListItem("footer", "socials", index)} className="rounded-lg border border-red-200 px-2 py-1 text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20"><Trash2 size={14} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="button" onClick={() => addNestedListItem("footer", "socials", { platform: "github", href: "" })} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"><Plus size={14} /> Add Social</button>
          </div>
        </SectionCard>
      </div>
    </section>
  );
}
