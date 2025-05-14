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
        var buffer = allocate(intArrayFromString(str2), 'i8', ALLOC_STACK);
        return buffer;
    }
});