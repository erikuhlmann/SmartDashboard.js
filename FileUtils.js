class FileUtils {
    static getThemeLocation(){
        return "themes/" + SmartDashboard.options.theme + ".css";
    }
    
    static makeDataFolders(){
        var layoutsPath = FileUtils.getDataLocations().layouts;
        if (!require("fs").existsSync(layoutsPath)){
            require("fs").mkdirSync(layoutsPath);
        }
    }
    
    static getDataLocations(){
        var dataPath = require("nw.gui").App.dataPath;
        var installPath = process.cwd();
        return {
            themes: installPath + "/themes/",
            plugins: installPath + "/plugins/",
            layouts: dataPath + "/layouts/",
            save: dataPath + "/save.json",
            dsScript: dataPath + "/ds.bat",
            frcdata: "C:\\Users\\Public\\Documents\\FRC"
        };
    }
    
    static forAllFilesInDirectory(dir, cb){
        try {
            var normalizedPath = dir;
            fs.readdirSync(normalizedPath).forEach(function (file) {
                cb(file);
            });
        } catch (e) {
            SmartDashboard.handleError(e);
        }
    }
    
    static isDefaultDashboard(){
        try {
            var dsIni = fs.readFileSync(FileUtils.getDataLocations().frcdata + "\\FRC DS Data Storage.ini").toString();
            var line = dsIni.match(/DashboardCmdLine[^\r\n]*\r\n/);
            return line != null && line[0].indexOf("ds.bat") > -1;
        } catch (e) {
            SmartDashboard.handleError(e);
        }
    }
    
    static setDefaultDashboard(isSdJs){
        try {
            var run;
            if(isSdJs){
                var sdDir = process.cwd();
                var nwjs = process.execPath;
                var scriptLocation = FileUtils.getDataLocations().dsScript;
                fs.writeFileSync(scriptLocation, "\"" + nwjs + "\" \"" + sdDir + "\" --ds-mode %*");
                run = scriptLocation;
                run = "\"\"" + run.replace(/\\/g, "\\\\") + "\"\"";
            } else {
                run = "\"\"C:\\Program Files (x86)\\FRC Dashboard\\Dashboard.exe\"\"";
            }
            var dsIni = fs.readFileSync(FileUtils.getDataLocations().frcdata + "\\FRC DS Data Storage.ini").toString();
            dsIni = dsIni.replace(/DashboardCmdLine[^\r\n]*\r\n/, "DashboardCmdLine = " + run + "\r\n");
            fs.writeFileSync(FileUtils.getDataLocations().frcdata + "\\FRC DS Data Storage.ini", dsIni);
        } catch (e) {
            SmartDashboard.handleError(e);
        }
    }
}

global.FileUtils = FileUtils;