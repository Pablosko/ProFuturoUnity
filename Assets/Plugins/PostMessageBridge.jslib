mergeInto(LibraryManager.library, {
  SendMessageToParent: function(ptr) {
    var message = UTF8ToString(ptr);
    window.parent.postMessage(message, "*");
  }
});