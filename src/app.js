const profileUrl = new URL("./data/profile.json", import.meta.url);
const projectList = document.querySelector("#project-list");
const errorNotice = document.querySelector("#load-error");

const setText = (selector, value) => {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = value || "";
  });
};

const makeLink = (label, url, className = "project-link") => {
  if (!url) return null;

  const link = document.createElement("a");
  link.className = className;
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = label;
  link.setAttribute("aria-label", `${label} (se abre en una pestaña nueva)`);
  return link;
};

const makeProjectMark = (name) => {
  const mark = document.createElement("span");
  mark.className = "project-mark";
  mark.textContent = name?.slice(0, 1) || "✳";
  return mark;
};

const renderProject = (project, index, copy) => {
  const card = document.createElement("details");
  card.className = `project-card${project.featured ? " project-featured" : ""}`;
  const summary = document.createElement("summary");
  summary.className = "project-card-summary";
  summary.setAttribute("aria-label", `Mostrar opciones de ${project.name || "proyecto"}`);
  summary.addEventListener("click", (event) => {
    if (event.detail === 0) return;

    const bounds = card.getBoundingClientRect();
    card.style.setProperty("--menu-x", `${event.clientX - bounds.left}px`);
    card.style.setProperty("--menu-y", `${event.clientY - bounds.top}px`);
  });

  const visual = document.createElement("div");
  visual.className = "project-visual";
  visual.setAttribute("aria-hidden", "true");
  if (project.image) {
    const image = document.createElement("img");
    image.src = project.image;
    image.alt = "";
    image.loading = "lazy";
    image.addEventListener("error", () => {
      image.replaceWith(makeProjectMark(project.name));
    }, { once: true });
    visual.append(image);
  } else {
    visual.append(makeProjectMark(project.name));
  }
  if (project.featured) {
    const badge = document.createElement("span");
    badge.className = "featured-badge";
    badge.textContent = copy.featuredProjectLabel || "Proyecto destacado";
    visual.append(badge);
  }

  const content = document.createElement("div");
  content.className = "project-content";
  const number = document.createElement("p");
  number.className = "project-number";
  number.textContent = `PROYECTO ${String(index + 1).padStart(2, "0")}`;

  const title = document.createElement("h3");
  title.textContent = project.name || "Proyecto";
  const description = document.createElement("p");
  description.className = "project-description";
  description.textContent = project.description || "";
  const technologies = document.createElement("ul");
  technologies.className = "technology-list";
  technologies.setAttribute("aria-label", "Tecnologías utilizadas");
  (Array.isArray(project.technologies) ? project.technologies : []).forEach((technology) => {
    const item = document.createElement("li");
    item.textContent = technology;
    technologies.append(item);
  });

  const options = document.createElement("div");
  options.className = "project-menu-options";
  const liveLink = makeLink("Ir a la web ↗", project.url);
  const repositoryLink = makeLink("Ir a GitHub ↗", project.repository);
  if (liveLink) options.append(liveLink);
  if (repositoryLink) options.append(repositoryLink);
  content.append(number, title, description, technologies);
  summary.append(visual, content);
  card.append(summary);
  if (options.childElementCount) {
    card.append(options);
  }
  return card;
};

const socialLabels = {
  github: "GitHub",
  linkedin: "LinkedIn",
  website: "Web personal",
};

try {
  const response = await fetch(profileUrl);
  if (!response.ok) throw new Error(`No se pudo cargar profile.json (${response.status}).`);
  const config = await response.json();
  const profile = config.profile || {};
  const copy = config.copy || {};

  document.title = "Web Lab";
  if (copy.seoDescription) {
    document.querySelector("#seo-description").content = copy.seoDescription;
  }
  document.querySelectorAll("[data-copy]").forEach((element) => {
    const value = copy[element.dataset.copy];
    if (typeof value === "string") element.textContent = value;
  });
  setText("[data-profile='name']", profile.name);
  setText("[data-profile='role']", profile.role);
  setText("[data-profile='description']", profile.description);
  setText("[data-profile='workStatus']", profile.workStatus);
  const avatar = document.querySelector("#profile-avatar");
  if (profile.avatar) {
    avatar.src = profile.avatar;
    avatar.alt = `Retrato de ${profile.name || "la persona autora"}`;
    avatar.hidden = false;
    avatar.addEventListener("error", () => avatar.remove(), { once: true });
  }

  const emailLink = document.querySelector("#contact-email");
  if (profile.email) {
    const gmailCompose = new URL("https://mail.google.com/mail/");
    gmailCompose.searchParams.set("view", "cm");
    gmailCompose.searchParams.set("fs", "1");
    gmailCompose.searchParams.set("to", profile.email);
    emailLink.href = gmailCompose.toString();
    emailLink.target = "_blank";
    emailLink.rel = "noopener noreferrer";
    emailLink.querySelector("#contact-address").textContent = profile.email;
  } else {
    emailLink.remove();
  }

  const instagramUrl = config.socials?.instagram;
  const instagramLink = document.querySelector("#instagram-link");
  if (instagramUrl) {
    instagramLink.href = instagramUrl;
    instagramLink.target = "_blank";
    instagramLink.rel = "noopener noreferrer";
    instagramLink.querySelector("#instagram-label").textContent =
      config.socials.instagramLabel || config.socials.instagram;
    instagramLink.hidden = false;
  }

  const socialLinks = document.querySelector("#social-links");
  Object.entries(socialLabels).forEach(([key, label]) => {
    const link = makeLink(label, config.socials?.[key], "social-link");
    if (link) socialLinks.append(link);
  });
  if (!socialLinks.childElementCount) socialLinks.remove();

  const projects = Array.isArray(config.projects)
    ? config.projects.filter((project) => project.name?.trim())
    : [];
  const technologies = new Set(
    projects.flatMap((project) => Array.isArray(project.technologies) ? project.technologies : []),
  );
  const skillsList = document.querySelector("#skills-list");
  technologies.forEach((technology) => {
    const item = document.createElement("li");
    item.textContent = technology;
    skillsList.append(item);
  });
  if (!skillsList.childElementCount) skillsList.closest(".skills-block").remove();

  projectList.replaceChildren();
  projects.forEach((project, index) => {
    projectList.append(renderProject(project, index, copy));
  });
  if (!projectList.childElementCount) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "loading-message";
    emptyMessage.textContent = copy.noProjectsMessage || "Pronto habrá proyectos por aquí.";
    projectList.append(emptyMessage);
  }

} catch (error) {
  console.error(error);
  projectList.replaceChildren();
  errorNotice.hidden = false;
}
