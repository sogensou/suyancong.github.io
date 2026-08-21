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
