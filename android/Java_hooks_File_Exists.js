Java.perform(function () {
    var File = Java.use('java.io.File');

    File.exists.implementation = function () {
        var filePath = this.getAbsolutePath();
        var result = this.exists();

        console.log('[*] File.exists() called');
        console.log('    File Path: ' + filePath);
        console.log('    Exists: ' + result);

        return result;
    };
});
