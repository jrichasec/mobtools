function enumerateLibraryExports() {
    try {
        var toolCheckerModule = Module.findBaseAddress("<nativelib.so>");
        if (toolCheckerModule) {
            console.log("[*] Enumerating exports from lib");
            var exports = Module.enumerateExports("<nativelib.so>");
            exports.forEach(function (exp) {
                console.log("Export: " + exp.name + " | Type: " + exp.type);
            });
        } else {
            console.log("[-] Unable to find lib");
        }
    } catch (e) {
        console.log("Error while enumerating exports: " + e);
    }
}
