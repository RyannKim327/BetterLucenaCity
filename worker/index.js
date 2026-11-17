self.addEventListener("push", function (event) {
  if (!event.data) return;

  var payload = {};
  try {
    payload = event.data.json();
  } catch (err) {
    payload = { title: "Better Lucena City", body: event.data.text() };
  }

  var title = payload.title || "Better Lucena City";
  var options = {
    body: payload.body || "",
    icon: "/blc-logo.png",
    badge: "/blc-logo.png",
    data: { url: payload.url || "/" },
    tag: payload.tag || undefined,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  var target =
    (event.notification.data && event.notification.data.url) || "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        for (var i = 0; i < clientList.length; i += 1) {
          var client = clientList[i];
          var url = new URL(client.url);
          if (url.pathname === target && "focus" in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(target);
        }
      })
  );
});
