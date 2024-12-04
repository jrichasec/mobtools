function listLoadedLibraries() {
    const modules = Process.enumerateModules();
    modules.forEach(function(module) {
        console.log('Library: ' + module.name + ' at ' + module.base);
    });
}
