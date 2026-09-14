(() => {
  const COMPANY = "XAU Technologies LLC";
  const FONT = "Arial, Helvetica, sans-serif";

  const THEMES = {
    light: {
      red: "#E00712",
      ink: "#1A1A1A",
      muted: "#6A6A6A",
      link: "#3D3D3D",
      bg: "",
      pad: "0",
    },
    dark: {
      red: "#FF3B30",
      ink: "#FFFFFF",
      muted: "#B0B0B0",
      link: "#E8E8E8",
      bg: "#212121",
      pad: "18px 20px",
    },
  };

  const SOCIALS = [
    { key: "x", name: "X", href: "https://x.com/xaumarkets" },
    { key: "instagram", name: "Instagram", href: "https://www.instagram.com/xauicapitalmarkets" },
    { key: "linkedin", name: "LinkedIn", href: "https://www.linkedin.com/in/xau-markets-9573a4410/" },
  ];

  const FILES = {
    logo: "assets/logo-sm.png?v=clear2",
    x: "assets/icons/x.png?v=clear2",
    instagram: "assets/icons/instagram.png?v=clear2",
    linkedin: "assets/icons/linkedin.png?v=clear2",
    phone: "assets/icons/phone.png",
    email: "assets/icons/email.png",
    web: "assets/icons/web.png",
    underline: "assets/name-underline.png?v=1",
    underlineDark: "assets/name-underline-dark.png?v=1",
  };

  const formIds = ["name", "title", "department", "phone", "mobile", "email", "website", "address"];
  const output = document.getElementById("sig-output");
  const copyBtn = document.getElementById("copy-btn");
  const copyHtmlBtn = document.getElementById("copy-html-btn");
  const statusEl = document.getElementById("copy-status");
  const styleButtons = document.querySelectorAll(".style-btn");
  const themeButtons = document.querySelectorAll(".theme-btn");
  const emailMock = document.querySelector(".email-mock");

  let currentStyle = "classic";
  let currentTheme = "dark";
  const src = { ...FILES };

  const field = (id) => document.getElementById(id).value.trim();
  const colors = () => THEMES[currentTheme];

  const esc = (value) =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const webHref = (url) => {
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;
    return `https://${url.replace(/^\/\//, "")}`;
  };

  const webLabel = (url) => url.replace(/^https?:\/\//i, "").replace(/\/$/, "");

  const data = () => ({
    name: field("name") || "Your Name",
    title: field("title"),
    department: field("department"),
    phone: field("phone"),
    mobile: field("mobile"),
    email: field("email"),
    website: field("website") || "xedge.trade",
    address: field("address"),
  });

  const a = (href, text, color) =>
    `<a href="${esc(href)}" style="color:${color};text-decoration:none;" target="_blank">${esc(text)}</a>`;

  const img = (key, width, alt, extra = "") =>
    `<img src="${esc(src[key])}" width="${width}" height="${width}" alt="${esc(alt)}" style="display:block;border:0;outline:none;text-decoration:none;background:transparent;${extra}" />`;

  const logoImg = (width) =>
    `<img src="${esc(src.logo)}" width="${width}" alt="${esc(COMPANY)}" style="display:block;border:0;outline:none;text-decoration:none;height:auto;max-width:${width}px;background:transparent;" />`;

  function nameUnderline(width = 86) {
    const key = currentTheme === "dark" ? "underlineDark" : "underline";
    const height = 8;
    return `<img src="${esc(src[key])}" width="${width}" height="${height}" alt="" style="display:block;border:0;outline:none;text-decoration:none;width:${width}px;height:${height}px;background:transparent;" />`;
  }

  function logoBlock(width) {
    return logoImg(width);
  }

  const roleLine = (d) => [d.title, d.department].filter(Boolean).join(" · ");

  function wrap(inner) {
    const c = colors();
    const bg = c.bg
      ? `bgcolor="${c.bg}" style="background-color:${c.bg};padding:${c.pad};font-family:${FONT};color-scheme:only light;"`
      : `style="font-family:${FONT};"`;
    return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:${FONT};">
      <tr><td ${bg}>${inner}</td></tr>
    </table>`;
  }

  function socialRow(size = 22) {
    const cells = SOCIALS.map(
      (item, i) => `
        <td style="padding:${i === 0 ? "0" : "0 0 0 8px"};vertical-align:middle;">
          <a href="${esc(item.href)}" target="_blank" style="display:block;text-decoration:none;border:0;">
            ${img(item.key, size, item.name)}
          </a>
        </td>`
    ).join("");
    return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>${cells}</tr></table>`;
  }

  function contactIconRow(iconKey, href, text) {
    if (!text) return "";
    const c = colors();
    const label = href ? a(href, text, c.link) : `<span style="color:${c.muted};">${esc(text)}</span>`;
    return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:${FONT};">
      <tr>
        <td style="padding:0 8px 5px 0;vertical-align:middle;width:16px;">${img(iconKey, 14, "")}</td>
        <td style="padding:0 0 5px 0;vertical-align:middle;font-size:12px;line-height:16px;color:${c.link};font-family:${FONT};">${label}</td>
      </tr>
    </table>`;
  }

  function contactsBlock(d) {
    const c = colors();
    return [
      contactIconRow("phone", d.phone ? `tel:${d.phone.replace(/\s+/g, "")}` : "", d.phone),
      contactIconRow("phone", d.mobile ? `tel:${d.mobile.replace(/\s+/g, "")}` : "", d.mobile),
      contactIconRow("email", d.email ? `mailto:${d.email}` : "", d.email),
      contactIconRow("web", webHref(d.website), webLabel(d.website)),
      d.address
        ? `<div style="font-size:12px;line-height:16px;color:${c.muted};padding:1px 0 0 22px;">${esc(d.address)}</div>`
        : "",
    ].join("");
  }

  function classic(d) {
    const c = colors();
    const role = roleLine(d);
    return wrap(`
      <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:${FONT};">
        <tr>
          <td style="vertical-align:middle;padding:0 18px 0 0;">${logoBlock(84)}</td>
          <td style="border-left:2px solid ${c.red};padding:2px 0 2px 18px;vertical-align:middle;">
            <div style="font-size:18px;line-height:22px;font-weight:bold;color:${c.ink};font-family:${FONT};">${esc(d.name)}</div>
            <div style="padding:6px 0 4px;line-height:0;font-size:0;">${nameUnderline(86)}</div>
            ${role ? `<div style="font-size:13px;line-height:18px;color:${c.red};padding-top:2px;font-family:${FONT};">${esc(role)}</div>` : ""}
            <div style="font-size:12px;line-height:18px;color:${c.muted};padding:2px 0 10px;font-family:${FONT};">${esc(COMPANY)}</div>
            ${contactsBlock(d)}
            <div style="padding-top:8px;">${socialRow(22)}</div>
          </td>
        </tr>
      </table>
    `);
  }

  function modern(d) {
    const c = colors();
    const role = roleLine(d);
    return wrap(`
      <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:${FONT};">
        <tr>
          <td style="vertical-align:middle;padding:0 16px 0 0;">${logoBlock(76)}</td>
          <td style="vertical-align:middle;">
            <div style="font-size:20px;line-height:24px;font-weight:bold;color:${c.ink};font-family:${FONT};">${esc(d.name)}</div>
            <div style="padding:7px 0 4px;line-height:0;font-size:0;">${nameUnderline(92)}</div>
            ${role ? `<div style="font-size:13px;line-height:18px;color:${c.red};padding-top:2px;font-family:${FONT};">${esc(role)}</div>` : ""}
            <div style="font-size:12px;line-height:18px;color:${c.muted};padding-top:2px;font-family:${FONT};">${esc(COMPANY)}</div>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding-top:14px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
              <tr><td style="border-top:2px solid ${c.red};font-size:0;line-height:0;height:2px;">&nbsp;</td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding-top:12px;">
            <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
              <tr>
                <td style="vertical-align:top;padding-right:18px;">${contactsBlock(d)}</td>
                <td style="vertical-align:bottom;padding-bottom:4px;">${socialRow(22)}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `);
  }

  function minimal(d) {
    const c = colors();
    const role = roleLine(d);
    return wrap(`
      <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:${FONT};">
        <tr>
          <td style="vertical-align:top;padding-right:20px;">
            <div style="font-size:17px;line-height:22px;font-weight:bold;color:${c.ink};font-family:${FONT};">
              ${esc(d.name)}${role ? ` <span style="color:${c.muted};font-weight:normal;">|</span> <span style="font-weight:normal;color:${c.muted};font-size:13px;">${esc(role)}</span>` : ""}
            </div>
            <div style="padding:8px 0 8px;line-height:0;font-size:0;">${nameUnderline(82)}</div>
            <div style="font-size:12px;line-height:18px;color:${c.muted};font-family:${FONT};">${esc(COMPANY)}</div>
            <div style="font-size:12px;line-height:18px;padding:4px 0 10px;font-family:${FONT};">${a(webHref(d.website), webLabel(d.website), c.red)}</div>
            ${d.phone || d.mobile || d.email || d.address ? contactsBlock({ ...d, website: "" }) : ""}
            <div style="padding-top:8px;">${socialRow(22)}</div>
          </td>
          <td style="vertical-align:middle;">${logoBlock(62)}</td>
        </tr>
      </table>
    `);
  }

  const builders = { classic, modern, minimal };

  function render() {
    output.innerHTML = builders[currentStyle](data());
    emailMock.classList.toggle("is-dark", currentTheme === "dark");
  }

  function setStatus(message, isError = false) {
    statusEl.textContent = message;
    statusEl.classList.toggle("error", isError);
    if (message) {
      window.clearTimeout(setStatus.timer);
      setStatus.timer = window.setTimeout(() => {
        statusEl.textContent = "";
        statusEl.classList.remove("error");
      }, 3500);
    }
  }

  function copyViaSelection() {
    const selection = window.getSelection();
    const range = document.createRange();
    output.setAttribute("contenteditable", "true");
    output.focus();
    range.selectNodeContents(output);
    selection.removeAllRanges();
    selection.addRange(range);
    const ok = document.execCommand("copy");
    output.removeAttribute("contenteditable");
    output.blur();
    selection.removeAllRanges();
    return ok;
  }

  async function copyRendered() {
    const node = output.querySelector("table") || output;
    const html = node.outerHTML;
    const plain = node.innerText.replace(/\n{3,}/g, "\n\n").trim();

    if (copyViaSelection()) {
      setStatus("Copied. Paste it into Gmail or Outlook.");
      return;
    }

    try {
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
            "text/plain": new Blob([plain], { type: "text/plain" }),
          }),
        ]);
        setStatus("Copied. Paste it into Gmail or Outlook.");
        return;
      }
    } catch (err) {
      console.warn("ClipboardItem failed", err);
    }

    setStatus("Copy failed. Select the preview and press Ctrl+C.", true);
  }

  async function copyHtml() {
    const node = output.querySelector("table") || output;
    try {
      await navigator.clipboard.writeText(node.outerHTML);
      setStatus("HTML copied.");
    } catch (err) {
      setStatus("Could not copy HTML.", true);
    }
  }

  async function toDataUrl(path) {
    const res = await fetch(path);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async function loadAssets() {
    const entries = Object.entries(FILES);
    await Promise.all(
      entries.map(async ([key, path]) => {
        try {
          src[key] = await toDataUrl(path);
        } catch (err) {
          src[key] = path;
        }
      })
    );
    render();
  }

  formIds.forEach((id) => {
    document.getElementById(id).addEventListener("input", render);
  });

  styleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentStyle = btn.dataset.style;
      styleButtons.forEach((item) => item.classList.toggle("active", item === btn));
      render();
    });
  });

  themeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentTheme = btn.dataset.theme;
      themeButtons.forEach((item) => item.classList.toggle("active", item === btn));
      render();
    });
  });

  copyBtn.addEventListener("click", copyRendered);
  copyHtmlBtn.addEventListener("click", copyHtml);

  render();
  loadAssets();
})();
