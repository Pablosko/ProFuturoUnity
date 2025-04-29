mergeInto(LibraryManager.library, {
    initSCORM: function() {
        window.initSCORM();
    },

    saveData: function(value) {
        var jsString = UTF8ToString(value);
        window.saveData(jsString);
    },

    completeCourse: function() {
        window.completeCourse();
    },

    getScore: function() {
        var score = window.getScore();
        var buffer = allocate(intArrayFromString(score), 'i8', ALLOC_STACK);
        return buffer;
    },

    quitSCORM: function() {
        window.quitSCORM();
    }
});
