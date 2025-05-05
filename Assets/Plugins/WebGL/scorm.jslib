mergeInto(LibraryManager.library, {
    getCurseData: function () {
        var str = getCurseData(); // llamada a la función definida en HTML
        var buffer = allocate(intArrayFromString(str), 'i8', ALLOC_STACK);
        return buffer;
    },
    initScorm: function () {
        initScorm();
        return 1; // o cualquier valor que esperes
    },
    saveData: function (ptr) {
        var str = UTF8ToString(ptr);
        saveData(str);
    },
    completeCourse: function () {
        completeCourse();
    },
    getScore: function () {
        var str = getScore();
        var buffer = allocate(intArrayFromString(str), 'i8', ALLOC_STACK);
        return buffer;
    },
    quitSCORM: function () {
        quitSCORM();
    }
});