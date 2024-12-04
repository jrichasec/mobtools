Java.perform(function () {
    function safeReadUtf8String(ptr) {
        try {
            return Memory.readUtf8String(ptr);
        } catch (e) {
            return "<Error: " + e.message + ">";
        }
    }

    function printArguments(argv) {
        try {
            console.log("[+] Arguments:");
            var argIndex = 0;
            var arg;
            while ((arg = Memory.readPointer(argv.add(argIndex * Process.pointerSize))) != 0) {
                var argString = safeReadUtf8String(arg);
                console.log("  Arg[" + argIndex + "]: " + argString);
                argIndex++;
            }
        } catch (e) {
            console.log("[-] Failed to read arguments: " + e.message);
        }
    }
    // remove this at some point, spams the screen too hard
    function printEnvironment(envp) {
        try {
            //console.log("[+] Environment variables:");
            var envIndex = 0;
            var envVar;
            while ((envVar = Memory.readPointer(envp.add(envIndex * Process.pointerSize))) != 0) {
                var envString = safeReadUtf8String(envVar);
                //console.log("  Env[" + envIndex + "]: " + envString);
                envIndex++;
            }
        } catch (e) {
            console.log("[-] Failed to read environment variables: " + e.message);
        }
    }

    // Hook execve()
    var execve = Module.findExportByName("libc.so", "execve");
    if (execve !== null) {
        Interceptor.attach(execve, {
            onEnter: function (args) {
                var command = safeReadUtf8String(args[0]);
                console.log("[+] execve() called with command: " + command);
                printArguments(args[1]); // Command-line arguments
                printEnvironment(args[2]); // Environment variables
            },
            onLeave: function (retval) {
                console.log("[+] execve() returned with code: " + retval.toInt32());
            }
        });
    }

    // Hook execvp()
    var execvp = Module.findExportByName("libc.so", "execvp");
    if (execvp !== null) {
        Interceptor.attach(execvp, {
            onEnter: function (args) {
                var command = safeReadUtf8String(args[0]);
                console.log("[+] execvp() called with command: " + command);
                printArguments(args[1]); // Command-line arguments
            },
            onLeave: function (retval) {
                console.log("[+] execvp() returned with code: " + retval.toInt32());
            }
        });
    }

    // Hook system()
    var system = Module.findExportByName("libc.so", "system");
    if (system !== null) {
        Interceptor.attach(system, {
            onEnter: function (args) {
                var command = safeReadUtf8String(args[0]);
                console.log("[+] system() called with command: " + command);
            },
            onLeave: function (retval) {
                console.log("[+] system() returned with code: " + retval.toInt32());
            }
        });
    }
});
