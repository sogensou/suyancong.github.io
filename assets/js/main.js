/* 苏彦聪 · 个人主页 — 交互脚本
   无依赖，纯浏览器原生 API。
   主题的首帧应用在各页 <head> 的内联脚本里完成，这里只处理点击切换。 */
(function () {
  "use strict";

  var root = document.documentElement;

  /* ---- 主题切换 ------------------------------------------------------- */
  var toggle = document.querySelector(".theme-toggle");

  function currentTheme() {
    var explicit = root.getAttribute("data-theme");
    if (explicit) return explicit;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {
        /* 隐私模式下 localStorage 不可用，忽略即可 */
      }
      toggle.setAttribute(
        "aria-label",
        next === "dark" ? "切换到浅色模式" : "切换到深色模式"
      );
    });
  }

  /* ---- 页脚「最近更新时间」--------------------------------------------- */
  /* 取自 HTTP 的 Last-Modified 响应头（GitLink Pages 会正确下发），
     因此改完内容推上去就自动更新，不用手工维护。
     HTML 里写死的那个日期只是没有脚本时的兜底值。 */
  var stamp = document.getElementById("site-updated");
  if (stamp) {
    var d = new Date(document.lastModified);
    if (!isNaN(d.getTime()) && d.getFullYear() >= 2000) {
      var pad = function (n) { return n < 10 ? "0" + n : "" + n; };
      var day =
        d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
      stamp.textContent = day + " " + pad(d.getHours()) + ":" + pad(d.getMinutes());
      stamp.setAttribute("datetime", day);
      stamp.parentNode.hidden = false;
    }
  }

  /* ---- 当前页导航高亮 ------------------------------------------------- */
  var here = location.pathname.replace(/\/$/, "/index.html").split("/").pop();
  Array.prototype.forEach.call(
    document.querySelectorAll(".nav__links a"),
    function (link) {
      var target = link.getAttribute("href").split("/").pop().split("#")[0];
      if (target && target === here) link.setAttribute("aria-current", "page");
    }
  );
})();
