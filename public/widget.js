(function () {
  var script = document.currentScript;
  var origin = script && script.src ? new URL(script.src).origin : "";
  var root = document.createElement("div");
  root.style.cssText = "position:fixed;right:16px;bottom:16px;z-index:9999;font-family:sans-serif";
  var button = document.createElement("button");
  button.type = "button";
  button.textContent = "Admissions";
  button.setAttribute("aria-label", "Open admission chat");
  button.style.cssText = "border:0;border-radius:999px;background:#0B3A6A;color:#fff;padding:12px 16px;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.2)";
  var frame = document.createElement("iframe");
  frame.title = "Admission chatbot";
  frame.src = origin + "/embed";
  frame.style.cssText = "display:none;width:min(380px,calc(100vw - 32px));height:min(640px,calc(100dvh - 96px));border:0;border-radius:24px;box-shadow:0 16px 40px rgba(0,0,0,.25);margin-bottom:12px;background:#fff";
  button.addEventListener("click", function () {
    var open = frame.style.display === "block";
    frame.style.display = open ? "none" : "block";
    button.setAttribute("aria-expanded", open ? "false" : "true");
  });
  root.appendChild(frame);
  root.appendChild(button);
  document.body.appendChild(root);
})();
