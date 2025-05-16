mergeInto(LibraryManager.library, {
    initScorm: function () {
        initScorm();
        return 1; // o cualquier valor que esperes
    },
    initPage: function (ptr) {
        var str = UTF8ToString(ptr);
        initPage(str);
    },
    endPage: function (ptr) {
        var str = UTF8ToString(ptr);
        endPage(str);
    },
    pageState: function (ptr) {
        var str = UTF8ToString(ptr);
        var str2 = pageState(str);
        var lengthBytes = lengthBytesUTF8(str2) + 1;
        var buffer = stackAlloc(lengthBytes);
        stringToUTF8(str2, buffer, lengthBytes);
        return buffer;
    },
    getAvatar: function () {
        var str = getAvatar();
        var lengthBytes = lengthBytesUTF8(str) + 1;
        var buffer = stackAlloc(lengthBytes);
        stringToUTF8(str, buffer, lengthBytes);
        return buffer;
    },
    saveAvatar: function (ptr) {
        var str = UTF8ToString(ptr);
        saveAvatar(str);
    }
});